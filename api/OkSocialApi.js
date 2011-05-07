var OkSocialApi = function(params, callback) {
	var instance = this;

	var apiUrl = '[api_server]js/fapi.js';

	// params

	var moduleExport = {
		// raw api object - returned from remote social network
		raw: null,

		// information methods
		getFriends : function(callback) {
			callback ? callback() : null;
		},
		getCurrentUser : function(callback) {
			callback ? callback() : null;
		},
		getAppFriends : function(callback) {
			callback ? callback() : null;
		},
		// utilities
		inviteFriends : function(callback) {
			callback ? callback() : null;
		},
		resizeWindow : function(params, callback) {
			callback ? callback() : null;
		},
		// service methods
		postWall : function(params, callback) {
			callback ? callback() : null;
		},
		makePayment : function(params, callback) {
			callback ? callback() : null;
		}
	};

	// constructor
	jQuery.getScript(apiUrl, function() {
		FAPI.init('[api_server]', '[apiconnection]', function() {
			moduleExport.raw = FAPI;

			// export methods
			instance.moduleExport = moduleExport;

			callback ? callback() : null;
		});
	});
};
