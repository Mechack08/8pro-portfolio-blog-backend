const models = require("../models");
const asyncLib = require("async");

module.exports = {
  create: (req, res) => {
    const { subject, level, category } = req.body;

    if (subject === null || subject === "")
      return res.json({ message: "subject is required" });
    if (level === null || level === "")
      return res.json({ message: "level is required" });
    if (category === null || category === "")
      return res.json({ message: "category is required" });

    asyncLib.waterfall(
      [
        (done) => {
          models.Skill.findOne({ where: { subject } })
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

          models.Skill.create({
            subject,
            level,
            category,
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
          models.Skill.findAll()
            .then((skills) => done(skills))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (skills) => {
        if (!skills) return res.status(404).json({ message: "No data find" });
        return res.status(200).json({ message: "success", data: skills });
      }
    );
  },

  update: (req, res) => {
    const { subject, level, category } = req.body;

    if (subject === null || subject === "")
      return res.json({ message: "subject is required" });
    if (level === null || level === "")
      return res.json({ message: "level is required" });
    if (category === null || category === "")
      return res.json({ message: "category is required" });

    asyncLib.waterfall(
      [
        (done) => {
          models.Skill.findByPk(req.params.id)
            .then((skill) => done(null, skill))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (skill, done) => {
          if (!skill) return res.status(404).json({ message: "Doesn't exist" });

          skill
            .update({
              subject,
              level,
              category,
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
          models.Skill.findByPk(req.params.id)
            .then((skill) => done(null, skill))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (skill, done) => {
          if (!skill) return res.status(404).json({ message: "Doesn't exist" });

          skill
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
