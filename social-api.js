var SocialApiWrapper = function(driver, params, callback) {
	// default settings
	params = jQuery.extend({
		// env settings
		api_path: 'api/',
		wrapperName: 'socialWrapper',

		// init context settings
		init_user: false,
		init_friends: false,

		// unify profile settings
		unify_profile_fields: false,
		not_unified_fields: true,

		// resize settings
		init_resize_canvas: false,
		min_height: 1000,
		define_height_fn: function() {
			var height = jQuery(document.body).outerHeight(true);
			return height > params.min_height ? height : params.min_height;
		},
		resize_interval: 500
	}, params);

	var driverNames = {
		VkSocialApi: ['vk', 'vkontakte'],
		MmSocialApi: ['mm', 'mail', 'mir', 'mailru'],
		FbSocialApi: ['fb', 'facebook'],
		OkSocialApi: ['ok', 'odnoklassniki', 'odkl']
	};
	/**
	 * чтобы удобно обращаться к глобальному wrap
	 */
	var wrap = function() {
		return window[params.wrapperName];
	};

	// private
	/**
	 * Возвращает название класса для драйвера соцсети
	 * 
	 * @param driverName
	 */
	var resolveApiName = function(driverName) {
		for (var driver in driverNames) {
			var names = driverNames[driver];
			for (var i in names) {
				if (driverName == names[i]) {
					return driver;
				}
			}
		}
		return false;
	};
	/**
	 * Заменяет свойства profile значениями из массива unifyFields
	 *
	 * @param profile object
	 */
	var unifyProfileFields = function(profile) {
		// если нет настройки, то вернуть profile
		if (!params.unify_profile_fields) {
			return profile;
		}
		var unifyFields = wrap().unifyFields;

		// проходим по всем полям unified
		var result = {};
		for (var field in unifyFields) {
			var fieldItem = unifyFields[field];

			// по нужному ключу
			if (fieldItem in profile && typeof fieldItem == 'string') {
				result[field] = profile[fieldItem];
				// удалили записанное
				delete profile[fieldItem];
			}
			else {
				// например, пол - разные значения в разных соцсетях
				var fieldName = fieldItem();
				result[field] = fieldItem(profile[fieldName]);
				delete profile[fieldName];
			}
		}
		// если наряду с сведенными надо сохранить обычные
		if (params.not_unified_fields) {
			for (var not_unified_field in profile) {
				result[not_unified_field] = profile[not_unified_field];
			}
		}
		return result;
	};

	var moduleExport = {
		/**
		 * Инициализация автоизменения размера iframe приложения
		 */
		initResizeCanvas: function() {
			window.setInterval(function() {
				wrap().resizeCanvas({height: params.define_height_fn()});
			}, params.resize_interval);
		},
		/**
		 * Получает данные о текущем пользователе
		 *
		 * @param localParams {init_friends, init_user}
		 * @param callback сюда будет передан context
		 */
		initContext: function(localParams, callback) {
			var context = {};

			var friendsCallback = function(friends) {
				context.friends = friends;
				wrap().getAppFriends(function(appFriends) {
					context.appFriends = appFriends;
					callback ? callback(context) : null;
				});
			};
			var currentUserCallback = function(user) {
				context.current = user;
				localParams.init_friends ? wrap().getFriends(friendsCallback) : friendsCallback({});
			};
			localParams.init_user ? wrap().getCurrentUser(currentUserCallback) : currentUserCallback({});
		},
		/**
		 * Возвращает название текущей соцсети
		 *
		 * @param full формат вывода
		 */
		getApiName: function(/*full = false*/) {
			return driverNames[driverName][(arguments[0] ? 1 : 0)];
		},
		/**
		 * Заменяет свойства profile значениями из массива unifyFields
		 *
		 * @param data array|object
		 */
		unifyProfileFields: function (data) {
			var is_array = true;
			if (!(data instanceof Array)) {
				is_array = false;
				data = [data];
			}
			for (var i in data) {
				var item = data[i];
				data[i] = unifyProfileFields(item);
			}
			return is_array ? data : data[0];
		}
	};

	var driverName = resolveApiName(driver);
	if (!driverName) {
		return false;
	}

	var initWrapper = function() {
		// create local wrapper
		var privateSocialWrapper = new window[driverName](params, function() {

			// creating global wrapper variable
			window[params.wrapperName] = jQuery.extend(moduleExport, privateSocialWrapper.moduleExport);
			// immediately delete unnecessary global variable created inside **SocialApi
			delete window[driverName];

			// init resize
			if (params.init_resize_canvas) {
				wrap().initResizeCanvas();
			}
			// init context data
			wrap().initContext({init_friends: params.init_friends, init_user: params.init_user}, callback);
		});
	};
	// constructor
	if (typeof window[driverName] == 'function') {
		initWrapper();
	}
	else {
		//jQuery.ajaxSetup({cache: true}); // restore default value
		jQuery.getScript(params.api_path + driverName + '.js', initWrapper);
	}
};
