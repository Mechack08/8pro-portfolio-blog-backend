const models = require("../models");
const asyncLib = require("async");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const PASSWORD_REGEX = /^(?=.*\d).{8,15}$/;

module.exports = {
  signUp: (req, res) => {
    const { username, email, password } = req.body;
    if (username === null || username == "")
      return res.json({ message: "username is required" });
    if (email === null || email == "")
      return res.json({ message: "email is required" });
    if (!EMAIL_REGEX.test(email)) return res.json({ message: "invalid email" });
    if (password === null || password == "")
      return res.json({ message: "password is required" });
    if (!PASSWORD_REGEX.test(password))
      return res.json({
        message:
          "invalide password. Must have a length from 8 - 15 and include at least 1 number",
      });

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            where: { [Op.or]: [{ username: username }, { email: email }] },
            attributes: ["id"],
          })
            .then((user) => done(null, user))
            .catch((e) => {
              const error = "Something went wrong, try again later.";
              return res.status(500).json({ error, details: e.message });
            });
        },
        (user, done) => {
          if (user)
            return res.status(409).json({ message: "user already exist" });

          bcrypt.hash(password, 10, (err, hashedPWD) => {
            done(null, user, hashedPWD);
          });
        },
        (user, hashedPWD, done) => {
          const currentDate = new Date();
          const id = currentDate.getTime();

          models.User.create({
            id: id,
            username: username,
            email: email,
            password: hashedPWD,
          })
            .then((created) => done(created))
            .catch((e) => {
              return res.status(500).json({
                error: "error happened, please try again later",
                details: e.message,
              });
            });
        },
      ],
      (created) => {
        return res.status(201).json({
          message: "success",
          data: {
            id: created.id,
            username: created.username,
            email: created.email,
          },
        });
      }
    );
  },

  singIn: (req, res) => {
    const { identification, password } = req.body;

    const maxAge = 3 * 24 * 60 * 60 * 1000;
    const createToken = (id) => {
      return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge,
      });
    };

    if (identification === null || identification === "")
      return res.json({ message: "username or email is required" });
    if (password === null || password == "")
      return res.json({ message: "password is required" });

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            where: {
              [Op.or]: [
                { username: identification },
                { email: identification },
              ],
            },
          })
            .then((find) => done(null, find))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (find, done) => {
          if (!find) return res.status(404).json({ message: "user not exist" });

          bcrypt.compare(password, find.password, (err, pwd) => {
            done(null, find, pwd);
          });
        },
        (find, pwd, done) => {
          if (pwd) {
            const token = createToken(find.id);
            res.cookie("PortfolioAndBlog", token, { httpOnly: true, maxAge });
            done(find);
          } else return res.status(403).json({ message: "invalid password" });
        },
      ],
      (find) => {
        return res.status(200).json({ message: "logged in" });
      }
    );
  },

  signOut: (req, res) => {
    res.cookie("PortfolioAndBlog", "", { maxAge: 1 });
    res.redirect("/");
  },
};
