import db from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

export default async function handler(req, res) {
  const user = verifyToken(req);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!user.is_admin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method tidak diizinkan" });
  }

  try {
    const [rows] = await db.query(
      `SELECT 
         u.id,
         u.username,
         u.email,
         u.is_admin,
         u.created_at,
         COUNT(r.id) AS total_tests
       FROM users u
       LEFT JOIN results r ON r.user_id = u.id
       GROUP BY u.id, u.username, u.email, u.is_admin, u.created_at
       ORDER BY u.created_at DESC`
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}