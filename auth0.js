const axios = require("axios").default
const jwt_decode = require('jwt-decode')
const { getLivestreamAccess } = require('./naviga-livestream')
require('dotenv').config()

// Call that logs the user into Auth0 and gets user ID
const getAccessToken = async (email, password) => {

  let options = {
    method: 'POST',
    url: 'https://login-test.forumcomm.com/oauth/token',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
      grant_type: 'password',
      username: email,
      password: password,
      audience: 'https://zype-integration',
      scope: 'offline_access',
      client_id: process.env.ZYPE_AUTH_CLIENT_ID,
      client_secret: process.env.ZYPE_AUTH_SECRET_ID
    })
  }

  const response = await axios.request(options).then(function (response) {
    // Return a confirmation message or chain naviga call.
    return response.data;
  }).catch(function (error) {
    if (error.response) {
      console.log({ status: error.response.status, message: error.response.data.error_description })
      return { status: error.response.status, message: error.response.data.error_description }
    } else {
      console.log("Error", error.message)
    }
  })

  return await response
}

// Gets new refresh token and access token
const getRefreshAccessToken = async (token) => {
  var options = {
    method: 'POST',
    url: 'https://login-test.forumcomm.com/oauth/token',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.ZYPE_AUTH_CLIENT_ID,
      client_secret:process.env.ZYPE_AUTH_SECRET_ID, 
      refresh_token: token
    })
  };
  
  axios.request(options).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error.response.data);
  });
}

// Used to revoke a given token
const revokeRefreshToken = async (token) => {
  var options = {
    method: 'POST',
    url: 'https://login-test.forumcomm.com/oauth/revoke',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
      client_id: process.env.ZYPE_AUTH_CLIENT_ID,
      client_secret:process.env.ZYPE_AUTH_SECRET_ID, 
      token: token
    })
  };
  
  axios.request(options).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error.response.data);
  });
}

exports.getAccessToken = getAccessToken;