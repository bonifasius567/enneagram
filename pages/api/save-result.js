import db from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }

  const {
    user_id,
    pilihan_bagian_1,
    pilihan_bagian_2,
    kode,
    tipe,
    nama,
  } = req.body;

  if (!user_id || !pilihan_bagian_1 || !pilihan_bagian_2 || !kode || !tipe || !nama) {
    return res.status(400).json({ message: "Data hasil tes belum lengkap." });
  }

  try {
    await db.query(
      `INSERT INTO test_results 
      (user_id, pilihan_bagian_1, pilihan_bagian_2, kode, tipe, nama)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, pilihan_bagian_1, pilihan_bagian_2, kode, tipe, nama]
    );

    return res.status(201).json({ message: "Hasil tes berhasil disimpan." });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
}