const jwt_decode = require("jwt-decode");
const { getNavigaSubscriptions } = require("./naviga-subscriptions");
const {
  getJwplayerMediaObj,
  constructApplicasterMedia,
} = require("./jwplayer");

const navigaCall = async (id) => {
  if (id === null || id === "" || id === undefined) {
    return {
      status: 401,
      statusText:
        "A WDAY+ subscription is required to view premium content. Login or visit https://www.inforum.com/getwdayplus for more information.",
      message: "Invalid ID",
    };
  }
  const navResponse = await getNavigaSubscriptions(id);
  if (navResponse.Errors.length > 1) {
    return {
      status: 401,
      statusText:
        "A WDAY+ subscription is required to view premium content. Login or visit https://www.inforum.com/getwdayplus for more information.",
      message: navResponse.Errors[0].Message,
    };
  }
  let response;
  // check for Owned Subscriptions
  if (
    navResponse.Result.OwnedSubscriptions !== null &&
    navResponse.Result.OwnedSubscriptions.length > 0
  ) {
    let startDate, endDate;
    for (let i = 0; i < navResponse.Result.OwnedSubscriptions.length; i++) {
      if (
        navResponse.Result.OwnedSubscriptions[i].Status === "L" &&
        navResponse.Result.OwnedSubscriptions[i].BaseProductPaperCode === "SLS"
      ) {
        startDate = Math.floor(
          new Date(
            navResponse.Result.OwnedSubscriptions[i].StartDate
          ).getTime() / 1000
        );
        endDate = Math.floor(
          new Date(
            navResponse.Result.OwnedSubscriptions[i].ExpirationDate
          ).getTime() / 1000
        );
        response = {
          status: 200,
          product_id: "SLS",
          starts_at: startDate,
          ends_at: endDate,
        };
        break;
      } else {
        response = {
          status: 401,
          statusText:
            "A WDAY+ subscription is required to view premium content. Login or visit https://www.inforum.com/getwdayplus for more information.",
          message: "No active Livestream Subscriptions for this user",
        };
      }
    }
  }
  // Check for Guest Subscriptions
  if (
    navResponse.Result.GuestSubscriptions !== null &&
    navResponse.Result.GuestSubscriptions.length > 0
  ) {
    let startDate, endDate;
    for (let i = 0; i < navResponse.Result.GuestSubscriptions.length; i++) {
      if (
        navResponse.Result.GuestSubscriptions[i].Status === "L" &&
        navResponse.Result.GuestSubscriptions[i].BaseProductPaperCode === "SLS"
      ) {
        startDate = Math.floor(
          new Date(
            navResponse.Result.GuestSubscriptions[i].StartDate
          ).getTime() / 1000
        );
        endDate = Math.floor(
          new Date(
            navResponse.Result.GuestSubscriptions[i].ExpirationDate
          ).getTime() / 1000
        );
        response = {
          status: 200,
          product_id: "SLS",
          starts_at: startDate,
          ends_at: endDate,
        };
        break;
      } else {
        response = {
          status: 401,
          statusText:
            "A WDAY+ subscription is required to view premium content. Login or visit https://www.inforum.com/getwdayplus for more information.",
          message: "No active Livestream Subscriptions for this user",
        };
      }
    }
  }
  if (!response) {
    response = {
      status: 401,
      statusText:
        "A WDAY+ subscription is required to view premium content. Login or visit https://www.inforum.com/getwdayplus for more information.",
      message: "User does not exist or does not have any subscriptions.",
    };
  }
  return response;
};

exports.handler = async (event, context, callback) => {
  if (event.query === null || event.query === "" || event.query === undefined) {
    return {
      status: 401,
      message: "Invalid ID",
    };
  }
  let authId;
  if (event.query.ctx.length > 5) {
    let buff = Buffer.from(event.query.ctx, "base64");
    let text = buff.toString();
    let decoded = await jwt_decode(text);
    authId = decoded.sub;
  } else {
    return {
      status: 401,
      statusText:
        "A WDAY+ subscription is required to view premium content. Login or visit https://www.inforum.com/getwdayplus for more information.",
      message: "Invalid ctx value.",
    };
  }
  const response = await navigaCall(authId);
  // if good make api call to JW Player to get video
  if (response.status === 200) {
    if (event.pathParams.id === "") {
      return {
        status: 401,
        statusText: "invalid media id or empty",
      };
    }
    let media = await getJwplayerMediaObj(media_id);
    const formattedMedia = await constructApplicasterMedia(media);
    return formattedMedia;
  }
  // Bad respond with error
  return response;
};
