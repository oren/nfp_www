'use strict';
/* global settings */

var m = require('mithril');
var auth = require('./authentication');
var _ = require('lodash');

var apiUrl = settings.api_url;

var api = {};

api._unwrapError = function(data, xhr) {
  data = data || {};
  if (xhr.status === 401) {
    auth.logout();
    m.route('/login');
    var login = require('../components/login/login.model');
    login.vm.errors('Unauthorized error, please re-login');
  }
  return {
    status: xhr.status,
    message: (data && data.message) || 'Unknown critical error',
    body: data && data.body
  };
};

api._deserialize = function(value) {
  if (!value) return {};
  if (value[0] !== '{' && value[0] !== '['){
      return {message: value};
  }
  try {
    return JSON.parse(value);
  }
  catch (error) {
    return {message: value};
  }
};

api.get = function(path, options) {
  options = _.defaults(options || {}, {
    method: 'GET',
    url: apiUrl + path,
    unwrapError: api._unwrapError,
    deserialize: api._deserialize,
    config: auth.config
  });
  return m.request(options);
};

api.post = function(path, data, options) {
  options = _.defaults(options || {}, {
    method: 'POST',
    url: apiUrl + path,
    data: data,
    unwrapError: api._unwrapError,
    deserialize: api._deserialize,
    config: auth.config
  });
  try {
    return m.request(options);
  }
  catch (error) {
    console.log('bla');
    console.log(error);
  }
};

module.exports = api;

