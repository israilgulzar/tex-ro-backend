const jwt = require("jsonwebtoken")
const { makeRespObj } = require("../../AppUtils")
const { verifyHashToken } = require("../utils/utils")

module.exports = async (req, res, next) => {
    const failedRes = () => {
        res.status(403).json(
            makeRespObj({
                status: false,
                status_code: 403,
                message: "Admin Request is Unauthorized!",
                error: "Internal Server Error",
            })
        )
    }
    try {
      if (!req.headers.authorization) {
        return failedRes();
      }

      const [, token] = req.headers.authorization.split(" ");

      if (!token) {
        return failedRes();
      }

      const decodedJwt = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
      const user = verifyHashToken(
        decodedJwt.token,
        process.env.ENCRYPTION_SECRET_KEY
      );
      if (!user) {
        return failedRes();
      }
      //get user's ip from  request object
      const ipAdrs = req.socket.remoteAddress;
      //check whether the IP address of the client matches with that in JWT payload
      if (user.key !== ipAdrs) {
        return failedRes();
      }

      req.body.adminID = user.adminID;

      next();
    } catch (error) {
        console.log(error)
      return failedRes();
    }
}


