var channels = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","brunofin","comster404","test_channel"];
var status, name, game, description, followers, viewers, views, created_at, url;
var blank = "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;";

function getRandomChannels() {
	url = "https://api.twitch.tv/kraken/streams?limit=10&offset=%RAND";
	$.getJSON( url, function (response) {
		response.streams.forEach( function( item ) {
			setData(item);
			displayData();
		});		
	});
	getChannelData();
}

function getChannelData() {
	channels.forEach( function( item ) {
	url = "https://api.twitch.tv/kraken/streams/" + item;
	$.getJSON( url, function (response) {
		setDefaults(item);
		 if ( response.stream === null ) {
			status = "Offline";
		}
		setData(response.stream);
		displayData();
		}).fail(function(jqXHR, textStatus, errorThrown) {
    if(errorThrown == "status code 422") {
			status = "Account Closed";
			setDefaults(item);
			displayData();
		}
  });
	});
}

function setData(response) {
	if(response) {
		logo = response.channel.logo;
		name = response.channel.display_name;
		game = response.channel.game;
		status = response.channel.status;
		description = game + ": " + status;
		followers = response.channel.followers;
		viewers = response.viewers;
		views = response.channel.views;
		created_at = response.created_at;
		url = response.channel.url;
	}
}

function displayData() {
	var headerClass;
	if( status === "Offline" ) {
		headerClass = "offline";
	} else if ( status === "Account Closed" ) {
		headerClass = "account-closed";
	} else {
		headerClass = "";
	}
	html = '<div class="channel"><div class="row"><div class="col-sm-12"><div class="logo"><img src="' +
	logo + '"></div><div class="header-text ' + headerClass + '"><h2>' +
	name + '</h2><p class="description">' +
	description + '</p><a href="' + url + '" class="url">' +
	url + '</a></div></div></div><div class="row"><div class="col-sm-8"><dl><dt>Game</dt><dd>: ' +
	game + '</dd><dt>Status</dt><dd>: ' +
	status + '</dd><dt>Viewers</dt><dd>: ' +
	viewers + '</dd><dt>Streaming Since</dt><dd>: ' +
	created_at + '</dd><dt>Channel Views</dt><dd>: ' +
	views + '</dd></dl></div><div class="col-sm-4"><div class="followers"><p class="value">' +
	followers + '</p><p class="title">Followers</p></div></div></div>';
	$( ".content" ).append( html );
}

function setDefaults(item) {
	logo = "http://www.windowscentral.com/sites/wpcentral.com/files/styles/thumbnail/public/topic_images/2016/twitch-logo-topic.png";
	name = item;
	url = "https://www.twitch.tv/" + name;
	game = blank;
	description = status;
	followers = blank;
	viewers = blank;
	views = blank;
	created_at = blank;
}

getRandomChannels();