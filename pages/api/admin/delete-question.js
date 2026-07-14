import db from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

export default async function handler(req, res) {
  const user = verifyToken(req);

  if (!user || !user.is_admin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method tidak diizinkan" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID wajib" });
  }

  try {
    await db.query("DELETE FROM option_weights WHERE option_id IN (SELECT id FROM options WHERE question_id = ?)", [id]);
    await db.query("DELETE FROM options WHERE question_id = ?", [id]);
    await db.query("DELETE FROM questions WHERE id = ?", [id]);

    return res.status(200).json({ message: "Deleted" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}