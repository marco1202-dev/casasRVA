import axios from "axios";

const getDashboardItems = async () => {
  return await axios.get("mobile/dashboard");
};

export const DashboardService = {
  getDashboardItems,
};
