<?php
include 'common.php';

/** IMPORTANT Note. We are using PHP for session management. Login and auth is handled by PHP - apps/auth. It was handled by JS before, now that's depricated. */
$current_user = accessControl([]);
$current_user['user_id'] = $current_user['id'];
?><!doctype html>
<html ng-app="donutApp" class="no-js">
  <head>
	<meta charset="utf-8">
	<title ng-bind="title"></title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width">
	<!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
	<!-- build:css(.) styles/vendor.css -->
	<!-- bower:css -->
	<link rel="stylesheet" href="bower_components/angular-material/angular-material.css" />
	<!-- endbower -->
	<!-- endbuild -->
	<!-- build:css(.tmp) styles/main.css -->
	<link rel="stylesheet" href="styles/main.css">
	<!-- endbuild -->

  </head>
  <body check-user="">
	<!--[if lt IE 7]>
	  <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
	<![endif]-->

	<!-- Add your site or application content here -->


	<md-toolbar>
		<div class="md-toolbar-tools">
			<span><a href="#home">Menu</a></span>
			<span flex>
			</span>
			<span><a class="reduced">{{user_name}}</a></span>
			<md-button ng-show="user_name" class="white" href="https://makeadiff.in/apps/auth/logout.php">Logout</md-button>

		</div>
	</md-toolbar>

	<div ng-view=""></div>

	<script src="bower_components/jquery/dist/jquery.js"></script>
	<script src="bower_components/angular/angular.js"></script>
	<script src="bower_components/angular-animate/angular-animate.js"></script>
	<script src="bower_components/angular-cookies/angular-cookies.js"></script>
	<script src="bower_components/angular-resource/angular-resource.js"></script>
	<script src="bower_components/angular-route/angular-route.js"></script>
	<script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
	<script src="bower_components/angular-touch/angular-touch.js"></script>
	<script src="bower_components/angular-aria/angular-aria.js"></script>
	<script src="bower_components/angular-material/angular-material.js"></script>
	<script src="bower_components/x2js/xml2json.min.js"></script>
	<script src="bower_components/ngstorage/ngStorage.js"></script>
	<script src="bower_components/moment/moment.js"></script>
	

	<!-- Sentry Code - - >
	<script src="https://cdn.ravenjs.com/3.26.4/angular/raven.min.js" crossorigin="anonymous"></script>
	<script>Raven.config('https://26d6bfc3ed854cf199a6d45e002980ca@sentry.io/1327657').install();</script>
	<! -- -->

		<!-- LogRocket Init - ->
	<script src="https://cdn.logrocket.io/LogRocket.min.js" crossorigin="anonymous"></script>
	<script>window.LogRocket && window.LogRocket.init('2obogn/mad_donut');</script>
	-->

	<script src="scripts/app.js"></script>
	<script src="scripts/controllers/home.js"></script>
	<script src="scripts/controllers/add-donation.js"></script>
	<script src="scripts/controllers/view-donation.js"></script>
	<script src="scripts/controllers/deposit.js"></script>
	<script src="scripts/services/userservice.js"></script>
	<script src="scripts/directives/checkuser.js"></script>
	<script src="scripts/directives/file-upload.js"></script>
	<script src="scripts/controllers/login.js"></script>
	<script src="scripts/controllers/logout.js"></script>
	<script src="scripts/controllers/approvals.js"></script>
	<script src="scripts/controllers/approved-donations.js"></script>
	<script src="scripts/controllers/change-password.js"></script>
	<script src="scripts/controllers/add-nach-donation.js"></script>
	<script src="scripts/controllers/add-online-donation.js"></script>
	<script src="scripts/controllers/find-approve.js"></script>

	<script type="text/javascript">
	var current_user = <?php echo json_encode($current_user); ?>;
	</script>

	<!-- Google Analytics: change UA-XXXXX-X to be your site's ID -->
	 <script>
	   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	   })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	   ga('create', 'UA-5816278-5');
	   ga('send', 'pageview');
	</script>

</body>
</html>
