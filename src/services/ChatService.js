import axios from "axios";

const getChatHistory = async (data) => {
  return await axios.post(`mobile/chat/chat-history`, data);
}

const getChatUserList = async () => {
  return await axios.post(`mobile/chat/user-list`);
}

export const ChatService = {
  getChatHistory,
  getChatUserList
};
