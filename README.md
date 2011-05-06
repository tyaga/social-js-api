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

*  socialWrapper.getApiName

Для работы требуется jQuery.

		jQuery(document).ready(function() {
			var driverName = 'vk'; // или mm, или facebook: см resolveApiName в social-api.js
			var params = { mm_key: 'xxx', fb_id: 'xxx' };
			new SocialApiWrapper(driverName, params, callback);
		});

После выполнения будет доступен window.socialWrapper .

В example.php - пример использования. Этот пример работает в трех соц.сетях как iframe-приложение под такими адресами:

*  http://url.com/example.php?api=vk
*  http://url.com/example.php?api=mm
*  http://url.com/example.php?api=fb

Здесь нет обработки пермишенов, это можно сделать в настройках приложения (VK, MM), или на сервере. Здесь также пока нет обработки ошибок.

Разработка начата, пока не стоит это использовать, api может измениться, и изменится.

В планах - Одноклассники.