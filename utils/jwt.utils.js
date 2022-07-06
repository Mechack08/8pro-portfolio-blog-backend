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
};
