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

  const { id, text, value } = req.body;

  if (!id || !text || !value) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    await db.query(
      "UPDATE options SET text = ?, value = ? WHERE id = ?",
      [text, value, id]
    );

    return res.status(200).json({ message: "Updated" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}