const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const maxAge = 3 * 24 * 60 * 60 * 1000;

module.exports = {
  createToken: (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
      expiresIn: maxAge,
    });
  },

  parseAuthorization: (authorization) => {
    let token = null;
    if (authorization) {
      const authorizationKey = authorization.split(" ");
      token = authorizationKey[1];
    }
    return token;
  },

  getUserId: (authorization) => {
    let userId = null;
    let token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) token = null;
        if (decoded) token = decoded;
      });

      if (token !== null) userId = token.id;
    }

    return userId;
  },

  checkUser: (req, res, next) => {
    const token = req.cookies.PortfolioAndBlog;

    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await userModel
            .findById(decodedToken.id)
            .select("-password");
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  },

  /* Middleware */
  requireAuth: (req, res, next) => {
    const getToken = req.cookies.PortfolioAndBlog;

    if (getToken) {
      jwt.verify(
        getToken,
        process.env.TOKEN_SECRET,
        async (err, decodedToken) => {
          if (err) console.log(err);
          else {
            console.log(decodedToken.id);
            next();
          }
        }
      );
    } else {
      console.log("No Token Find");
      res.json({ msg: "No Token Find" });
    }
  },
};
