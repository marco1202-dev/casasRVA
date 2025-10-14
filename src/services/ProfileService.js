import axios from "axios";

const getUserInfo = async (user_id) => {
  return await axios.get(`mobile/user/profile?user_id=${user_id}`);
};

const saveDynamicLink = async (user_id, link) => {
  return await axios.post("mobile/user/save-dynamic-link", {
    user_id,
    link
  })
}

const getDetailInfo = async (client_id) => {
  try {
    const result = await axios.get(`mobile/user/detail?client_id=${client_id}`);

    if (result.data.user === null) {
      return Promise.reject(new Error("user is null"));
    }

    return Promise.resolve(result.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const deleteAccount = async (user_id) => {
  return await axios.post("mobile/user/delete-account", {
    user_id
  })
}

const updateProfileImage = async (fileUri) => {
  try {
    const image = {
      uri: fileUri,
      type: "image/jpg",
      name: "upload.jpg",
    };

    var data = new FormData();
    data.append("avatar", image);
    const result = await axios.post("mobile/user/update-avatar", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (result?.data?.error) {
      return Promise.reject(Error(result.data.error.message));
    }
    return Promise.resolve(result.data?.avatar ?? '');
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateProfile = async (request, withImage = false) => {
  try {

    const result = withImage ? await axios.post("mobile/user/update-profile", request, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) : await axios.post("mobile/user/update-profile", request);

    if (result?.data?.error) {
      return Promise.reject(Error(result?.data?.error));
    }

    return Promise.resolve(result.data.user);
  } catch (error) {
    console.log('error = ', error);
    return Promise.reject(error);
  }
}

export const ProfileService = {
  updateProfile,
  getDetailInfo,
  getUserInfo,
  updateProfileImage,
  saveDynamicLink,
  deleteAccount
};
