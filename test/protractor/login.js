// Created using http://www.protractortest.org/#/tutorial
describe('Donut Tests', function() {
	if(0) {
	it('shows an error if password is wrong', function() {
		browser.get('http://localhost/Sites/community/makeadiff/makeadiff.in/apps/donut/app/#/login');
		expect(browser.getTitle()).toEqual('Login');

		element(by.model('loginCtrl.login.phone')).sendKeys('9746068565');
		element(by.model('loginCtrl.login.password')).sendKeys('wrong-password');
		element(by.css('#action')).click();

		expect(element(by.css('.error-message')).getText()).toEqual("Incorrect Password.");
	});

	it('shows a "user not found" error if user details are wrong', function() {
		browser.get('http://localhost/Sites/community/makeadiff/makeadiff.in/apps/donut/app/#/login');
		expect(browser.getTitle()).toEqual('Login');

		element(by.model('loginCtrl.login.phone')).sendKeys('0125454543');
		element(by.model('loginCtrl.login.password')).sendKeys('wrong-password');
		element(by.css('#action')).click();

		expect(element(by.css('.error-message')).getText()).toEqual("Can't find any user with the given phone number/email.");
	});
	}

	it('should login if user details are correct', function() {
		browser.get('http://localhost/Sites/community/makeadiff/makeadiff.in/apps/donut/app/#/login');
		expect(browser.getTitle()).toEqual('Login');

		element(by.model('loginCtrl.login.phone')).sendKeys('9746068565');
		element(by.model('loginCtrl.login.password')).sendKeys('pass');
		element(by.css('#action')).click();

		expect(browser.getTitle()).toEqual("Home");
	});
});
