var FbSocialApi = function(params, callback) {
	var instance = this;

	var apiUrl = 'http://connect.facebook.net/en_US/all.js';

	/*params = jQuery.extend({}, params);*/

	var wrap = function() {
		return window[params.wrapperName];
	};

	var getUserFql = function(fields, uids) {
		return 'SELECT ' + fields + ' FROM user WHERE uid IN (' + uids + ')';
	};

	var moduleExport = {
		// raw api object - returned from remote social network
		raw: null,

		unifyFields: {
			id: 'uid',
			first_name: 'first_name',
			last_name: 'last_name',

			photo: 'pic_square',

			gender: function() {
				var value = arguments.length ? arguments[0] : false;
				if (!value) { return 'sex'; }
				return value == 'male' ? 'male' : 'female';
			}
		},

		// information methods
		getProfiles : function(uids, callback, errback) {
			if (! (uids instanceof Array)) {
				uids = (uids+'').split(',');
			}
			FB.Data.query(getUserFql(wrap().getApiFields(params.fields), uids.join(','))).wait(function(data) {
				// @todo проверка ошибки, errback
				return callback(wrap().unifyProfileFields(data));
			});
		},
		getFriends : function(callback, errback) {
			FB.Data.query(getUserFql(wrap().getApiFields(params.fields), 'SELECT uid2 FROM friend WHERE uid1 = me()')).wait(function(data) {
				// @todo проверка ошибки, errback
				return callback(wrap().unifyProfileFields(data));
			});
		},
		getCurrentUser : function(callback, errback) {
			moduleExport.getProfiles(FB.getSession().uid, function(data) { callback(data[0]); }, errback);
		},
		getAppFriends : function(callback, errback) {
			FB.api({method : 'friends.getAppUsers'}, function(data) {
				// @todo добавить получение профилей
				return callback(data);
			});
		},
		// utilities
		inviteFriends : function() {
			var local_params = arguments[0] || null;
			var local_callback = arguments[1] || null;
			if (typeof local_params == 'function') {
				local_callback = local_params;
			}

			FB.ui({method : 'apprequests', message : local_params.install_message, data : {} }, function(data){
				return local_callback ? local_callback(data) : null;
			});
		},
		resizeCanvas : function(params, callback) {
			FB.Canvas.setAutoResize(false);
			FB.Canvas.setSize(params.height);
			return callback ? callback() : null;
		},
		// service methods
		postWall : function(params, callback, errback) {
			params = jQuery.extend({id: FB.getSession().uid}, params);
			params.to = params.id;

			FB.ui(jQuery.extend({method: 'feed'}, params), function(response) {
				// @todo проверка ошибки, errback
				return callback(response);
			});
		},
		makePayment : function(params, callback, errback, closeDialogback) {
			FB.ui({ method: 'pay', order_info: params.order_info, purchase_type: 'item' }, function(data){
				if (data['order_id']) {
					return callback(data);
				}
				else {
					return callback({});
					// @todo проверка ошибки, errback, closeDialogback
				}
			});
		}
	};

	// constructor
	if (!jQuery('#fb-root').length) {
		jQuery("body").prepend(jQuery("<div id='fb-root'></div>"));
	}
	jQuery.getScript(apiUrl, function() {
		FB.init({appId: params.fb_id, status: true, cookie: true, xfbml: false});

		moduleExport.raw = FB;

		// export methods
		instance.moduleExport = moduleExport;

		callback ? callback() : null;
	});
};
