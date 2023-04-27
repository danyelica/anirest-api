const express = require("express");
const router = express();
const multer = require("./utils/multer");
const { upload, uploadMulti } = require("./controllers/files");
const {
  registerPic,
  getPics,
  getThisPic,
  getThisUserPic,
  search,
  updatePic,
  deletePic,
} = require("./controllers/pics");

router.post("/upload", multer.single("photo"), upload);
router.post("/upload-multi", multer.array("photo"), uploadMulti);

router.get("/files", getPics);
router.get("/user-pics/:user", getThisUserPic);
router.get("/this-file", getThisPic);
router.get("/search", search);
router.get("/", (req, res) => res.json("Tudo ok 😜"));
router.post("/pic", registerPic);
router.put("/pic/:id", updatePic);
router.delete("/pic/:id", deletePic);

module.exports = router;
