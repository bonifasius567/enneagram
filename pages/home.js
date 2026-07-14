import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(savedUser));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="figmaHomeWrapper">
      <div className="hblob1"></div>
      <div className="hblob2"></div>
      <div className="hblob3"></div>
      <div className="hblob4"></div>

      <div className="figmaHomeHeader">
        <div className="figmaHomeHeaderLeft">
          <div className="figmaLogoBadge">
            <div className="figmaLogoBadgeInner">ENNEAGRAM</div>
          </div>
          <div>
            <h2 className="figmaHomeTitle">Home Enneagram</h2>
            <p className="figmaHomeSubtitle">
              Selamat datang, {user.username}
            </p>
          </div>
        </div>

        <button onClick={handleLogout} className="figmaLogoutButton">
          Logout
        </button>
      </div>

      <div className="figmaHomeGrid">
        <div className="figmaHomeCard">
          <h3>Mulai Tes</h3>
          <p>Lakukan tes Enneagram untuk mengetahui tipe kepribadian Anda.</p>
          <Link href="/test" className="figmaHomeCardButton">
            Mulai Tes
          </Link>
        </div>

        <div className="figmaHomeCard">
          <h3>Riwayat</h3>
          <p>Lihat hasil tes sebelumnya dan analisis Anda.</p>
          <Link href="/history" className="figmaHomeCardButton">
            Lihat Riwayat
          </Link>
        </div>

        {user.is_admin && (
          <div className="figmaHomeCard">
            <h3>Admin Panel</h3>
            <p>Kelola pertanyaan dan sistem quiz.</p>
            <Link href="/admin" className="figmaHomeCardButton">
              Masuk Admin
            </Link>
          </div>
        )}

        <div className="figmaHomeCard full">
          <h3>Tentang Enneagram</h3>
          <p>
            Enneagram adalah sistem kepribadian yang membagi manusia menjadi
            9 tipe. Tes ini membantu Anda memahami pola pikir, emosi, dan
            perilaku Anda.
          </p>
        </div>
      </div>
    </div>
  );
}