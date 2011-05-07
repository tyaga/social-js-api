var VkSocialApi = function(params, callback) {
	var instance = this;

	var apiUrl = 'http://vkontakte.ru/js/api/xd_connection.js?2';

	params = jQuery.extend({
		fields: 'uid,first_name,last_name,nickname,sex,bdate,city,country,timezone,photo,photo_medium,photo_big,domain',
		width: 827
	}, params);

	var moduleExport = {
		// raw api object - returned from remote social network
		raw: null,

		// information methods
		getFriends : function(callback) {
			VK.api('friends.get', { uid: VK.params.viewer_id, fields: params.fields}, function(data) {
				//if (data.error) throw data.error;

				callback ? callback(data.response) : null;
			});
		},
		getCurrentUser : function(callback) {
			VK.loadParams(document.location.href);
			VK.api('getProfiles', {uids: VK.params.viewer_id, fields: params.fields}, function(data) {
				//if (data.error) throw data.error;

				callback ? callback(data.response[0]) : null;
			});
		},
		getAppFriends : function(callback) {
			VK.api('execute', {code: 'API.getAppFriends();'}, function(data) {
				//if (data.error) throw data.error;

				if (data.response === null) {
					data.response = [];
				}
				callback ? callback(data.response) : null;
			});
		},
		// utilities
		inviteFriends : function(callback) {
			VK.addCallback('onWindowFocus', function() {
				VK.removeCallback('onWindowFocus');
				callback ? callback() : null;
			});
			VK.callMethod('showInviteBox');
		},
		resizeWindow : function(params, callback) {
			VK.callMethod('resizeWindow', params.width, params.height);
			callback ? callback() : null;
		},
		// service methods
		postWall : function(params, callback) {
			params = jQuery.extend({id: VK.params.viewer_id}, params);

			VK.api('wall.post', {owner_id: params.id, message: params.message}, function(data) {
				//if (data.error) throw data.error;

				callback ? callback(data.response) : null;
			});
		},
		makePayment : function(params, callback) {
			VK.addCallback('onWindowFocus', function() {
				VK.removeCallback('onWindowFocus');
				callback ? callback() : null;
			});
			VK.callMethod('showPaymentBox', params.votes);
		}
	};

	// constructor
	jQuery.getScript(apiUrl, function() {
		VK.init(function() {
			VK.loadParams(document.location.href);
			moduleExport.raw = VK;

			// export methods
			instance.moduleExport = moduleExport;

			callback ? callback() : null;
		});
	});
};
