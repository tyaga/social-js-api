var Vk = function(params, callback) {
	var instance = this;

	var apiUrl = 'http://vkontakte.ru/js/api/xd_connection.js?2';
	instance.api = null;

	params = $.extend({
		fields: 'uid,first_name,last_name,nickname,sex,bdate,city,country,timezone,photo,photo_medium,photo_big,domain'
	}, params);

	// public
	this.getApiName = function () { return 'vk'; };

	// information methods
	this.getFriends = function(callback) {
		VK.api('friends.get', { uid: VK.params.viewer_id, fields: params.fields}, function(data) {
			callback ? callback(data.response) : null;
		});
	};
	this.getCurrentUser = function(callback) {
		VK.loadParams(document.location.href);
		VK.api('getProfiles', {uids: VK.params.viewer_id, fields: params.fields}, function(data) {
			callback ? callback(data.response[0]) : null;
		});
	};
	this.getAppFriends = function(callback) {
		VK.api('execute', {code: 'API.getAppFriends();'}, function(data) {
			if (data.response === null) {
				data.response = [];
			}
			callback ? callback(data.response) : null;
		});
	};
	// utilities
	this.inviteFriends = function(callback) {
		VK.addCallback('onWindowFocus', function() {
			VK.removeCallback('onWindowFocus');
			callback ? callback() : null;
		});
		VK.callMethod('showInviteBox');
	};
	this.resizeWindow = function(params, callback) {
		VK.callMethod('resizeWindow', 827, params.height);
		callback ? callback() : null;
	};
	// service methods
	this.postWall = function(params, callback) {
		params = $.extend({'id': VK.params.viewer_id}, params);

		VK.api('wall.post', {owner_id: params.id, message: params.message}, function(data) {
			callback ? callback(data.response) : null;
		});
	};
	this.makePayment = function(params, callback) {
		VK.addCallback('onWindowFocus', function() {
			VK.removeCallback('onWindowFocus');
			callback ? callback() : null;
		});
		VK.callMethod('showPaymentBox', params.votes);
	};
	// constructor
	$(document).ready(function() { $.getScript(apiUrl, function() {
		VK.init(function() {
			VK.loadParams(document.location.href);
			instance.api = VK;
			callback ? callback() : null;
		});
	})});
};