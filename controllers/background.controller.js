const models = require("../models");
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
          models.Background.findOne({ where: { period: period } })
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

          models.Background.create({
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
    models.Background.findAll()
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
          models.Background.findByPk(id)
            .then((background) => done(null, background))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (background, done) => {
          if (!background)
            return res.status(404).json({ message: "Doesn't exist" });

          background
            .update({
              institution,
              position,
              type,
              description,
              period,
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
          models.Background.findByPk(req.params.id)
            .then((background) => done(null, background))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (background, done) => {
          if (!background)
            return res.status(404).json({ message: "Doesn't exist" });

          background
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
