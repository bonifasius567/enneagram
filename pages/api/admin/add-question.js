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

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method tidak diizinkan" });
  }

  const { text, part } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Text wajib" });
  }

  if (![1, 2].includes(part)) {
    return res.status(400).json({ message: "Part harus 1 atau 2" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO questions (text, part) VALUES (?, ?)",
      [text.trim(), part]
    );

    return res.status(201).json({
      message: "Berhasil",
      question_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}