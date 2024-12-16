const express = require("express");
const fs = require("fs");
const path = require("path");

// Custom helpers
const upload = require("../../AppUtils/upload");
const { makeRespObj } = require("../../AppUtils");
const { folderNames } = require("../../helpers/constants");

const router = express.Router();

// Upload directory
const uploadDirectory = "uploads";

// Custom function to unlink old file
const unlinkOldFile = (req, res, next) => {
  // console.log("IG", req);
  const [{ folderName }, { ofn: oldFileName }] = [req?.params, req.query];

  if (req.originalUrl.split("/").includes("deleteFile") && !oldFileName) {
    return res.status(400).json(
      makeRespObj({
        status_code: 400,
        message: "File not found.",
      })
    );
  }

  if (oldFileName && oldFileName.trim() !== "") {
    const filePath = path.join(
      uploadDirectory + `/${folderNames[folderName]}/${oldFileName.trim()}`
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return next();
    }

    return res.status(400).json(
      makeRespObj({
        status_code: 400,
        message: "File not found.",
      })
    );
  }

  return next();
};

// Route to upload a file
router.post(
  "/uploadFile/:folderName",
  unlinkOldFile,
  upload.single("file"),
  (req, res) => {
    const file = req.file;

    if (!file || !Object.keys(folderNames).includes(req.params.folderName)) {
      return res.status(400).json(
        makeRespObj({
          status_code: 400,
          message: "Something went wrong with file!",
        })
      );
    }

    return res.status(200).json(
      makeRespObj({
        status_code: 200,
        message: "File uploaded successfully.",
        data: file ? req?.params?.folderName + "/" + file.filename : null,
      })
    );
  }
);

// Route to delete a file
router.post("/deleteFile/:folderName", unlinkOldFile, (_, res) => {
  return res.status(200).json(
    makeRespObj({
      status_code: 200,
      message: "File deleted successfully.",
    })
  );
});

// Route to show file content
router.get("/showContent/:folderName/:fileName", (req, res) => {
  const { folderName, fileName } = req.params;

  let contentType = "image/jpeg";
  const extname = path.extname(fileName.split(".")[1]).toLowerCase();
  if (extname === ".png") {
    contentType = "image/png";
  } else if (extname === ".gif") {
    contentType = "image/gif";
  }

  const fileStream = fs.createReadStream(
    path.resolve(
      __dirname,
      "..",
      "..",
      "uploads",
      folderNames[folderName],
      fileName.trim()
    )
  );

  res.setHeader("Content-Type", contentType);

  fileStream.pipe(res);

  fileStream.on("error", (err) => {
    if (err.code === "ENOENT") {
      res.status(404).json({ message: "File not found" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

module.exports = router;
