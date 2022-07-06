const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60 * 1000;

module.exports = {
  createToken: (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
      expiresIn: maxAge,
    });
  },

  parseAuthorization: (authorization) => {
    const authorizationKey = authorization.split(" ");
    const token = authorizationKey[1];
    return token;
  },

  getUserId: (authorization) => {
    let userId = null;
    const token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      const jwToken = jwt.verify(token, process.env.TOKEN_SECRET);

      if (jwToken != null) userId = jwToken.id;
    }

    return userId;
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
