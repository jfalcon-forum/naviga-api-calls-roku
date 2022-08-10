const axios = require("axios").default
require('dotenv').config()

// Gets all the subscriptions for a given user
const getNavigaSubscriptions = async (userId) => {
  let options = {
    method: 'GET',
    url: `${process.env.NAVIGA_TEST_URL}Users/${userId}/Subscriptions/v2`,
    headers: {
      'X-MediaGroupCode': 'ForumComm',
      'X-ClientCode': 'Forum',
      'X-PaperCode': 'TF',
      'X-SourceSystem': 'ExternalSystem',
      'Authorization': `bearer ${process.env.NAVIGA_TOKEN}`
    }
  }
  
  const response = axios.request(options).then((response) => {
    return response.data;
  }).catch(function (error) {
    if (error.response) {
      let errorMessage = {"statusCode": error.response.status, "statusText": error.response.statusText}
      console.log(errorMessage)
    }
  })

  return await response
}

exports.getNavigaSubscriptions = getNavigaSubscriptions;