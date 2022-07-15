const skillModel = require("../models/skill.model");
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
          skillModel
            .findOne({ subject })
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

          skillModel
            .create({
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
          skillModel
            .find()
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
          skillModel
            .findByIdAndUpdate(
              req.params.id,
              { subject, level, category },
              { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            .then((skill) => done(skill))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (skill) => {
        return res.status(201).json({ message: "success", data: skill });
      }
    );
  },

  delete: (req, res) => {
    asyncLib.waterfall(
      [
        (done) => {
          skillModel
            .findByIdAndDelete(req.params.id)
            .then((skill) => done(null, skill))
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
