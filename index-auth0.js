const axios = require("axios").default
const jwt_decode = require('jwt-decode')
const { getLivestreamAccess} = require('./naviga-livestream')
const { getAccessToken } = require('./auth0')

const oauthEndpoint = async (email, password) => {
  const response = await getAccessToken(email, password)
  if (response.status === 403) {
    return {
      status: response.status,
      message: "We are unable to complete your request at this time. Please resubmit your request."
    }
  }
  let decodedToken;
  try {
    decodedToken = await jwt_decode(response.access_token)
  } catch (error) {
    return {
      message: error.message
    }
  }
  let authId = await decodedToken.sub
  const livestreamAccess = await getLivestreamAccess(authId)
  if (!livestreamAccess.Result.IsAuthorized) {
    return {
      "status": 403,
      "message": "No Livestream access"
    }
  }
  let responseObj = {
    ...response,
    ...livestreamAccess
  }
  console.log(responseObj)
  return responseObj;
}

const authorizeEndpoint = async (token) => {
  try {
    let decodedToken = await jwt_decode(token)
    let authId = await decodedToken.sub
    const livestreamAccess = await getLivestreamAccess(authId)
    return livestreamAccess; 
  } catch (error) {
    return {
      message: error.message
    }
  }
}