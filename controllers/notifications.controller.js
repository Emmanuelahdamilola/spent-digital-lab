import DeviceToken from "../models/DeviceToken.js";

export const saveDeviceToken = async (req, res) => {
  try {
    const { token } = req.body;

    await DeviceToken.findOneAndUpdate(
      { user: req.user.id },
      { token },
      { upsert: true }
    );

    return res.json({ success: true, message: "Device token saved" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendNotificationToAll = async (req, res) => {
  try {
    const { title, message } = req.body;

    const tokens = (await DeviceToken.find()).map(t => t.token);

    await sendPushNotification({
      title,
      body: message,
      tokens
    });

    return res.json({ success: true, message: "Notification sent" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
