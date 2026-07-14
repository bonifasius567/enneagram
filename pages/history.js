import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function HistoryPage() {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    fetch(`/api/quiz/history?user_id=${user.id}`)
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="figmaHistoryWrapper">
      <div className="hyblob1"></div>
      <div className="hyblob2"></div>

      <div className="figmaHistoryInner">
        <button
          className="figmaHistoryBackButton"
          onClick={() => router.push("/home")}
        >
          ← Kembali ke Home
        </button>

        <h1 className="figmaHistoryTitle">Riwayat Tes</h1>

        {data.length === 0 && (
          <p className="figmaHistoryEmpty">Belum ada hasil.</p>
        )}

        {data.map(item => (
          <div key={item.id} className="figmaHistoryCard">
            <p className="figmaHistoryType">Tipe {item.primary_type}</p>
            <p className="figmaHistoryDate">
              {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}