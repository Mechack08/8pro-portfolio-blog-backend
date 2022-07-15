const portfolioModel = require("../models/portfolio.model");
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

    asyncLib.waterfall(
      [
        (done) => {
          portfolioModel
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

          portfolioModel
            .create({
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
          portfolioModel
            .find()
            .sort({ created_at: -1 })
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
          portfolioModel
            .findByIdAndUpdate(
              req.params.id,
              {
                title,
                category,
                url: link,
              },
              { new: true, upsert: true, setDefaultsOnInsert: true }
            )
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
        return res.status(201).json({ message: "success", data: portfolio });
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
          portfolioModel
            .findByIdAndUpdate(
              req.params.id,
              { img },
              { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            .then((portfolio) => done(portfolio))
            .catch((e) => {
              const message = `Error occurred, please try again later.`;
              return res.status(500).json({ message, data: e.message });
            });
        },
      ],
      (portfolio) => {
        const message = `success`;
        return res.json({ message, data: portfolio });
      }
    );
  },

  delete: (req, res) => {
    asyncLib.waterfall(
      [
        (done) => {
          portfolioModel
            .findByIdAndDelete(req.params.id)
            .then((portfolio) => done(portfolio))
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
