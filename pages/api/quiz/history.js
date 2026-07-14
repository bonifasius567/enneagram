import db from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

export default async function handler(req, res) {
  const user = verifyToken(req);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [rows] = await db.query(
      `SELECT id, primary_type, created_at 
       FROM results 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user.id]
    );

    return res.status(200).json(rows);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}