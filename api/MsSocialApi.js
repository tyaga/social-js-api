var MsSocialApi = function(params, callback) {
	var instance = this;

	//var apiUrl = 'http://connect.facebook.net/en_US/all.js';

	params = jQuery.extend({
	//	fields: 'uid,first_name,middle_name,last_name,name,locale,current_location,pic_square,profile_url,sex'
	}, params);

	var moduleExport = {
		// raw api object - returned from remote social network
		raw: null,

		// information methods
		getFriends : function(callback, errback) {
		},
		getCurrentUser : function(callback, errback) {
		},
		getAppFriends : function(callback, errback) {
		},
		// utilities
		inviteFriends : function() {
			var local_params = arguments[0] || null;
			var local_callback = arguments[1] || null;
			if (typeof local_params == 'function') {
				local_callback = local_params;
			}

		},
		resizeCanvas : function(params, callback) {
			return callback ? callback() : null;
		},
		// service methods
		postWall : function(params, callback, errback) {
		},
		makePayment : function(params, callback, errback, closeDialogback) {
		}
	};

	// constructor
	jQuery.getScript(apiUrl, function() {

		//moduleExport.raw = ;

		// export methods
		instance.moduleExport = moduleExport;

		callback ? callback() : null;
	});
};
