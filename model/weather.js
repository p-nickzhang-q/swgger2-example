'use strict';

var weather = require('weather-js');
const Utill = require('util');

module.exports.getWeather = function getWeather(location, degreeType) {
    // Code necessary to consume the Weather API and respond
    const find = Utill.promisify(weather.find);
    return find({
        search: location,
        degreeType: degreeType
    });
};
