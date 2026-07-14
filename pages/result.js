import { useEffect, useState } from "react";
import { enneagramDetail } from "../lib/enneagramDetail";

const detail = {
  1: {
    nama: "Perfeksionis",
    deskripsi: "Ingin sempurna dan idealis",
    karir: "Dokter, pengacara, manajemen",
  },
  2: {
    nama: "Penolong",
    deskripsi: "Peduli dan suka membantu",
    karir: "Konselor, guru",
  },
  3: {
    nama: "Achiever",
    deskripsi: "Berorientasi prestasi",
    karir: "Bisnis, politik",
  },
  4: {
    nama: "Seniman",
    deskripsi: "Kreatif dan ekspresif",
    karir: "Seni, penulis",
  },
  5: {
    nama: "Pemikir",
    deskripsi: "Analitis dan observatif",
    karir: "Teknik, analis",
  },
  6: {
    nama: "Loyalis",
    deskripsi: "Setia dan waspada",
    karir: "Keamanan, pendidikan",
  },
  7: {
    nama: "Petualang",
    deskripsi: "Optimis dan aktif",
    karir: "Entrepreneur",
  },
  8: {
    nama: "Pemimpin",
    deskripsi: "Kuat dan dominan",
    karir: "Leader, CEO",
  },
  9: {
    nama: "Pendamai",
    deskripsi: "Tenang dan harmonis",
    karir: "Mediator",
  },
};

export default function ResultPage() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("result");
    if (data) {
      setResult(JSON.parse(data));
    }
  }, []);

  if (!result) return <p>Tidak ada hasil.</p>;

  const tipe = result.primary_type;
  const info = detail[tipe];

  return (
    <div className="container">
      <h1>Hasil Anda</h1>

      <div className="resultBox">
        <h2>Tipe {tipe} - {info.nama}</h2>
        <p>{info.deskripsi}</p>

        <h3>Karir yang cocok:</h3>
        <p>{info.karir}</p>
      </div>
    </div>
  );
}