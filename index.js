const express = require("express");
const axios = require("axios");
const { GoogleAuth } = require("google-auth-library");

const app = express();
app.use(express.json());

app.post("/send-fcm", async (req, res) => {
  const { token, title, body } = req.body;

  try {
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
    });

    const client = await auth.getClient();
    const projectId = await auth.getProjectId();

    const message = {
      message: {
        token,
        notification: { title, body }
      }
    };

    const response = await client.request({
      url: `https://fcm.googleapis.com/v1/projects/test-1e2b5/messages:send`,
      method: "POST",
      data: message
    });

    res.json({ success: true, response: response.data });
  } catch (error) {
    console.error("FCM error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send FCM" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Desu FCM server is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
