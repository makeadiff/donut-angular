exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
  	'login.js', 
  	'add-donation.js'
  ]
};
