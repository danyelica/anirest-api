const express = require("express");
const router = express();
const multer = require("./utils/multer");
const {
  showKittyFiles,
  uploadSingleKittyFile,
  uploadMultipleKittyFiles,
} = require("./controllers/files");

router.post("/upload", multer.single("photo"), uploadSingleKittyFile);
router.post(
  "/upload-multiple",
  multer.array("photo"),
  uploadMultipleKittyFiles
);
router.get("/files", showKittyFiles);
router.get("/", (req, res) => res.json("Tudo ok 😜"));

module.exports = router;
