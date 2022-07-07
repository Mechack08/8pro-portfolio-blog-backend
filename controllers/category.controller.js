const models = require("../models");
const asyncLib = require("async");

module.exports = {
  create: (req, res) => {
    const { title } = req.body;

    if (title === null || title === "")
      return res.json({ message: "title is required" });

    asyncLib.waterfall(
      [
        (done) => {
          models.Category.findOne({ where: { title } })
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

          const currentDate = new Date();
          const id = currentDate.getTime();
          models.Category.create({
            id,
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
          models.Category.findAll()
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
          models.Category.findByPk(req.params.id)
            .then((category) => done(null, category))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (category, done) => {
          if (!category)
            return res.status(404).json({ message: "Doesn't exist" });

          category
            .update({
              title,
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

  delete: (req, res) => {
    asyncLib.waterfall(
      [
        (done) => {
          models.Category.findByPk(req.params.id)
            .then((category) => done(null, category))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (category, done) => {
          if (!category)
            return res.status(404).json({ message: "Doesn't exist" });

          category
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
