const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { constantHelpers, appMode } = require("../constants");
const { makeRespObj } = require("../../AppUtils");
const axios = require("axios");

const decryptUserData = (encryptedData, secretKey) => {
  try {
    const algorithm = "aes-256-cbc";
    const [ivHex, encryptedUserHex] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedUser = Buffer.from(encryptedUserHex, "hex");
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secretKey),
      iv
    );
    let decryptedUser = decipher.update(encryptedUser);
    decryptedUser = Buffer.concat([decryptedUser, decipher.final()]);
    return decryptedUser.toString();
  } catch (error) {
    console.log(`Error in decryption:`, error);
    return null;
  }
};

const verifyHashToken = (token, secretKey) => {
  try {
    const decryptedUserData = decryptUserData(token, secretKey);
    const userData = JSON.parse(decryptedUserData);
    return userData;
  } catch (error) {
    console.log(`Error in verification:`, error);

    return null;
  }
};
const spApiCall = async ({ method, path, body }) => {
  const config = {
    method: method || "get",
    maxBodyLength: Infinity,
    url: `${appMode.DEVELOPMENT.shipRocketUrl}${path}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + constantHelpers.spToken,
    },
    ...(body && { data: JSON.stringify(body) }),
  };

  try {
    const response = await axios(config);
    if (response.status === 200) {
      return makeRespObj({
        data: response.data,
        message: "Data found Successfully",
        status_code: 200,
      });
    } else {
      return makeRespObj({
        data: null,
        message: "api call failed",
        status_code: 400,
      });
    }
  } catch (error) {
    console.log(`Error in shiprocket:`, error);
    return makeRespObj({
      status_code: 500,
      catchErr: error,
    });
  }
};

const createJwtToken = (userData, expiresIn, JWT_SECRET) => {
  try {
    const algorithm = "aes-256-cbc";
    const secretKey = process.env.ENCRYPTION_SECRET_KEY;
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encryptedUser = cipher.update(JSON.stringify(userData), "utf8", "hex");
    encryptedUser += cipher.final("hex");
    const token = `${iv.toString("hex")}:${encryptedUser}`;
    return jwt.sign({ token }, JWT_SECRET, { expiresIn });
  } catch (error) {
    console.log(`Error in generating token:`, error);
    return null;
  }
};

module.exports = {
  verifyHashToken,
  createJwtToken,
  spApiCall
};
