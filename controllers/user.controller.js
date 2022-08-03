const userModel = require("../models/user.model");
const asyncLib = require("async");
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt.utils");

const PASSWORD_REGEX = /^(?=.*\d).{8,15}$/;

module.exports = {
  signUp: (req, res) => {
    const { username, email, password } = req.body;
    if (username === null || username == "")
      return res.json({ message: "username is required" });
    if (email === null || email == "")
      return res.json({ message: "email is required" });
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
          userModel
            .findOne({
              $or: [{ username: username }, { email: email }],
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

          userModel
            .create({
              username: username,
              email: email,
              password: hashedPWD,
              isAdmin: false,
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
            id: created._id,
            username: created.username,
            email: created.email,
          },
        });
      }
    );
  },

  singIn: (req, res) => {
    const { identification, password } = req.body;

    if (identification === null || identification === "")
      return res.json({ message: "username or email is required" });
    if (password === null || password == "")
      return res.json({ message: "password is required" });

    asyncLib.waterfall(
      [
        (done) => {
          userModel
            .findOne({
              $or: [{ username: identification }, { email: identification }],
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
            const token = jwtUtils.createToken(find.id);
            res.cookie("PortfolioAndBlog", token, {
              httpOnly: true,
              maxAge: 3 * 24 * 60 * 60 * 1000,
            });
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

  getUserInfos: (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    if (userId === null)
      return res.status(400).json({ message: "wrong token" });

    asyncLib.waterfall(
      [
        (done) => {
          userModel
            .findById(userId)
            .select("-password")
            .then((user) => done(null, user))
            .catch((e) => {
              return res.status(500).json({
                error: "Something went wrong, try again later.",
                details: e.message,
              });
            });
        },
        (user, done) => {
          if (!user)
            return res.status(404).json({ message: "User doesn't exist" });

          done(user);
        },
      ],
      (user) => {
        return res.status(200).json({ message: "success", user });
      }
    );
  },
};
