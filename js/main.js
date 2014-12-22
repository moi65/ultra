
function LanguageController($scope, $rootScope, translator) {
	$scope.languages = [{"key":null, "value":"Select language"}];
	$scope.lang = null;
	//TODO error: initial value isn't being selected
	translator.getLanguageList(function(languages){
		$scope.$apply(function () {
			angular.forEach(languages, function(language, key) {
				$scope.languages.push({"key":key, "value":language});
			});
		});
	});

	$scope.languageChanged = function(){
		console.log("language just changed");
		$rootScope.$broadcast("languageChanged");
		//TODO haven't caught anywhere yet/validation
	}
}

function LoginBoxController($scope, $modal){

	var modalInstance = $modal.open({
		templateUrl: 'loginModal',
		controller: 'LoginAttemptController',
		size: 'md',
		backdrop :'static'
	});
}

function LoginAttemptController($scope, $modalInstance, uchat, $rootScope,getIdentity) {
	$scope.tryLogin = function(){
		if ((!$scope.identity) || ($scope.identity.length < 3)){
			return alert("username must be at least 3 letter");
		}
		uchat.connect($scope.identity, function(status) {
			if (!status) {
				console.err("Couldn't connect");
				return false;
			}
			else {
				console.log("Connection successfull!");
				$modalInstance.close();
				getIdentity.dataIdentity = $scope.identity;
				$rootScope.$broadcast("loginSuccess");
			}
		});
	}
}

function GroupController($scope, $rootScope, uchat, getIdentity) {

	$scope.$on("loginSuccess", function(){
		$scope.identity = getIdentity.dataIdentity;
		uchat.joinGroup("UpStageCoder",
			function memberJoined(member) {
				//TODO member joined
				$rootScope.$broadcast("newMemberJoin", member);
			}, function memberLeaved(member) {
				//TODO member leaved
				$rootScope.$broadcast("memberLeave", member);
			}, function (status) {
				if (status) {
					console.log("Joined group successfully");
					$rootScope.$broadcast("groupJoinSuccess");
				}
				else {
					console.log("group join attempt failed");
				}
		});
		
	});

}

function UserListController($scope, $rootScope, uchat, getIdentity){
	$scope.users = [];
	
	$scope.addUser = function(user){
		$scope.$apply(function () {
			$scope.users.push(user.id);
		});
	};
	$scope.removeUser = function(user){
		$scope.$apply(function () {
			$scope.users.splice($scope.users.indexOf(user.id), 1);
		});
	};
	$scope.openPrivateChat = function(userId) {
		console.log("Trying private chat: "+userId);
		//TODO not yet being listened
		$rootScope.$broadcast("privateChatAttempt",userId);
	};
	$scope.$on("groupJoinSuccess", function(){
		console.log("loading user list");
		$scope.identity = getIdentity.dataIdentity;
		uchat.getGroupMembers(function(members){
			angular.forEach(members, function(member, index) {
				
				if(member.getEndpoint().id!=$scope.identity)
				$scope.addUser(member.getEndpoint());
			});
		});
	});
	$scope.$on("newMemberJoin", function(event, member){
		//console.log("new member id: "+member.id);
		$scope.addUser(member.getEndpoint());
	});
	$scope.$on("memberLeave", function(event, member){
		//console.log("Leaving member id: "+member.getEndpoint()));
		$scope.removeUser(member.getEndpoint());
	});
}

function GroupMessageController($scope, $rootScope, uchat) {
	$scope.messages = [];

	$scope.textToSend = "";

	//TODO catch language change event
	$scope.lang = "en";
	
	$scope.sendGroupMessage = function() {
		console.log("sending text: "+$scope.textToSend);
		var messageObj = {};
		messageObj["message"] = $scope.textToSend;
		messageObj["lang"]    = $scope.lang;
		messageObj["type"]    = 'text';
		messageObj["genre"]   = 'group';
		messageObj["timestamp"]   = Date.now();
		//console.log(messageObj);
		$scope.textToSend = "";
		uchat.sendGroupMessage(messageObj, $scope.loadGroupMessageHistory);
	};
	
	$scope.loadGroupMessageHistory = function(sender, msg){
		console.log("loading to message history");
		msg.sender = sender;
		
		$scope.$apply(function () {
			var timestamp = new Date(msg.timestamp);
			var newDate   = new Date();
			newDate.setTime(timestamp);
			var dateString = newDate.toLocaleTimeString();
			msg.timestamp  = dateString;
			$scope.messages.push(msg);
			console.log(msg);
		});
	};
	
	$scope.loadPrivateMessageHistory = function(){
		
	}
	uchat.onMessage($scope.loadGroupMessageHistory,$scope.loadPrivateMessageHistory);
}


function PrivateChatBoxesController($scope, $rootScope, uchat) {
	$scope.boxes = [{class: "private-chat-rana"}];
	
	
}

function PrivateMessageController($scope, $rootScope, uchat) {
	//$scope.prototype = new GroupMessageController($scope, $rootScope, uchat);
	$scope.boxes = {}; 
	$scope.$on("privateChatAttempt",function(event,userId){
		uchat.joinPrivateChat(userId, function(){
			
			if(!$scope.boxes[userId]){
				
				$scope.boxes[userId]= {"messages":[]};
			}
			//initAudioListener(userId);
		});
		
	});
	

	//TODO catch language change event
	$scope.lang = "en";
	
	$scope.sendPrivateMessage = function(userId) {
		
		var messageObj = {};
		messageObj["message"] = $scope.textToSend;
		messageObj["lang"]    = $scope.lang;
		messageObj["type"]    = 'text';
		messageObj["genre"]   = 'private';
		messageObj["timestamp"]   = Date.now();
		$scope.textToSend = "";
		uchat.sendPrivateMessage(messageObj, userId, $scope.loadPrivateMessageHistory);
	};
	
	$scope.loadPrivateMessageHistory = function(sender, receiver, msg){
		console.log("kkk"+sender);
		/*
		if(messageObj.type == "voice" && sender != "Me") {
			robotSpeaker.speak(messageObj.lang, messageObj.message);
		}*/
		console.log(msg);
		msg.sender = sender;
		
		$scope.$apply(function () {
			var timestamp = new Date(msg.timestamp);
			var newDate   = new Date();
			newDate.setTime(timestamp);
			var dateString = newDate.toLocaleTimeString();
			msg.timestamp  = dateString;
			$scope.boxes[receiver].messages.push(msg);
		});
		/*var privateChatBox  = $('.privateChatBox');
		var privateChatname = 'private-chat-'+sender;
		if(sender=="Me")
			privateChatname = 'private-chat-'+receiver;

		if(!privateChatBox.hasClass(privateChatname)){
			enterPrivateChat(sender);
		}
		var msgRows = $('.'+privateChatname +' .privateMsg');
		var timestamp = new Date(messageObj.timestamp);
		var newDate = new Date();
		newDate.setTime(timestamp);
		timeString = newDate.toLocaleTimeString();
		//timestamp     = timestamp.getHours()+":"+timestamp.getMinutes()+":"+timestamp.getSeconds();
		var messageType = "";
		if(messageObj.type=="voice")
			messageType = "(Voice) ";
		var newRow = msgRows.first().clone();
		newRow.find(".sender").text(sender);
		newRow.find(".content").text(messageType+messageObj.message);
		newRow.find(".timestamp").text(timeString);
		//newRow.find(".msgInfo").attr("title","Original Language: "+messageObj.lang);
		newRow.show();
		msgRows.last().after(newRow);*/
		
    
	}
}


var app = angular.module("chat",['ui.bootstrap'])
.config(function($provide) {
	var translator = new YTranslator("trnsl.1.1.20141130T053443Z.abe0172019286ab4.38cf8c2055843d9fa61079da020e63286c7c5dcf");
	$provide.factory('translator', function(){
		return translator;
	});
	$provide.factory('uchat', function(){
		return new ULTraChat(translator);
	});
});


app.factory("getIdentity", function(){
  return {dataIdentity: null }
});



app.controller("UserListController", UserListController);
app.controller("GroupController", GroupController);
app.controller("LoginAttemptController", LoginAttemptController);
app.controller("LoginBoxController", LoginBoxController);
app.controller("LanguageController", LanguageController);
app.controller("GroupMessageController", GroupMessageController);
app.controller("PrivateMessageController", PrivateMessageController);
app.controller("PrivateChatBoxesController", PrivateChatBoxesController);

$(document).ready(function(){
	//$('.carousel').carousel();
});