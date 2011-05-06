var SocialApiWrapper = function(driver, params, callback) {
	params = jQuery.extend({
		api_path: 'api/'
	}, params);

	// private
	var resolveApiName = function(driverName) {
		var name = '';
		switch (driverName.toLowerCase()) {
			case 'vk': case 'vkontakte':
				name = 'VkSocialApi';
				break;
			case 'mm': case 'mir': case 'mail': case 'mailru':
				name = 'MmSocialApi';
				break;
			case 'fb': case 'facebook':
				name = 'FbSocialApi';
				break;
		}
		return name;
	};

	// constructor
	var driverName = resolveApiName(driver);
	jQuery.getScript(params.api_path + driverName + '.js', function() {
		delete params.api_path;
		window.socialWrapper = new window[driverName](params, init);
	});
};
