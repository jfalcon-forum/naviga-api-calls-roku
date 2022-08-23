const { getNavigaSubscriptions } = require('./naviga-subscriptions');

const navigaCall = async (id) => {
  if (id === null || id === "" || id === undefined) {
    return [
      {
        "status": 204,
        "message": "Invalid ID"
      }
    ];
  }
  const navResponse = await getNavigaSubscriptions(id);
  if (navResponse.Errors.length > 1) {
    return [
      {
        "status": 203,
        "message": navResponse.Errors[0].Message
      }
    ];
  }
  let response;
  // check for Owned Subscriptions
  if (navResponse.Result.OwnedSubscriptions !== null && navResponse.Result.OwnedSubscriptions.length > 0) {
    let startDate, endDate;
    for (let i = 0; i < navResponse.Result.OwnedSubscriptions.length; i++) {
      if (navResponse.Result.OwnedSubscriptions[i].Status === "L" && navResponse.Result.OwnedSubscriptions[i].BaseProductPaperCode === "SLS") {
        startDate = Math.floor(new Date(navResponse.Result.OwnedSubscriptions[i].StartDate).getTime() / 1000);
        endDate = Math.floor(new Date(navResponse.Result.OwnedSubscriptions[i].ExpirationDate).getTime() / 1000);
        response = [
          {
            "status": 200,
            "product_id": "SLS",
            "starts_at": startDate,
            "ends_at": endDate
          }
        ];
        break;
      } else {
        response = [
          {
            "status": 203,
            "message": "No active Livestream Subscriptions for this user"
          }
        ]; 
      }
    }
  } 
  // Check for Guest Subscriptions
  if (navResponse.Result.GuestSubscriptions !== null && navResponse.Result.GuestSubscriptions.length > 0) {
    let startDate, endDate;
    for (let i = 0; i < navResponse.Result.GuestSubscriptions.length; i++) {
      if (navResponse.Result.GuestSubscriptions[i].Status === "L" && navResponse.Result.GuestSubscriptions[i].BaseProductPaperCode === "SLS") {
        startDate = Math.floor(new Date(navResponse.Result.GuestSubscriptions[i].StartDate).getTime() / 1000);
        endDate = Math.floor(new Date(navResponse.Result.GuestSubscriptions[i].ExpirationDate).getTime() / 1000);
        response = [
          {
            "status": 200,
            "product_id": "SLS",
            "starts_at": startDate,
            "ends_at": endDate
          }
        ];
        break;
      } else {
        response = [
          {
            "status": 203,
            "message": "No active Livestream Subscriptions for this user"
          }
        ]; 
      }
    }
  }
  if (!response) {
    response = [
      {
        "status": 203,
        "message": "User does not exist or does not have any subscriptions."
      }
    ];
  }
  return response;
};

exports.handler = async (event, context) => {
  if (event.query === null || event.query === "" || event.query === undefined) {
    return [
      {
        "status": 204,
        "message": "Invalid ID"
      }
    ];
  }
  let authId = decodeURIComponent(event.query.consumer_id);
  const response = await navigaCall(authId);
  return response;
};