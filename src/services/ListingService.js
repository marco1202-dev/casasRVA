import axios from "axios";

const likeProperty = async (MLSID, isLiked, address) => {
  return await axios.post("mobile/listing/like", {
    MLSID,
    isLiked: isLiked ? 1 : 0,
    address
  });
};

const updateLocations = (data) => {
  axios.post("mobile/listing/update-locations", {
    data
  }).then((res) => {
  }).catch(error => {
    console.log(error.message);
  });
}

const getAgentFcmKeys = async (agent_id) => {
  return await axios.get(`mobile/listing/get-agent-fcm-keys?agent_id=${agent_id}`);
}

const getListingDetailInfo = async (id, user_id) => {
  return await axios.get(`mobile/listing/${id}?user_id=${user_id}`);
}

const getSearchList = async (data) => {

  return await axios.post("mobile/listing/search-list", {
    ...data,
  });

};

const getSearchFullList = async (data) => {
  return await axios.post("mobile/listing/search-full-list", {
    ...data,
  });
};

const sendRequestNote = async (client_id, listing_id, by, message) => {
  return await axios.post("mobile/listing/send-request-note", {
    client_id,
    listing_id,
    by,
    message
  });
};

const getFavoriteList = async (data) => {
  return await axios.post("mobile/listing/favorite-list", {
    ...data,
  });
};

export const ListingService = {
  likeProperty,
  getFavoriteList,
  getSearchList,
  getSearchFullList,
  getListingDetailInfo,
  updateLocations,
  sendRequestNote,
  getAgentFcmKeys
};
