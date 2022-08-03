const articleModel = require("../models/article.model");
const asyncLib = require("async");
const multer = require("multer");

/* set images */
const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/portfolios/");
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

    asyncLib.waterfall(
      [
        (done) => {
          articleModel
            .findOne({ title })
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

          articleModel
            .create({
              title,
              language,
              category,
              author,
              content,
              img,
              comments: [],
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
          articleModel
            .find()
            .sort({ created_at: -1 })
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
        return res
          .status(200)
          .json({ message: "success", rows: article.length, data: article });
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
          articleModel
            .findByIdAndUpdate(
              req.params.id,
              {
                title,
                language,
                category,
                author,
                content,
              },
              { new: true, upsert: true, setDefaultsOnInsert: true }
            )
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
        return res.status(201).json({ message: "success", data: article });
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
          articleModel
            .findByIdAndUpdate(
              req.params.id,
              { img },
              { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            .then((image) => done(image))
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
          articleModel
            .findByIdAndDelete(req.params.id)
            .then((article) => done(article))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      () => {
        return res.status(200).json({ message: "success" });
      }
    );
  },

  addComment: (req, res) => {
    const { fullname, email, comment } = req.body;

    if (fullname === null || fullname === "")
      return res.json({ message: "fullname is required" });
    if (email === null || email === "")
      return res.json({ message: "email is required" });
    if (comment === null || comment === "")
      return res.json({ message: "comment is required" });

    asyncLib.waterfall(
      [
        (done) => {
          articleModel
            .findByIdAndUpdate(
              req.params.id,
              {
                $push: {
                  comments: {
                    fullname,
                    email,
                    comment,
                    timestamp: new Date().getTime(),
                  },
                },
              },
              { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            .then((newComment) => done(newComment))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (newComment) => {
        const message = `success`;
        return res.json({ message, data: newComment });
      }
    );
  },

  deleteComment: (req, res) => {
    asyncLib.waterfall(
      [
        (done) => {
          articleModel
            .findByIdAndUpdate(
              req.params.id,
              {
                $pull: {
                  comments: {
                    _id: req.body.commentId,
                  },
                },
              },
              { new: true }
            )
            .then((newComment) => done(newComment))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (newComment) => {
        const message = `success`;
        return res.json({ message });
      }
    );
  },
};
