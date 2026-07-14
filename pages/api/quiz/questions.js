import db from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }

  try {
    const [rows] = await db.query(`
      SELECT 
        q.id as question_id,
        q.text as question_text,
        q.part as question_part,
        o.id as option_id,
        o.text as option_text,
        o.value as option_value
      FROM questions q
      JOIN options o ON o.question_id = q.id
      ORDER BY q.part, q.id
    `);

    const grouped = {};

    for (const row of rows) {
      if (!grouped[row.question_id]) {
        grouped[row.question_id] = {
          id: row.question_id,
          text: row.question_text,
          part: row.question_part,
          options: [],
        };
      }

      grouped[row.question_id].options.push({
        id: row.option_id,
        text: row.option_text,
        value: row.option_value,
      });
    }

    return res.status(200).json(Object.values(grouped));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}