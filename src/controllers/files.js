const { uploadFile, showFiles } = require("../utils/storage");

const uploadSingleKittyFile = async (req, res) => {
  const { file } = req;

  try {
    let photo = await uploadFile(
      `imagens/${file.originalname}`,
      file.buffer,
      file.mimetype
    );

    if (!photo.includes("pinterkitty")) {
      photo = `https://pinterkitty.s3.us-west-004.backblazeb2.com${photo}`;
    }

    return res.status(201).json({ url: photo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const uploadMultipleKittyFiles = async (req, res) => {
  const { files } = req;

  try {
    const allFiles = [];

    for (let file of files) {
      const photo = await uploadFile(
        `imagens/${file.originalname}`,
        file.buffer,
        file.mimetype
      );

      if (photo.includes("pinterkitty")) {
        allFiles.push({ url: photo });
      } else {
        allFiles.push({
          url: `https://pinterkitty.s3.us-west-004.backblazeb2.com${photo}`,
        });
      }
    }

    return res.status(201).json(allFiles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const showThisKittyFile = async (req, res) => {
  const { id } = req.params;

  try {
    const files = await showFile();
    const keys = [];

    for (let file of files) {
      keys.push(file.Key);
    }

    const thisFile = keys.filter((key) => {
      if (key.includes(id + ".")) {
        return key;
      }
    });

    if (thisFile.length < 1) {
      return res
        .status(404)
        .json({ mensagem: "We didn't found the photo you're looking for :(" });
    }

    return res.status(200).json({
      url: `https://pinterkitty.s3.us-west-004.backblazeb2.com/${thisFile}`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const showKittyFiles = async (req, res) => {
  const urls = [];
  try {
    const files = await showFiles();
    files.forEach((file) => {
      urls.push({
        url: `https://pinterkitty.s3.us-west-004.backblazeb2.com/${file.Key}`,
      });
    });
    res.status(200).json(urls);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadSingleKittyFile,
  uploadMultipleKittyFiles,
  showThisKittyFile,
  showKittyFiles,
};
