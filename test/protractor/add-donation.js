describe('Add Donation', function() {
	it('should have a disabled submit button if necessary details are not entered', function() {
		browser.get('http://localhost/MAD/apps/donut/app/#/add-donation');
		expect(browser.getTitle()).toEqual('Add Donation');

		var action = element(by.css('#action'));
		expect(action.isEnabled()).toBe(false);

		element(by.model('addDon.donation.name')).sendKeys('Protractor Test Donor');
		expect(action.isEnabled()).toBe(false);

		var amount = element(by.model('addDon.donation.amount'));
		if(!skip) {
			amount.sendKeys('abcd');
			expect(hasClass(amount, 'ng-invalid')).toBe(true);
		}
		amount.clear();amount.sendKeys('13');
		expect(action.isEnabled()).toBe(false);

		var phone = element(by.model('addDon.donation.phone'));
		if(!skip) {
			phone.sendKeys('Bad Number');
			expect(hasClass(phone, 'ng-invalid')).toBe(true);
			phone.clear();phone.sendKeys('7');
			expect(hasClass(phone, 'ng-invalid')).toBe(true);
			phone.clear();phone.sendKeys('123456789');
			expect(hasClass(phone, 'ng-invalid')).toBe(true);
			phone.clear();phone.sendKeys('12345678x93');
			expect(hasClass(phone, 'ng-invalid')).toBe(true);
			phone.clear();phone.sendKeys('1234567890123456');
			expect(hasClass(phone, 'ng-invalid')).toBe(true);
		}
		phone.clear();phone.sendKeys('974606' + randomNumberString(4)); // Random string for number and email because same user will trigger confirmation
		expect(hasClass(phone, 'ng-invalid')).toBe(false);
		expect(action.isEnabled()).toBe(false);

		var email = element(by.model('addDon.donation.email'));
		if(!skip) {
			email.sendKeys('Bad Email');
			expect(hasClass(email, 'ng-invalid')).toBe(true);
			email.clear();email.sendKeys('binny');
			expect(hasClass(email, 'ng-invalid')).toBe(true);
			email.clear();email.sendKeys('binnyva@');
			expect(hasClass(email, 'ng-invalid')).toBe(true);
		}
		email.clear();email.sendKeys('binnyva' +  randomNumberString(4) + '@gmail.com');
		expect(hasClass(email, 'ng-invalid')).toBe(false);

		expect(action.isEnabled()).toBe(true);
	});

	var donation_id;
	it("should show the right success message when donation is submitted", function() {
		element(by.css('#action')).click(); // Submit.
		var success_message = element(by.css(".md-dialog-content p.ng-scope")).getText();

		expect(success_message).toContain("Donation of Rs 13 from donor 'Protractor Test Donor' added succesfully");
		success_message.then(function (text) {
			donation_id = text.replace(/^.+\(Donation ID\: (\d+)\)/, "$1");
		});
		element(by.css("md-dialog .md-button")).click(); // Click OK
	});

	it("should insert given data into the database", function() {
		browser.sleep(1000);
		// browser.wait(donation_id);
		db.query('SELECT * FROM donations WHERE id=' + donation_id, function(err, rows, fields) {
			if (err || !rows) {
				expect(1).toBe(0); // Always fail if it reaches this point.
				return;
			}
			expect(rows[0].donation_amount).toBe(13);
			expect(rows[0].donation_status).toBe('TO_BE_APPROVED_BY_POC');
			expect(rows[0].fundraiser_id).toBe(8902); // User with phone '9746068565'

			db.query('SELECT * FROM donours WHERE id=' + rows[0].donour_id, function(err, donor_row, fields) {
				if (err) {
					expect(1).toBe(0); // Always fail if it reaches this point.
					return;
				}

				expect(donor_row[0].first_name).toBe("Protractor Test Donor");
				expect(donor_row[0].email_id).toContain('binnyva');
				expect(donor_row[0].phone_no).toContain('974606'); // Random string - have to check parts.
			});
		});
	});
});
// db.end();

var hasClass = function (element, cls, debug) {
    return element.getAttribute('class').then(function (classes) {
        var status = classes.split(' ').indexOf(cls) !== -1;
        if(debug === true) console.log(classes, status);
		return status;
    });
};

function randomNumberString(length) {
    var text = "";
    var possible = "0123456789"; // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
