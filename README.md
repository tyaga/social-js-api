social-js-api - это JS-обертка для использования ряда методов социальных сетей VKontakte, Facebook и Мой мир.

Методы API

*  socialWrapper.getFriends
*  socialWrapper.getCurrentUser
*  socialWrapper.getAppFriends
*  socialWrapper.inviteFriends
*  socialWrapper.resizeWindow
*  socialWrapper.postWall
*  socialWrapper.makePayment

Методы:

*  socialWrapper.initResizeCanvas
*  socialWrapper.initContext
*  socialWrapper.getApiName

Для работы требуется jQuery.

		jQuery(document).ready(function() {
			var driverName = 'vk'; // или mm, или facebook: см resolveApiName в social-api.js
			var params = { mm_key: 'xxx', fb_id: 'xxx' }; // см example 
			new SocialApiWrapper(driverName, params, callback);
		});

После выполнения будет доступен window.socialWrapper .

В example.html - пример использования. Этот пример работает в трех соц.сетях как iframe-приложение под такими адресами:

*  http://url.com/example.html?api=vk
*  http://url.com/example.html?api=mm
*  http://url.com/example.html?api=fb

Здесь нет проверки пермишенов установленного приложения, это можно сделать в настройках приложения (VK, MM), или на сервере (FB).

Разработка начата, пока не стоит это использовать, api может измениться, и изменится. Лучше участвуйте.

В планах - api Одноклассников, авторизация с сайтов, обработка ошибок, обертка в deferred, много больше методов, клиентская загрузка медиа-файлов, и многое-многое другое.
