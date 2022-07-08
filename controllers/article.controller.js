const models = require("../models");
const asyncLib = require("async");
const multer = require("multer");

/* set images */
const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/articles/");
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    const title = "article-portfolio-blog";
    const date = new Date();
    callback(null, `${title.toLowerCase()}-${date.getTime()}.${ext}`);
  },
});

const isImg = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    return callback(null, true);
  } else {
    return callback("not image, plaese select an image");
  }
};

module.exports = {
  upload: multer({
    storage: multerConfig,
    fileFilter: isImg,
  }).single("img"),

  create: (req, res) => {
    const { title, language, category, author, content } = req.body;

    if (title === null || title === "")
      return res.json({ message: "title is required" });
    if (category === null || category === "")
      return res.json({ message: "category is required" });
    if (language === null || language === "")
      return res.json({ message: "language is required" });
    if (author === null || author === "")
      return res.json({ message: "author is required" });
    if (content === null || content === "")
      return res.json({ message: "content is required" });
    if (content === null || content === "")
      return res.json({ message: "content is required" });

    const url = `${req.protocol}://${req.get("host")}/api/`;
    const img = `${url}${req.file.path}`;

    const currentDate = new Date();
    const id = currentDate.getTime();

    asyncLib.waterfall(
      [
        (done) => {
          models.Article.findOne({ where: { title } })
            .then((result) => done(null, result))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (result, done) => {
          if (result) return res.status(409).json({ message: "already exist" });

          models.Article.create({
            id,
            title,
            language,
            category,
            author,
            content,
            img,
          })
            .then((created) => done(created))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (created) => {
        return res.status(201).json({ message: "success", data: created });
      }
    );
  },

  all: (req, res) => {
    asyncLib.waterfall(
      [
        (done) => {
          models.Article.findAll({ order: [["createdAt", "DESC"]] })
            .then((article) => done(article))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (article) => {
        if (!article) return res.status(404).json({ message: "No data find" });
        return res.status(200).json({ message: "success", data: article });
      }
    );
  },

  update: (req, res) => {
    const { title, language, category, author, content } = req.body;

    if (title === null || title === "")
      return res.json({ message: "title is required" });
    if (category === null || category === "")
      return res.json({ message: "category is required" });
    if (language === null || language === "")
      return res.json({ message: "language is required" });
    if (author === null || author === "")
      return res.json({ message: "author is required" });
    if (content === null || content === "")
      return res.json({ message: "content is required" });
    if (content === null || content === "")
      return res.json({ message: "content is required" });

    asyncLib.waterfall(
      [
        (done) => {
          models.Article.findByPk(req.params.id)
            .then((article) => done(null, article))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (article, done) => {
          if (!article)
            return res.status(404).json({ message: "Doesn't exist" });

          article
            .update({
              title,
              language,
              category,
              author,
              content,
            })
            .then((updated) => done(updated))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (updated) => {
        return res.status(201).json({ message: "success", data: updated });
      }
    );
  },

  updateImg: (req, res) => {
    const url = `${req.protocol}://${req.get("host")}/api/`;
    const img = `${url}${req.file.path}`;

    if (img == null || img == "")
      return res.json({ error: "no file selected" });

    asyncLib.waterfall(
      [
        (done) => {
          models.Article.findByPk(req.params.id)
            .then((image) => done(null, image))
            .catch((e) => {
              const message = `Error occurred, please try again later.`;
              return res.status(500).json({ message, data: e.message });
            });
        },
        (image, done) => {
          if (!image) return res.json({ message: "no data found" });

          image
            .update({
              img,
            })
            .then((updated) => done(updated))
            .catch((e) => {
              const message = `Error occurred, please try again later.`;
              return res.status(500).json({ message, data: e.message });
            });
        },
      ],
      (updated) => {
        const message = `success`;
        return res.json({ message, data: updated });
      }
    );
  },

  delete: (req, res) => {
    asyncLib.waterfall(
      [
        (done) => {
          models.Article.findByPk(req.params.id)
            .then((article) => done(null, article))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (article, done) => {
          if (!article)
            return res.status(404).json({ message: "Doesn't exist" });

          article
            .destroy()
            .then((response) => done(response))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (response) => {
        return res.status(200).json({ message: "success" });
      }
    );
  },
};
