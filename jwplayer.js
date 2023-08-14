const axios = require("axios").default;
const MD5 = require("crypto-js/md5");
require("dotenv").config();

// hFkabfiO - test case matches feed

const getJwplayerMediaObj = async (media_id) => {
  const response = await axios({
    method: "get",
    url: `https://cdn.jwplayer.com/v2/media/${media_id}`,
    headers: { accept: "application/json; charset=utf-8" },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        return {
          error: {
            status: error.response.status,
            data: error.response.data,
          },
        };
      } else {
        return "Error", error.message;
      }
    });
  return response;
};

const formatImageArray = (images) => {
  let mediaArr;
  mediaArr = images.forEach((image) => {
    return {
      key: image.width,
      src: image.src,
    };
  });
  return mediaArr;
};

const createSig = (media_id, path) => {
  let exp = 1691445333;
  //   let base = `/v2/media/${media_id}:${exp}:${process.env.JWPLAYER_SECRET}`;
  let base = `${path}:${exp}:${process.env.JWPLAYER_SECRET}`;
  const signature = MD5(base);
  return `?exp=${exp}&sig=${signature}`;
};

const constructEncodedSrc = (media_id, src) => {
  let arr = src.split("https://cdn.jwplayer.com/");
  let sig = createSig(media_id, arr[1]);
  return `${src}${sig}`;
};

const formattedRunTime = (time) => {
  let reformedTime = time / 60;
  if (!reformedTime.toString().includes(".")) {
    return `${reformedTime}:00`;
  }
  let arr = reformedTime.toString().split(".");
  let seconds;
  if (arr[1].length < 2) {
    seconds = arr[1].padEnd(2, 0);
  } else {
    seconds = arr[1] * 60;
  }
  let arr2 = seconds.toString().split(".");
  let formattedSeconds = arr2[0].slice(0, 2);
  if (arr2[1] > 5) {
    formattedSeconds++;
  }
  if (arr[0] < 1) {
    return `0${arr[0]}:${formattedSeconds}`;
  } else {
    return `${arr[0]}:${formattedSeconds}`;
  }
};

const constructApplicasterMedia = (media) => {
  let formattedImageArray;
  if (media.playlist[0].images.length > 0) {
    formattedImageArray = formatImageArray(media.playlist[0].images);
  }

  let encodedSrc = constructEncodedSrc(
    media.playlist[0].mediaid,
    media.playlist[0].sources[0].file
  );

  let extensions = {
    pubdate: media.playlist[0].pubdate,
    description: "",
    variations: {},
    duration: media.playlist[0].duration,
    formattedRuntime: formattedRunTime(media.playlist[0].duration),
  };

  let object = {
    id: media.playlist[0].mediaid,
    title: media.title,
    entry: [
      {
        id: media.playlist[0].mediaid,
        type: {
          value: "video",
        },
        title: media.playlist[0].mediaid,
        summary: "",
        content: {
          type: "video/hls",
          src: encodedSrc,
        },
        media_group: [
          {
            type: "image",
            media_item: formattedImageArray,
          },
        ],
        extensions: extensions,
      },
    ],
  };

  return object;
};

exports.getJwplayerMediaObj = getJwplayerMediaObj;
exports.constructApplicasterMedia = constructApplicasterMedia;
