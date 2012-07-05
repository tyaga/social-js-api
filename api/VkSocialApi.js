/**
 * http://vk.com/developers.php
 * 
 * @param params
 * @param callback
 */
var VkSocialApi = function(params, callback) {
	var instance = this;

	var apiUrl = 'http://vk.com/js/api/xd_connection.js?2';

	params = jQuery.extend({
		width: 827
	}, params);

	var wrap = function() {
		return window[params.wrapperName];
	};

	var moduleExport = {
		// raw api object - returned from remote social network
		raw: null,

		unifyFields: {
			id: 'uid',
			first_name: 'first_name',
			last_name: 'last_name',
			birthdate: 'bdate',
			nickname: 'nickname',

			photo: 'photo', // 50px
//			photo_medium: 'photo_medium', // 100px
//			photo_big: 'photo_big', // 200px
//			photo_medium_rec: 'photo_medium_rec', // 100px sq
//			photo_rec: 'photo_rec', // 50px sq

			gender: function() {
				var value = arguments.length ? arguments[0] : false;
				if (!value) { return 'sex'; }
				return value == 2 ? 'male' : 'female';
			}
		},
		// information methods
		getProfiles: function(uids, name_case, callback, errback) {
			if (! (uids instanceof Array)) {
				uids = (uids+'').split(',');
			}
			if (typeof name_case == 'function') {
				callback = arguments[1];
				errback = arguments[2];
			}
			VK.api('getProfiles', {uids: uids.join(','), fields: wrap().getApiFields(params.fields), name_case: name_case}, function(data) {
				if (data.error) {
					return errback ? errback(data.error) : callback({});
				}
				return callback(wrap().unifyProfileFields(data.response));
			});
		},
		getFriends : function(callback, errback) {
			VK.api('friends.get', { uid: VK.params.viewer_id, fields: wrap().getApiFields(params.fields)}, function(data) {
				if (data.error) {
					return errback ? errback(data.error) : callback([]);
				}
				if (data.response === null) {
					data.response = [];
				}
				return callback(wrap().unifyProfileFields(data.response));
			});
		},
		getCurrentUser : function(callback, errback) {
			VK.loadParams(document.location.href);
			moduleExport.getProfiles(VK.params.viewer_id, function(data) { callback(data[0]); }, errback);
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
