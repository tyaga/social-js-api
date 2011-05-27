/**
 * http://vkontakte.ru/developers.php
 * 
 * @param params
 * @param callback
 */
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

		unifyFields: {
			id: 'uid',
			first_name: 'first_name',
			last_name: 'last_name',
			photo: 'photo',
			// @todo тут придумать, как не передавать profile
			gender: function(profile) { return profile.sex == 2 ? 'male' : 'female'; }
		},
		// information methods
		getProfiles: function(uids, callback, errback) {
			VK.api('getProfiles', {uids: uid, fields: params.fields}, function(data) {
				if (data.error) {
					return errback ? errback(data.error) : callback({});
				}
				return callback(data.response);
			});
		},
		getFriends : function(callback, errback) {
			VK.api('friends.get', { uid: VK.params.viewer_id, fields: params.fields}, function(data) {
				if (data.error) {
					return errback ? errback(data.error) : callback([]);
				}
				if (data.response === null) {
					data.response = [];
				}
				return callback(window[params.wrapperName].unifyProfileFields(data.response));
			});
		},
		getCurrentUser : function(callback, errback) {
			VK.loadParams(document.location.href);
			VK.api('getProfiles', {uids: VK.params.viewer_id, fields: params.fields}, function(data) {
				if (data.error) {
					return errback ? errback(data.error) : callback({});
				}
				return callback(window[params.wrapperName].unifyProfileFields(data.response[0]));
			});
		},
		getAppFriends : function(callback, errback) {
			VK.api('execute', {code: 'API.getAppFriends();'}, function(data) {
				if (data.error) {
					errback ? errback(data.error) : callback({});
				}
				if (data.response === null) {
					data.response = [];
				}
				// @todo добавить получение профилей
				callback(data.response);
			});
		},
		// utilities
		inviteFriends : function() {
			var params = arguments[0] || null;
			var callback = arguments[1] || null;
			if (typeof params == 'function') {
				callback = params;
			}

			VK.addCallback('onWindowFocus', function() {
				VK.removeCallback('onWindowFocus');
				return callback ? callback() : null;
			});
			VK.callMethod('showInviteBox');
		},
		resizeCanvas : function(params, callback) {
			VK.callMethod('resizeWindow', params.width, params.height);
			return callback ? callback() : null;
		},
		// service methods
		postWall : function(params, callback, errback) {
			params = jQuery.extend({id: VK.params.viewer_id}, params);

			VK.api('wall.post', {owner_id: params.id, message: params.message}, function(data) {
				if (data.error) {
					return errback ? errback(data.error) : callback(data.error);
				}
				return callback(data.response);
			});
		},
		// как это сделать правильно?
		makePayment : function(params, callback, errback, closeDialogback) {
			// @todo что тут делать с errback?
			var balanceChanged = false;
			VK.addCallback('onWindowFocus', function() {
				VK.removeCallback('onWindowFocus');

				if (!balanceChanged) {
					return closeDialogback ? closeDialogback() : callback();
				}
			});
			VK.addCallback('onBalanceChanged', function() {
				VK.removeCallback('onBalanceChanged');

				balanceChanged = true;

				return callback();
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
