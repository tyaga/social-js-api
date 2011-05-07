var FbSocialApi = function(params, callback) {
	var instance = this;

	var apiUrl = 'http://connect.facebook.net/en_US/all.js';

	params = jQuery.extend({
		install_message: 'install this great app',
		fields: 'uid,first_name,middle_name,last_name,name,locale,current_location,pic_square,profile_url,sex'
	}, params);


	var moduleExport = {
		// raw api object - returned from remote social network
		raw: null,

		// information methods
		getFriends : function(callback) {
			FB.Data.query('SELECT ' + params.fields + ' FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())').wait(function(data) {
				callback ? callback(data) : null;
			});
		},
		getCurrentUser : function(callback) {
			FB.api('me', {locale : 'en_US'}, function(data) {
				callback ? callback(data) : null;
			});
		},
		getAppFriends : function(callback) {
			FB.api({method : 'friends.getAppUsers'}, function(data) {
				callback ? callback(data) : null;
			});
		},
		// utilities
		inviteFriends : function(callback) {
			FB.ui({method : 'apprequests', message : params.install_message, data : params.install_data }, function(data){
				callback ? callback(data) : null;
			});
		},
		resizeWindow : function(params, callback) {
			FB.Canvas.setAutoResize(false);
			FB.Canvas.setSize(params.height);
			callback ? callback() : null;
		},
		// service methods
		postWall : function(params, callback) {
			params = jQuery.extend({id: FB.getSession().uid}, params);
			params.to = params.id;

			FB.ui(jQuery.extend({method: 'feed'}, params), function(response) {
				callback ? callback(response) : null;
			});
		},
		makePayment : function(params, callback) {
			FB.ui({ method: 'pay', order_info: params.order_info, purchase_type: 'item' }, function(data){
				if (data['order_id']) {
					callback ? callback(data) : null;
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
