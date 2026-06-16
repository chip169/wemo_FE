const crypto = require("crypto");

const SALT = process.env.PASSWORD_SALT || "wemo_secret_salt_123";
const JWT_SECRET = process.env.JWT_SECRET || "wemo_default_jwt_secret_key_987654321";

// Password Hashing
const hashPassword = (password) => {
  return crypto.pbkdf2Sync(password, SALT, 1000, 64, "sha512").toString("hex");
};

// Generate JWT Token
const generateToken = (payload, expiresInMs = 24 * 60 * 60 * 1000) => { // Default 24 hours
  const expiry = Date.now() + expiresInMs;
  const tokenPayload = {
    ...payload,
    exp: expiry
  };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(tokenPayload)).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
};

// Verify JWT Token
const verifyToken = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  
  const [header, body, signature] = parts;
  const expectedSignature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  
  if (signature !== expectedSignature) return null;
  
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
};

// Order ID signatures (prevents unauthorized gift creation without validating first)
const signOrderId = (orderId) => {
  return crypto.createHmac("sha256", JWT_SECRET).update(orderId).digest("hex");
};

const verifyOrderIdSignature = (orderId, signature) => {
  const expected = signOrderId(orderId);
  return expected === signature;
};

module.exports = {
  hashPassword,
  generateToken,
  verifyToken,
  signOrderId,
  verifyOrderIdSignature
};
