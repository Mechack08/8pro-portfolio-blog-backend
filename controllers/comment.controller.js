const models = require("../models");
const asyncLib = require("async");

module.exports = {
  create: (req, res) => {
    const { fullname, email, comment, article } = req.body;

    if (fullname === null || fullname === "")
      return res.json({ message: "fullname is required" });
    if (email === null || email === "")
      return res.json({ message: "email is required" });
    if (comment === null || comment === "")
      return res.json({ message: "comment is required" });
    if (article === null || article === "")
      return res.json({ message: "article is required" });

    asyncLib.waterfall(
      [
        (done) => {
          models.Comment.findOne({ where: { comment } })
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

          models.Comment.create({
            fullname,
            email,
            comment,
            article,
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
          models.Comment.findAll()
            .then((comment) => done(comment))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (comment) => {
        if (!comment) return res.status(404).json({ message: "No data find" });
        return res.status(200).json({ message: "success", data: comment });
      }
    );
  },

  delete: (req, res) => {
    asyncLib.waterfall(
      [
        (done) => {
          models.Comment.findByPk(req.params.id)
            .then((comment) => done(null, comment))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (comment, done) => {
          if (!comment)
            return res.status(404).json({ message: "Doesn't exist" });

          comment
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
