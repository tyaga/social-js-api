var FbSocialApi = function(params, callback) {
	var instance = this;

	var apiUrl = 'http://connect.facebook.net/en_US/all.js';

	params = jQuery.extend({
		fields: 'uid,first_name,middle_name,last_name,name,locale,current_location,pic_square,profile_url,sex'
	}, params);

	var moduleExport = {
		// raw api object - returned from remote social network
		raw: null,

		unifyFields: {
			id: 'uid',
			first_name: 'first_name',
			last_name: 'last_name',
			photo: 'pic_square'
		},

		// information methods
		getFriends : function(callback, errback) {
			FB.Data.query('SELECT ' + params.fields + ' FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())').wait(function(data) {
				// @todo проверка ошибки, errback
				return callback(data);
			});
		},
		getCurrentUser : function(callback, errback) {
			FB.api('me', {locale : 'en_US'}, function(data) {
				// @todo проверка ошибки, errback
				return callback(data);
			});
		},
		getAppFriends : function(callback, errback) {
			FB.api({method : 'friends.getAppUsers'}, function(data) {
				// @todo проверка ошибки, errback
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
