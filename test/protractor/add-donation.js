// var ConnectDatabase = require("../db-connect");
// var db_connection = new ConnectDatabase();
// db = db_connection.connection;
// db.connect();
var skip = false;

// Created using http://www.protractortest.org/#/tutorial
describe('Donut Tests', function() {
	it('should have a disabled submit button if necessary details are not entered', function() {
		browser.get('http://localhost/Sites/community/makeadiff/makeadiff.in/apps/donut/app/#/add-donation');
		expect(browser.getTitle()).toEqual('Add Donation');

		var action = element(by.css('#action'));
		expect(action.isEnabled()).toBe(false);

		element(by.model('addDon.donation.name')).sendKeys('Test Donor');
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
		phone.clear();phone.sendKeys('9746068561');
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
		email.clear();email.sendKeys('binnyvx@gmail.com');
		expect(hasClass(email, 'ng-invalid')).toBe(false);

		expect(action.isEnabled()).toBe(true);
	});

	it("should show the right success message when donation is submitted", function() {
		element(by.css('#action')).click();

		var message = element(by.css(".md-dialog-content p.ng-scope")).getText();
		expect(element(by.css(".md-dialog-content p.ng-scope")).getText()).toContain("Donation of Rs 13 from donor 'Test Donor' added succesfully");

		element(by.css("md-dialog .md-button")).click(); // Click OK


		// db.query('SELECT * from roles', function(err, rows, fields) {
		// 	if (err) {
		// 		it("should be a working SQL query. Error in test scirpt. SQL returning error", function () {
		// 			expect(1).toBe(0); // Always fail if it reaches this point.
		// 		});
		// 		return;
		// 	}

		// 	expect(rows[0].donation_amount).toBe(13);
		// });

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