const { getNavigaSubscriptions } = require('./naviga-subscriptions');

const navigaCall = async (id) => {
  if (id === null || id === "" || id === undefined) {
    return {
      "status": 204,
      "message": "Invalid ID"
    };
  }
  const navResponse = await getNavigaSubscriptions(id);
  if (navResponse.Errors.length > 1) {
    return {
      "status": 203,
      "message": navResponse.Errors[0].Message
    };
  }
  let response;
  // check for Owned Subscriptions
  if (navResponse.Result.OwnedSubscriptions !== null && navResponse.Result.OwnedSubscriptions.length > 0) {
    let startDate, endDate;
    navResponse.Result.OwnedSubscriptions.forEach(subscription => {
      if (subscription.Status === "L" && subscription.BaseProductPaperCode === "SLS") {
        startDate = new Date(subscription.StartDate).getTime();
        endDate = new Date(subscription.ExpirationDate).getTime();
        response = {
          "status": 200,
          "product_id": "SLS",
          "starts_at": startDate,
          "ends_at": endDate
        };
      } else {
        response = {
          "status": 203,
          "message": "No active livestream subscriptions for this user"
        };
      }
    });
  } 
  // Check for Guest Subscriptions
  if (navResponse.Result.GuestSubscriptions !== null && navResponse.Result.GuestSubscriptions.length > 0) {
    let startDate, endDate;
    navResponse.Result.GuestSubscriptions.forEach(subscription => {
      if (subscription.Status === "L" && subscription.BaseProductPaperCode === "SLS") {
        startDate = new Date(subscription.StartDate).getTime();
        endDate = new Date(subscription.ExpirationDate).getTime();
        response = {
          "status": 200,
          "product_id": "SLS",
          "starts_at": startDate,
          "ends_at": endDate
        };
      } 
      else {
        response = {
          "status": 203,
          "message": "No active livestream subscriptions for this user"
        };
      }
    })
  }
  if (!response) {
    response = {
      "status": 203,
      "message": "User does not exist or does not have any subscriptions."
    };
  }
  return response;
};

exports.handler = async (event, context) => {
  if (event.query === null || event.query === "" || event.query === undefined) {
    return {
      "status": 204,
      "message": "Invalid ID"
    };
  }
  let authId = decodeURIComponent(event.query.consumer_id);
  const response = await navigaCall(authId);
  return response;
};