import { useRouter } from "next/router";

export default function HasilPage() {
  const router = useRouter();
  const { type, code, detail } = router.query;

  if (!type || !code || !detail) {
    return <p>Loading...</p>;
  }

  let d;

  try {
    d = JSON.parse(detail);
  } catch {
    return <p>Format data tidak valid</p>;
  }

  return (
    <div className="figmaResultWrapper">
      <div className="rblob1"></div>
      <div className="rblob2"></div>
      <div className="rblob3"></div>

      <div className="figmaResultInner">
        <button
          className="figmaResultBackButton"
          onClick={() => router.push("/home")}
        >
          ← Kembali ke Home
        </button>

        <div className="figmaResultTitleCard">
          <p className="figmaResultCode">KODE: {code}</p>
          <h1 className="figmaResultTitle">
            Tipe {type} - {d.name}
          </h1>
          <p className="figmaResultDescription">{d.description}</p>
        </div>

        <div className="figmaResultCard main">
          <p className="figmaResultCardLabel">Motivasi Dasar</p>
          <p className="figmaResultCardText">{d.motivation}</p>

          <p className="figmaResultCardLabel">Perilaku Khas</p>
          <p className="figmaResultCardText">{d.behavior}</p>
        </div>

        <div className="figmaResultCard good">
          <p className="figmaResultCardLabel">Kelebihan (+)</p>
          <p className="figmaResultCardText">{d.strengths}</p>
        </div>

        <div className="figmaResultCard bad">
          <p className="figmaResultCardLabel">Kelemahan (-)</p>
          <p className="figmaResultCardText">{d.weaknesses}</p>
        </div>

        <div className="figmaResultCard info">
          <p className="figmaResultCardLabel">Karir yang Cocok</p>
          <p className="figmaResultCardText">{d.careers}</p>

          <p className="figmaResultCardLabel">Tawaran Bantuan</p>
          <p className="figmaResultCardText">{d.help}</p>
        </div>
      </div>
    </div>
  );
}