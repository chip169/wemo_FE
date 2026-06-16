const { verifyToken } = require("../utils/auth");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Truy cập bị từ chối. Vui lòng đăng nhập admin." });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Phiên làm việc hết hạn hoặc token không hợp lệ." });
  }

  req.admin = decoded;
  next();
};

module.exports = authMiddleware;
