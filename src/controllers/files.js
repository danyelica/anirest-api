const client = require("../utils/imgur-client");

const upload = async (req, res) => {
  const { file } = req;

  try {
    const { data } = await client.upload({
      image: file.buffer,
    });

    res.status(201).json({ url: data.link });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const uploadMulti = async (req, res) => {
  const { files } = req;
  const urls = [];

  try {
    for (let file of files) {
      const { data } = await client.upload({
        image: file.buffer,
      });
      urls.push({ url: data.link });
    }

    res.status(201).json(urls);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

module.exports = {
  upload,
  uploadMulti,
};
