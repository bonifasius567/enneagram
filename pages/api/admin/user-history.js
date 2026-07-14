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

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "user_id wajib diisi" });
  }

  try {
    const [rows] = await db.query(
      `SELECT 
         r.id,
         r.primary_type,
         r.scores,
         r.created_at,
         e.name,
         e.description,
         e.strengths,
         e.weaknesses,
         e.motivation,
         e.behavior,
         e.careers,
         e.help
       FROM results r
       LEFT JOIN enneagram_types e ON e.id = r.primary_type
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [user_id]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}