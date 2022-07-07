const models = require("../models");
const asyncLib = require("async");
const multer = require("multer");

/* set images */
const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/portfolios/");
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    const title = req.body.title ? req.body.title.split(" ").join("-") : "8pro";
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
    const { title, category, link } = req.body;

    if (title === null || title === "")
      return res.json({ message: "title is required" });
    if (category === null || category === "")
      return res.json({ message: "category is required" });

    const url = `${req.protocol}://${req.get("host")}/api/`;
    const img = `${url}${req.file.path}`;
    const currentDate = new Date();
    const id = currentDate.getTime();

    asyncLib.waterfall(
      [
        (done) => {
          models.Portfolio.findOne({ where: { title } })
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

          models.Portfolio.create({
            id,
            title,
            url: link,
            img,
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
          models.Portfolio.findAll({ order: [["createdAt", "DESC"]] })
            .then((portfolio) => done(portfolio))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
      ],
      (portfolio) => {
        if (!portfolio)
          return res.status(404).json({ message: "No data find" });
        return res.status(200).json({ message: "success", data: portfolio });
      }
    );
  },

  update: (req, res) => {
    const { title, category, link } = req.body;

    if (title === null || title === "")
      return res.json({ message: "title is required" });
    if (category === null || category === "")
      return res.json({ message: "category is required" });

    asyncLib.waterfall(
      [
        (done) => {
          models.Portfolio.findByPk(req.params.id)
            .then((portfolio) => done(null, portfolio))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (portfolio, done) => {
          if (!portfolio)
            return res.status(404).json({ message: "Doesn't exist" });

          portfolio
            .update({
              title,
              category,
              url: link,
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
          models.Portfolio.findByPk(req.params.id)
            .then((portfolio) => done(null, portfolio))
            .catch((e) => {
              const message = `Error occurred, please try again later.`;
              return res.status(500).json({ message, data: e.message });
            });
        },
        (portfolio, done) => {
          if (!portfolio) return res.json({ message: "no data found" });

          portfolio
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
          models.Portfolio.findByPk(req.params.id)
            .then((portfolio) => done(null, portfolio))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (portfolio, done) => {
          if (!portfolio)
            return res.status(404).json({ message: "Doesn't exist" });

          portfolio
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
