import axios from "axios";

const getNotificationList = async (data) => {
  return await axios.post("mobile/notification/get-list", data);
};

const deleteNotifications = async (data) => {
  return await axios.post("mobile/notification/delete-notifications", data);
};

const getAppointmentList = async (data) => {
  return await axios.post("mobile/appointment/get-list", data);
}

export const NotificationService = {
  getNotificationList,
  deleteNotifications,
  getAppointmentList
};
