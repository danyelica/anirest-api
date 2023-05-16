const knex = require("../connection/database");
const { v4 } = require("uuid");
const { chatGPT } = require("../connection/chatGPT");

const getPics = async (req, res) => {
  try {
    const query = await knex("pics");

    return res.json(query);
  } catch (error) {
    return res.status(400).json({ message: "Erro interno no servidor" });
  }
};

const getThisPic = async (req, res) => {
  const { id } = req.query;

  try {
    if (!id) return res.status(400).json({ mensagem: "O id é obrigatório" });

    const query = await knex("pics").where("id", id);
    const keyWords = await chatGPT.createCompletion({
      model: "text-davinci-003",
      prompt: `responda só as palavras chaves entre vírgulas da frase: ${query[0].description}`,
    });
    const relatedPics = await getKeyWordsPics(keyWords.data.choices[0].text);

    return res.json({ mainPic: query[0], relatedPics });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Erro interno no servidor" });
  }
};

const getThisUserPic = async (req, res) => {
  const { user } = req.params;

  try {
    if (!user)
      return res
        .status(400)
        .json({ mensagem: "O nome do usuário é obrigatório" });

    const query = await knex("pics").where("author", user);

    return res.json(query);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Erro interno no servidor" });
  }
};

const getKeyWordsPics = async (words) => {
  const keyWords = words.trim().split(",");
  let allQueries = [];

  try {
    if (!words)
      return res
        .status(400)
        .json({ mensagem: "As palavras chaves são obrigatórias" });

    for (let key of keyWords) {
      const query = await knex("pics").whereLike("description", `%${key}%`);
      if (query) {
        allQueries = [...allQueries, ...query];
      }
    }

    const response = Object.values(
      allQueries.reduce((acc, obj) => ({ ...acc, [obj.id]: obj }), {})
    );

    return response;
  } catch (error) {
    throw Error(error);
  }
};

const search = async (req, res) => {
  const { phrase } = req.body;

  try {
    const keyWords = await chatGPT.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: `responda só as palavras chaves entre vírgulas da frase: ${phrase}`,
    });
    const relatedPics = await getKeyWordsPics(keyWords.data.choices[0].text);

    return res.status(200).json(relatedPics);
  } catch (error) {
    return res.status(400).json({ message: "Erro interno no servidor" });
  }
};

const registerPic = async (req, res) => {
  const { mainPic, title, authorpic, description, author } = req.body;

  try {
    if (!mainPic || !title || !description)
      return res
        .status(400)
        .json({ mensagem: "Você esqueceu algum campo obrigatório" });

    const id = v4();

    const query = await knex("pics")
      .insert({
        id,
        mainpic: mainPic.url,
        title,
        description,
        author,
        authorpic: authorpic.url,
      })
      .returning("*");

    return res.json(query);
  } catch (error) {
    return res.status(400).json({ message: "Erro interno no servidor" });
  }
};

const updatePic = async (req, res) => {
  const { id } = req.params;
  const { mainPic, title, authorpic, description, author } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ mensagem: "O id é um campo obrigatório" });
    }

    const query = await knex("pics")
      .where("id", id)
      .update({ mainPic, title, authorpic, description, author })
      .returning("*");

    return res.status(200).json(query[0]);
  } catch (error) {
    return res.status(400).json({ message: "Erro interno no servidor" });
  }
};

const deletePic = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ mensagem: "O id é um campo obrigatório" });
    }

    await knex("pics").where("id", id).del();

    return res.status(204).json({ message: "Foto deletada com sucesso" });
  } catch (error) {
    return res.status(400).json({ message: "Erro interno no servidor" });
  }
};

const getUUID = async (req, res) => {
  const { id } = req.params;

  try {
    const newId = v4();
    const query = await knex("pics")
      .where("id", id)
      .update({ uuid: newId })
      .returning("*");

    return res.status(200).json(query);
  } catch (error) {
    return res.status(400).json({ message: "Erro interno no servidor" });
  }
};

module.exports = {
  getPics,
  getThisPic,
  getThisUserPic,
  search,
  registerPic,
  getUUID,
  updatePic,
  deletePic,
};
