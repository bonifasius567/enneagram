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

  if (req.method === "GET") {
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
        LEFT JOIN options o ON o.question_id = q.id
        ORDER BY q.part, q.id
      `);

      const grouped = {};

      for (const r of rows) {
        if (!grouped[r.question_id]) {
          grouped[r.question_id] = {
            id: r.question_id,
            text: r.question_text,
            part: r.question_part,
            options: [],
          };
        }

        if (r.option_id) {
          grouped[r.question_id].options.push({
            id: r.option_id,
            text: r.option_text,
            value: r.option_value,
          });
        }
      }

      return res.status(200).json(Object.values(grouped));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method tidak diizinkan" });
}