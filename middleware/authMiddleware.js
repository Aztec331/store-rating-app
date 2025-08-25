const jwt = require("jsonwebtoken");

// roles: [] means any logged-in user; e.g. ["admin"] or ["admin","owner"]
module.exports = (roles = []) => {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) return res.status(401).json({ error: "No token" });

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;

      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};
