import db from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }

  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: "Format tidak valid." });
  }

  try {
    let part1 = null;
    let part2 = null;

    for (const a of answers) {
      if (a.part === 1) part1 = a.value;
      if (a.part === 2) part2 = a.value;
    }

    if (!part1 || !part2) {
      return res.status(400).json({ message: "Jawaban tidak lengkap." });
    }

    const code = part1 + part2;

    // ambil mapping
    const [[mapping]] = await db.query(
      "SELECT enneagram_type FROM result_mapping WHERE code = ?",
      [code]
    );

    if (!mapping) {
      return res.status(404).json({ message: "Mapping tidak ditemukan." });
    }

    const type = mapping.enneagram_type;

    // ambil detail dari DB
    const [[detail]] = await db.query(
      "SELECT * FROM enneagram_types WHERE id = ?",
      [type]
    );

    if (!detail) {
      return res.status(404).json({ message: "Detail tidak ditemukan." });
    }

    const user = verifyToken(req);
    const userId = user ? user.id : null;

    const [insert] = await db.query(
      `INSERT INTO results (user_id, primary_type, scores) 
       VALUES (?, ?, ?)`,
      [
        userId,
        type,
        JSON.stringify({ code }),
      ]
    );

    return res.status(200).json({
      result_id: insert.insertId,
      code,
      primary_type: type,
      detail,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}