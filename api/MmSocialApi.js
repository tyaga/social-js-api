var MmSocialApi = function(params, callback) {
	var instance = this;

	// private
	var apiUrl = 'http://cdn.connect.mail.ru/js/loader.js';
	var wrap_api = function(fn) {
		mailru.loader.require('api', fn);
	};

	var moduleExport = {
		// raw api object - returned from remote social network
		raw: null,

		// information methods
		getFriends : function(callback) {
			wrap_api(function() {
				mailru.common.friends.getExtended(function(data) {
					callback ? callback(data) : null;
				});
			});
		},
		getCurrentUser : function(callback) {
			wrap_api(function() {
				mailru.common.users.getInfo(function(data) {
					callback ? callback(data[0]) : null;
				});
			});
		},
		getAppFriends : function(callback) {
			wrap_api(function() {
				mailru.common.friends.getAppUsers(function(data) {
					if (data === null) {
						data = [];
					}
					callback ? callback(data) : null;
				}, { ext: true });
			});
		},
		// utilities
		inviteFriends : function() {
			var local_params = arguments[0] || null;
			var local_callback = arguments[1] || null;
			if (typeof local_params == 'function') {
				local_callback = local_params;
			}

			wrap_api(function() {
				var eventINVId = mailru.events.listen(mailru.app.events.friendsInvitation, function(event) {
					if (event.status !== 'opened') {
						mailru.events.remove(eventINVId);
						local_callback ? local_callback(event) : null;
					}
				});
				mailru.app.friends.invite();
			});
		},
		resizeWindow : function(params, callback) {
			mailru.app.utils.setHeight(params.height);
			callback ? callback() : null;
		},
		// service methods
		postWall : function(params, callback) {
			params = jQuery.extend({'id': mailru.session.vid}, params);
			wrap_api(function() {
				// в stream если себе
				if (params.id == mailru.session.vid) {
					var eventSTId = mailru.events.listen(mailru.common.events.streamPublish, function(event) {
						if (event.status !== 'opened') {
							mailru.events.remove(eventSTId);
							callback ? callback(event) : null;
						}
					});
					mailru.common.stream.post({text: params.message}, function(data) {});
				}
				// в guestbook если другому
				else {
					var eventGBId = mailru.events.listen(mailru.common.events.guestbookPublish, function(event) {
						if (event.status !== 'opened') {
							mailru.events.remove(eventGBId);
							callback ? callback(event) : null;
						}
					});
					mailru.common.guestbook.post({text: params.message, uid: params.id}, function(data) {});
				}
			});
		},
		makePayment : function(params, callback) {
			wrap_api(function() {
				var eventDialogId = mailru.events.listen(mailru.app.events.paymentDialogStatus, function(event) {
					if (event.status !== 'opened') {
						mailru.events.remove(eventDialogId);
						callback ? callback(event) : null;
					}
				});
				var eventPaymentId = mailru.events.listen(mailru.app.events.incomingPayment, function(event) {
					mailru.events.remove(eventPaymentId);
					callback ? callback(event) : null;
				});
				mailru.app.payments.showDialog(params);
			});
		}
	};
	// constructor
	jQuery.getScript(apiUrl, function() {
		wrap_api(function() {
			mailru.app.init(params.mm_key);

			moduleExport.raw = mailru;

			// export methods
			instance.moduleExport = moduleExport;

			callback ? callback() : null;
		});
	});
};
