import db from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

export default async function handler(req, res) {
  const user = verifyToken(req);

  if (!user || !user.is_admin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method tidak diizinkan" });
  }

  const { id, text, part } = req.body;

  if (!id || !text) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    await db.query(
      "UPDATE questions SET text = ?, part = ? WHERE id = ?",
      [text, part, id]
    );

    return res.status(200).json({ message: "Updated" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}