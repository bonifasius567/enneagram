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

  try {
    // =========================
    // GET: ambil semua mapping
    // =========================
    if (req.method === "GET") {
      const [rows] = await db.query(
        "SELECT * FROM result_mapping ORDER BY code"
      );

      return res.status(200).json(rows);
    }

    // =========================
    // POST: tambah mapping
    // =========================
    if (req.method === "POST") {
      const { code, enneagram_type } = req.body;

      if (!code || !enneagram_type) {
        return res.status(400).json({ message: "Data tidak lengkap" });
      }

      if (!/^[ABC][XYZ]$/.test(code)) {
        return res.status(400).json({ message: "Code tidak valid" });
      }

      const [result] = await db.query(
        "INSERT INTO result_mapping (code, enneagram_type) VALUES (?, ?)",
        [code, enneagram_type]
      );

      return res.status(201).json({
        message: "Mapping berhasil ditambah",
        id: result.insertId,
      });
    }

    // =========================
    // PUT: update mapping
    // =========================
    if (req.method === "PUT") {
      const { id, code, enneagram_type } = req.body;

      if (!id || !code || !enneagram_type) {
        return res.status(400).json({ message: "Data tidak lengkap" });
      }

      if (!/^[ABC][XYZ]$/.test(code)) {
        return res.status(400).json({ message: "Code tidak valid" });
      }

      await db.query(
        "UPDATE result_mapping SET code = ?, enneagram_type = ? WHERE id = ?",
        [code, enneagram_type, id]
      );

      return res.status(200).json({ message: "Mapping berhasil diupdate" });
    }

    // =========================
    // DELETE: hapus mapping
    // =========================
    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "ID wajib" });
      }

      await db.query("DELETE FROM result_mapping WHERE id = ?", [id]);

      return res.status(200).json({ message: "Mapping berhasil dihapus" });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}