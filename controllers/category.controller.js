const categoryModel = require("../models/category.model");
const asyncLib = require("async");

module.exports = {
  create: (req, res) => {
    const { title } = req.body;

    if (title === null || title === "")
      return res.json({ message: "title is required" });

    asyncLib.waterfall(
      [
        (done) => {
          categoryModel
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

          categoryModel
            .create({
              title,
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
          categoryModel
            .find()
            .then((category) => done(category))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (category) => {
        if (!category) return res.status(404).json({ message: "No data find" });
        return res.status(200).json({ message: "success", data: category });
      }
    );
  },

  update: (req, res) => {
    const { title } = req.body;

    if (title === null || title === "")
      return res.json({ message: "title is required" });

    asyncLib.waterfall(
      [
        (done) => {
          categoryModel
            .findByIdAndUpdate(
              req.params.id,
              { title },
              { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            .then((category) => done(category))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (category) => {
        return res.status(201).json({ message: "success", data: category });
      }
    );
  },

  delete: (req, res) => {
    asyncLib.waterfall(
      [
        (done) => {
          categoryModel
            .findByIdAndDelete(req.params.id)
            .then((category) => done(null, category))
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
