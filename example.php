<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
	<title>API test app</title>

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js" type="text/javascript"></script>
	<script src="social-api.js" type="text/javascript"></script>

	<script type="text/javascript" language="javascript">
		function log() {
			for (var i in arguments) {
				console.log(arguments[i]);
				//jQuery('#debug').html(JSON.stringify(arguments[i], null, '  '));
			}
		}
		jQuery(document).ready(function() {
			var driver = '<?=$_GET['api']?>';
			var params = {
				mm_key: '1b6cf14981d250cb282adf96e33b4dde',
				fb_id: '173107166050886'
			};
			new SocialApiWrapper(driver, params, init);
		});

		function init() {
			var appFriendsCB = function(appFriends) {
				App.context.appFriends = appFriends;
				log(App.context);
				jQuery("#test-methods").show('fast');
			};
			var friendsCB = function(friends) {
				App.context.friends = friends;
				socialWrapper.getAppFriends(appFriendsCB);
			};
			var currentCB = function(user) {
				App.context.current = user;
				socialWrapper.getFriends(friendsCB);
			};
			socialWrapper.getCurrentUser(currentCB);
		}

		var App = {
			context: {
				friends: [],
				appFriends: [],
				current: null
			},
			postWall: function() {
				socialWrapper.postWall({
					id: App.context.friends[0].uid,
					message: 'test'
				}, function() {
					log('Message to the wall has posted');
				});
			},
			makePayment: function() {
				var params = {};
				switch(socialWrapper.getApiName()) {
					case 'mm':
						params = {
							service_id: 1,
							service_name: 'дьявольские вилы',
							sms_price: 3,
							other_price : 4000
						};
						break;
					case 'vk':
						params = {
							votes: 5
						};
						break;
				}
				socialWrapper.makePayment(params, function() {
					log('Payment has done!');
				});
			},
			testVK: function() {
				socialWrapper.raw.api('getGroups', {}, function(data){
					log(data.response);
				});
			}
		};

	</script>
</head>

<body>
	<h4>Тестируем методы socialWrapper</h4>
	<ul style="display:none;" id="test-methods">
		<li><a href="javascript:void(0);" onclick="App.postWall()">Опубликовать на стену певому в списке друзей</a></li>
		<li><a href="javascript:void(0);" onclick="App.makePayment()">Заплатить денег</a></li>
		<li><a href="javascript:void(0);" onclick="socialWrapper.inviteFriends()">Пригласить друзей</a></li>
		<li><a href="javascript:void(0);" onclick="socialWrapper.resizeWindow({height: 2000});">Увеличить высоту приложения</a></li>

		<li><a href="javascript:void(0);" onclick="App.testVK()">Только VK - getGroups</a></li>
	</ul>
	<pre>
		<div id="debug">
		</div>
	</pre>
</body>

</html>
<?
/*
http://developers.facebook.com/docs/reference/dialogs/feed/
FB:
	to: The ID or username of the profile that this story will be published to. If this is unspecified, it defaults to the the value of from.
	message:	The message to prefill the text field that the user will type in. To be compliant with Facebook Platform Policies, your application may only set this field if the user manually generated the content earlier in the workflow. Most applications should not set this.
	link: The link attached to this post
	picture: The URL of a picture attached to this post.
	source: The URL of a media file (e.g., a SWF or video file) attached to this post. If both source and picture are specified, only source is used.
	name: The name of the link attachment.
	caption: The caption of the link (appears beneath the link name).
	description: The description of the link (appears beneath the link caption).
	properties: A JSON object of key/value pairs which will appear in the stream attachment beneath the description, with each property on its own line. Keys must be strings, and values can be either strings or JSON objects with the keys text and href.

http://api.mail.ru/docs/reference/js/guestbook-post/
http://api.mail.ru/docs/reference/js/stream-post/
MM:
	Guestbook:
		'uid': 123,
		'title': 'заголовок записи, будет написан жирным шрифтом',
		'text': 'основной текст вашей записи',
		'img_url': 'http://exmaple.com/img.gif',
	Stream:
		'title': 'заголовок записи, будет написан жирным шрифтом',
		'text': 'основной текст вашей записи',
		'img_url': 'http://exmaple.com/img.gif',

http://vkontakte.ru/developers.php?o=-1&p=wall.post
VK:
	owner_id: идентификатор пользователя, у которого должна быть опубликована запись. Если параметр не задан, то считается, что он равен идентификатору текущего пользователя.
	message: текст сообщения (является обязательным, если не задан параметр attachment)
	attachment: медиа-приложение к записи
*/
?>