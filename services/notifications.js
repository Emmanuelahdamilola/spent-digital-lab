import axios from "axios";

export const sendPushNotification = async ({ title, body, tokens }) => {
  const payload = {
    registration_ids: tokens,
    notification: {
      title,
      body,
      sound: "default",
    }
  };

  return axios.post("https://fcm.googleapis.com/fcm/send", payload, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `key=${process.env.FCM_SERVER_KEY}`,
    }
  });
};
