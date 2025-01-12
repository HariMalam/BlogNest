const User = require("../models/User");
const jwt = require("jsonwebtoken");

const restrictToLoggedinUserOnly = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.redirect("/auth/login");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.redirect("/auth/login");
  }
};

const adminOnly = async (req, res, next) => {
  if(req.user.type === 'admin') {
    next();
  }
  else {
    res.redirect('/');
  }
}

module.exports = { restrictToLoggedinUserOnly, adminOnly };
