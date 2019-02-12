'use strict';

const Weather = require('../model/weather');
const Responder = require('../middleware/responder');

module.exports.getWeather = function getWeather(req, res, next) {
  Responder.asHttpResponse(Weather.getWeather.bind(undefined,
    req.swagger.params.location.value,
    req.swagger.params.unit.value
  ), req, res);
};

