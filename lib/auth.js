import jwt from "jsonwebtoken";

export function verifyToken(req) {
  let token = null;

  // ================= COOKIE =================
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // ================= HEADER (fallback) =================
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2) {
      token = parts[1];
    }
  }

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return null;
  }
}