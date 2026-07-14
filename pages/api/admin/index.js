import { verifyToken } from "../../../lib/auth";

export default function handler(req, res) {
  const user = verifyToken(req);

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (!user.is_admin) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      message: "Admin authorized",
      user: {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
      },
    });
  }

  return res.status(405).json({
    message: "Method tidak diizinkan",
  });
}