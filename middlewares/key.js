require("dotenv").config();

const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res
      .status(403)
      .json({ error: "API key tidak valid atau tidak ditemukan" });
  }
  next();
};

module.exports = checkApiKey;
