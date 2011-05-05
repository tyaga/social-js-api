var Mm = function(params, callback) {
	var instance = this;
	instance.api = null;

	// private
	var apiUrl = 'http://cdn.connect.mail.ru/js/loader.js';
	var wrap_api = function(fn) {
		mailru.loader.require('api', fn);
	};
	// public
	this.getApiName = function () { return 'mm'; };

	// information methods
	this.getFriends = function(callback) {
		wrap_api(function() {
			mailru.common.friends.getExtended(function(data) {
				callback ? callback(data) : null;
			});
		});
	};
	this.getCurrentUser = function(callback) {
		wrap_api(function() {
			mailru.common.users.getInfo(function(data) {
				callback ? callback(data[0]) : null;
			});
		});
	};
	this.getAppFriends = function(callback) {
		wrap_api(function() {
			mailru.common.friends.getAppUsers(function(data) {
				if (data === null) {
					data = [];
				}
				callback ? callback(data) : null;
			}, { ext: true });
		});
	};
	// utilities
	this.inviteFriends = function(callback) {
		wrap_api(function() {
			var eventINVId = mailru.events.listen(mailru.app.events.friendsInvitation, function(event) {
				if (event.status !== 'opened') {
					mailru.events.remove(eventINVId);
					callback ? callback(event) : null;
				}
			});
			mailru.app.friends.invite();
		});
	};
	this.resizeWindow = function(params, callback) {
		mailru.app.utils.setHeight(params.height);
		callback ? callback() : null;
	};
	// service methods
	this.postWall = function(params, callback) {
		params = $.extend({'id': mailru.session.vid}, params);
		wrap_api(function() {
			if (params.id == mailru.session.vid) {
				var eventSTId = mailru.events.listen(mailru.common.events.streamPublish, function(event) {
					if (event.status !== 'opened') {
						mailru.events.remove(eventSTId);
						callback ? callback(event) : null;
					}
				});
				mailru.common.stream.post({text: params.message}, function(data) {});
			}
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
	};
	this.makePayment = function(params, callback) {
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
	};
	// constructor
	$(document).ready(function() { $.getScript(apiUrl, function() {
		wrap_api(function() {
			mailru.app.init(params.mm_key);
			instance.api = mailru;
			callback ? callback() : null;
		});
	})});
};