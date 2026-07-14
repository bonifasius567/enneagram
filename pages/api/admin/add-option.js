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

  const { question_id, text, value } = req.body;

  if (!question_id || !text || !value) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  if (!["A", "B", "C", "X", "Y", "Z"].includes(value)) {
    return res.status(400).json({ message: "Value tidak valid" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO options (question_id, text, value) VALUES (?, ?, ?)",
      [question_id, text.trim(), value]
    );

    return res.status(201).json({
      message: "Option berhasil ditambah",
      option_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}