const jwt = require("jsonwebtoken");
module.exports.authenticate = (req, res, next) => {
  jwt.verify(req.cookies["jwt-token"], process.env.SecretKeyOne, (err, payload) => {
    if (err instanceof jwt.JsonWebTokenError) {
      next();
    }
    else if (err) {
      console.error(err); // log the error
      res.status(401).json({ verified: false });
    } 
    else {
      req.userId = payload.id;
      next();
    }
  });
};
