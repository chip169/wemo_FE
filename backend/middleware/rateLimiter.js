const attempts = new Map(); // ip -> { count, lastAttempt, blockedUntil }

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();

  const record = attempts.get(ip) || { count: 0, lastAttempt: now, blockedUntil: 0 };

  if (record.blockedUntil > now) {
    const minutesLeft = Math.ceil((record.blockedUntil - now) / 60000);
    return res.status(429).json({
      error: `Thao tác quá nhanh. Địa chỉ IP của bạn đã bị tạm khóa. Vui lòng thử lại sau ${minutesLeft} phút.`,
    });
  }

  // If last attempt was more than 1 minute ago, reset count
  if (now - record.lastAttempt > 60000) {
    record.count = 0;
  }

  record.count += 1;
  record.lastAttempt = now;

  // Limit to 5 attempts per minute
  if (record.count > 5) {
    record.blockedUntil = now + 15 * 60000; // Block for 15 minutes
    attempts.set(ip, record);
    return res.status(429).json({
      error: "Bạn đã nhập sai hoặc gửi yêu cầu quá nhiều lần. IP của bạn bị khóa tạm thời trong 15 phút.",
    });
  }

  attempts.set(ip, record);
  next();
};

module.exports = rateLimiter;
