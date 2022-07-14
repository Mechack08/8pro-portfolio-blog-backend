const backgroundModel = require("../models/background.model");
const asyncLib = require("async");

module.exports = {
  create: (req, res) => {
    const { institution, position, period, type, description } = req.body;

    if (institution === null || institution === "")
      return res.json({ message: "institution is required" });
    if (position === null || position === "")
      return res.json({ message: "position is required" });
    if (period === null || period === "")
      return res.json({ message: "period is required" });
    if (type === null || type === "")
      return res.json({ message: "type is required" });

    asyncLib.waterfall(
      [
        (done) => {
          backgroundModel
            .findOne({ period })
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

          backgroundModel
            .create({
              institution,
              position,
              period,
              type,
              description,
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
    backgroundModel
      .find()
      .then((backgrounds) => {
        if (backgrounds.count <= 0)
          return res.status(404).json({ message: "No data find" });
        return res.status(200).json({ message: "success", data: backgrounds });
      })
      .catch((e) => {
        return res.status(500).json({
          error: "Something went wrong, try again later.",
          details: e.message,
        });
      });
  },

  update: (req, res) => {
    const { institution, position, period, type, description } = req.body;
    const id = req.params.id;

    if (institution === null || institution === "")
      return res.json({ message: "institution is required" });
    if (position === null || position === "")
      return res.json({ message: "position is required" });
    if (period === null || period === "")
      return res.json({ message: "period is required" });
    if (type === null || type === "")
      return res.json({ message: "type is required" });

    asyncLib.waterfall(
      [
        (done) => {
          backgroundModel
            .findByIdAndUpdate(
              id,
              {
                $set: {
                  institution,
                  position,
                  type,
                  description,
                  period,
                },
              },
              { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            .then((background) => done(background))
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
          backgroundModel
            .findByIdAndDelete(req.params.id)
            .then((background) => done(background))
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
