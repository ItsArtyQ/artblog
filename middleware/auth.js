import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.locals.user = decoded;
    next();
  } catch {
    return res.redirect("/login");
  }
}

export function requireCompleteRegister(req, res, next) {
  if (!req.user.firstname || !req.user.lastname) {
    return res.redirect("/complete-account");
  }
  next();
}

export function checkUser(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    res.locals.user = decoded;

    if (
      (!decoded.firstName || !decoded.lastName) &&
      req.path !== "/complete-account"
    ) {
      return res.redirect("/complete-account");
    }

    next();
  } catch (e) {
    console.log("JWT error: ", e);
    next();
  }
}
