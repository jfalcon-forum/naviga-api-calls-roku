const { getLivestreamAccess} = require('./naviga-livestream');

const navigaCall = async (id) => {
  if (id === null || id === "" || id === undefined) {
    return {
      "status": 204,
      "message": "Invalid ID"
    }
  }
  const navResponse = await getLivestreamAccess(id)
  if (navResponse.Errors.length > 1) {
    return {
      "status": 203,
      "message": navResponse.Errors[0].Message
    }
  }
  if (navResponse.Result.IsAuthorized) {
    return {
      "status": 200,
      ...navResponse,
    } 
  }
}

exports.handler = async (event, context) => {
  const response = await navigaCall(event.id);
  return response;
};