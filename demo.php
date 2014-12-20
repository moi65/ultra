<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
		<!-- Bootstrap Core CSS -->
		<link href="css/bootstrap.min.css" rel="stylesheet">

		<!-- Custom CSS -->
		<link href="css/index.css" rel="stylesheet">
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body ng-app="chat">
        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <!-- Add your site or application content here -->
		<?php include 'header.php';?>
        <div class="container demo-container">
			<div id="intro-section" ng-controller="LoginBoxController">
				<script type="text/ng-template" id="loginModal">
					<div class="modal-header" style="background: #00396a; border-radius: 2px 2px 0 0;">
						<h3 style="color: #fff; float: left;">Join in chat room</h3>
						<div class="clearfix"></div>
					</div>
					<div class="modal-body text-center">
						<span class="join-error-status text-danger"></span>
						<form id="form-upload-logo" role="form">
							<input type="text" id="identity" ng-model="identity">
							<br/><br/>
							<button id="joinBtn" class="btn btn-primary" data-id="" ng-click="tryLogin()">Enter</button>
						</form>
						<div class="clearfix"></div>
					</div>
				</script>
			</div>
			
			<div id="group-section">
				<div class="row col-md-12">
					<span ng-controller="LanguageController">
						<select id="language" ng-model="lang" ng-change="languageChanged()">
							<option ng-repeat="lang in languages" value="{{lang.key}}">{{lang.value}}</option>
						</select>
					</span>
					<span ng-controller="GroupController">Logged in As: <span ng-bind="identity"></span><label></label>&nbsp;&nbsp;&nbsp;<a href="">logout</a></span>
					<span class="text-danger pull-right hidden compatibility-warning"><h4>Warning! Please use latest Google Chrome Browser for voice based service.</h4></span>
				</div>
				<div class="row">
					<div class="col-md-2 onlineUserContainer top10">
						<div class="col-md-12 text-center topGroupheader">
							<h4>Online Users</h4>
						</div>
						<div  class="col-md-12 border onlineUserList"  ng-controller="UserListController as usrCtl">
							<div class="row onlineUser" ng-repeat="user in users">
								<div class="col-md-2 text-left">
									<span class="glyphicon glyphicon-user "></span>
								</div>
								<div class="col-md-8  text-left identityName" ng-click="openPrivateChat(user)">{{user}}</div>
							</div>
						</div>
					</div>
					
					<div class="col-md-6 groupMsgContainer top10">
						<div class="row text-center topGroupheader">
							<h4>Group Chat History</h4>
						</div>
						<div id="groupBox" class="row " ng-controller="GroupMessageController">
							<div class="col-md-12 border msgList">
								<div class="row groupMsg" ng-repeat="msg in messages">
									<div class="col-md-2 text-left">
										<span class="glyphicon glyphicon-user avatar-pic"></span>
										<span class="name text-success sender"></span>
									</div>
									<div class="col-md-7  text-left content">{{msg.message}}</div>
									<div class="col-md-2  text-left np">
										<span class="timestamp">{{msg.timestamp}}</span>
									</div>
									<div class="col-md-1  text-left">
										<span class="glyphicon glyphicon-info-sign text-primary msgInfo" data-toggle="tooltip" data-placement="top" title="time and lang"></span>
									</div>
								</div>
							</div>
							<div class=""  >
								<textarea name="textToSend" id="textToSend" class="col-md-10" ng-model="textToSend"></textarea>
								<button type="button" class="btn btn-default btn-primary col-md-2 groupSendBtn" ng-click="sendGroupMessage()">Send</button>
							</div>
						</div>
					</div>
					
					
				</div>
				
				
				
				
			</div>
			
			<div id="private-section" class="row top10" ng-controller="PrivateMessageController as pCtl">
				<div class="col-md-3  privateChatBox" ng-repeat="box in boxes">
					<div class="row privateBorder" ng-class="box.class">
						<div class="col-md-12 topArea ">
							<div class="row">
								<span class="chatWith pull-left"></span>
								<span class="closeBox glyphicon glyphicon-remove pull-right"></span>
								<span class="audio start glyphicon glyphicon-earphone pull-right"></span>
								
							</div>
						</div>
						<div class="privateMsgList">
							<div class="privateMsg col-md-12 ">
								<div class="row">
									<div class="col-md-2 text-left np">
										<span class="name text-success sender">Rana</span>
									</div>
									<div class="col-md-7  text-left content">
										hello
									</div>
									<div class="col-md-2  text-left np">
										<span class="timestamp"></span>
									</div>
									<!--
									<div class="col-md-1  text-left">
										<span class="glyphicon glyphicon-info-sign text-primary msgInfo" data-toggle="tooltip" data-placement="top" title="time and lang"></span>
									</div>-->
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<textarea class="privateTextToSend col-md-8"></textarea>
						<button type="button" class="btn btn-default btn-primary col-md-4 privateSendBtn">Send</button>	
					</div>
				</div>
			</div>

		</div>
		<footer>
			<div class="row">
				<div class="col-md-12 text-center">
					<p>Copyright &copy; UpStageCoder 2014</p>
				</div>
			</div>
		</footer>
		
		
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.2.min.js"><\/script>')</script>
        <script src="js/plugins.js"></script>
        <script src="js/vendor/bootstrap.min.js"></script>
		<script src="js/vendor/respoke.min.js"></script>
		<script src="js/vendor/platform.js"></script>
		<script src="js/vendor/angular.min.js"></script>
		<script src="js/vendor/ui-bootstrap-tpls-0.12.0.js"></script>
		<script src="js/lib/speech.js"></script>
		<script src="js/lib/ULTraChat.js"></script>
		<script src="js/lib/ytranslator.js"></script>
		<!--<script src="js/ultra.js"></script>-->
		<script src="js/main.js"></script>
		<script src="js/factory.js"></script>
    </body>
</html>
