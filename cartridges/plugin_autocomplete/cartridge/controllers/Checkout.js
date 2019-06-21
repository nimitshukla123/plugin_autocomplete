'use strict';

var base = module.superModule;
var server = require('server');
server.extend(base);

/**
 * If there is an api key creates the url to include the google maps api else returns null
 * @param {string} apiKey - the api key or null
 * @returns {string|Null} return the api
 */
function getGoogleMapsApi(apiKey) {
	var googleMapsApi;
	if (apiKey) {
		var mapsUrl = 'https://www.google.com/maps';
		googleMapsApi = mapsUrl + '/api/js?libraries=places&key=' + apiKey;
	} else {
		googleMapsApi = null;
	}

	return googleMapsApi;
}

// Over riding Begin controller to inject MAP js on checkout page incase
// autocomplete is enabled
server.append('Begin', function (req, res, next) {
	var Site = require('dw/system/Site');
	var isAutoCompleteEnabled = Site.getCurrent().getCustomPreferenceValue('enableAutoComplete');
	var googleMapAPI = null;

	if (isAutoCompleteEnabled) {
		var mapKey = Site.getCurrent().getCustomPreferenceValue('mapAPI');
		googleMapAPI = getGoogleMapsApi(mapKey);
	}
	res.setViewData({
		googleMapAPI: googleMapAPI
	});

	return next();
});

module.exports = server.exports();
