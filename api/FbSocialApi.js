var FbSocialApi = function(params, callback) {
	var instance = this;

	var apiUrl = 'http://connect.facebook.net/en_US/all.js';

	params = jQuery.extend({
		install_message: 'install this great app',
		fields: 'uid,first_name,middle_name,last_name,name,locale,current_location,pic_square,profile_url,sex'
	}, params);

	this.getApiName = function () { return 'fb'; };

	// information methods
	this.getFriends = function(callback) {
		FB.Data.query('SELECT ' + params.fields + ' FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())').wait(function(data) {
			callback ? callback(data) : null;
		});
	};
	this.getCurrentUser = function(callback) {
		FB.api('me', {locale : 'en_US'}, function(data) {
			callback ? callback(data) : null;
		});
	};
	this.getAppFriends = function(callback) {
		FB.api({method : 'friends.getAppUsers'}, function(data) {
			callback ? callback(data) : null;
		});
	};
	// utilities
	this.inviteFriends = function(callback) {
		FB.ui({method : 'apprequests', message : params.install_message, data : params.install_data }, function(data){
			callback ? callback(data) : null;
		});
	};
	this.resizeWindow = function(params, callback) {
		FB.Canvas.setSize(params.height);
		callback ? callback() : null;
	};
	// service methods
	this.postWall = function(params, callback) {
		params = jQuery.extend({id: FB.getSession().uid}, params);
		params.to = params.id;

		FB.ui(jQuery.extend({method: 'feed'}, params), function(response) {
			callback ? callback(response) : null;
		});
	};
	this.makePayment = function(params, callback) {
		FB.ui({ method: 'pay', order_info: params.order_info, purchase_type: 'item' }, function(data){
			if (data['order_id']) {
				callback ? callback(data) : null;
			}
		});
	};

	// constructor
	if (!jQuery('#fb-root').length) {
		jQuery("body").prepend(jQuery("<div id='fb-root'></div>"));
	}
	jQuery.getScript(apiUrl, function() {
		FB.init({appId: params.fb_id, status: true, cookie: true, xfbml: false});
		FB.Canvas.setAutoResize(false);
		instance.raw = FB;
		callback ? callback() : null;
	});
};
