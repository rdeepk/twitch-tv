var channels = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","brunofin","comster404","test_channel"];
var status, name, game, description, followers, viewers, views, created_at, url;
var blank = "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;";
var defaultLogo = "http://www.windowscentral.com/sites/wpcentral.com/files/styles/thumbnail/public/topic_images/2016/twitch-logo-topic.png";

/**
 * @summary Fetch the random channels from Twitch API and initiates the display.
 */
function displayRandomChannels() {
	url = "https://api.twitch.tv/kraken/streams?limit=10&offset=%RAND";
	$.getJSON( url, function( response ) {
		response.streams.forEach( function( item ) {
			setData( item );
			displayData();
		});		
	});
}

/**
 * @summary Wrapper function to start the process of getting channels data and display them.
 */
function displayChannelData() {
	displayRandomChannels();
	channels.forEach( function( item ) {
	url = "https://api.twitch.tv/kraken/streams/" + item;
	$.getJSON( url, function( response ) {
		if ( response.stream === null ) {
			status = "Offline";
		}
		setDefaults( item );
		setData( response.stream );
		displayData();
		}).fail( function( jqXHR, textStatus, errorThrown ) {
			if( errorThrown == "status code 422" ) {
				status = "Account Closed";
				setDefaults( item );
				displayData();
			}
  	});
	});
}

/**
 * @summary Sets the global data with the values from response object from Twitch API.
 *
 * @param object $response Response object from Twitch API.
 */
function setData( response ) {
	if( response ) {
		logo = response.channel.logo ? response.channel.logo : defaultLogo;
		name = response.channel.display_name;
		game = response.channel.game;
		status = response.channel.status.trunc(50);
		description = game + ": " + status;
		followers = response.channel.followers;
		viewers = response.viewers;
		views = response.channel.views;
		created_at = response.created_at;
		url = response.channel.url;
	}
}

/**
 * @summary Prototype for truncating the string.
 *
 * @param number $n Character count for truncated string.
 *
 * @return string Truncated string.
 */
String.prototype.trunc = String.prototype.trunc ||
function( n ){
	return ( this.length > n ) ? this.substr( 0, n-1 ) + '&hellip;' : this;
};

/**
 * @summary Sets and display the HTML for each channel.
 */
function displayData() {
	var headerClass = getHeaderClass();	
	html = '<div class="channel ' + headerClass + '"><div class="row"><div class="col-sm-12"><div class="logo"><img src="' +
	logo + '"></div><div class="header-text"><h2>' +
	name + '</h2><p class="description">' +
	description + '</p><a href="' + url + '" class="url">' +
	url + '</a></div></div></div><div class="row"><div class="col-sm-8"><dl><dt>Game</dt><dd><span class="seperator">: </span>' +
	game + '</dd><dt>Status</dt><dd><span class="seperator">: </span>' +
	status + '</dd><dt>Viewers</dt><dd><span class="seperator">: </span>' +
	viewers + '</dd><dt>Streaming Since</dt><dd><span class="seperator">: </span>' +
	created_at + '</dd><dt>Channel Views</dt><dd><span class="seperator">: </span>' +
	views + '</dd></dl><div class="clearfix"></div></div><div class="col-sm-4"><div class="followers"><p class="value">' +
	followers + '</p><p class="title">Followers</p></div></div></div>';
	if( headerClass == "" ) {
		$( ".content" ).prepend( html );
	} else {
		$( ".content" ).append( html );
	}
}

/**
 * @summary Decides the class to be applied on Header of the Channels.
 *
 * @return string Class name to be set to channel header.
 */
function getHeaderClass() {
	if( status === "Offline" ) {
		return "offline";
	} else if ( status === "Account Closed" ) {
		return "account-closed";
	} else {
		return "";
	}
}

/**
 * @summary Sets the default values for global variables.
 */
function setDefaults( item ) {
	logo = defaultLogo;
	name = item;
	url = "https://www.twitch.tv/" + name;
	game = blank;
	description = status;
	followers = blank;
	viewers = blank;
	views = blank;
	created_at = blank;
}

displayChannelData();