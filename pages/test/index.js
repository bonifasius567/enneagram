import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function QuizPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/quiz/questions")
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleSelect(part, value) {
    const updated = { ...answers, [part]: value };
    setAnswers(updated);

    if (part === 1) {
      setStep(2);
    } else {
      handleSubmit(updated);
    }
  }

  async function handleSubmit(finalAnswers) {
    setSubmitting(true);

    try {
      const payload = [
        { part: 1, value: finalAnswers[1] },
        { part: 2, value: finalAnswers[2] },
      ];

      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: payload }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        setSubmitting(false);
        return;
      }

      router.push(
        `/test/hasil?type=${data.primary_type}&code=${data.code}&detail=${encodeURIComponent(
          JSON.stringify(data.detail)
        )}`
      );
    } catch {
      alert("Terjadi kesalahan");
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (questions.length === 0) return <p>Tidak ada pertanyaan</p>;

  const current = questions.find(q => q.part === step);

  if (!current) return <p>Pertanyaan tidak ditemukan.</p>;

  const progressPercent = (step / 2) * 100;

  return (
    <div className="figmaQuizWrapper">
      <div className="qblob1"></div>
      <div className="qblob2"></div>

      <div className="figmaQuizTopBar">
        <div className="figmaLogoBadge">
          <div className="figmaLogoBadgeInner">ENNEAGRAM</div>
        </div>
        <span className="figmaQuizLabel">THE ENNEAGRAM</span>
      </div>

      <div className="figmaQuizOuter">
        <div className="figmaProgressWrapper">
          <div
            className="figmaProgressBar"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="figmaProgressText">
          Bagian {step} dari 2 — Pilih pernyataan yang paling sesuai dengan dirimu
        </p>

        <p className="figmaQuestionText">{current.text}</p>

        {current.options.map(opt => (
          <div
            key={opt.id}
            className="figmaOptionCard"
            onClick={() => !submitting && handleSelect(current.part, opt.value)}
            role="button"
            tabIndex={0}
          >
            <span className="figmaOptionLetter">{opt.value}</span>
            <span className="figmaOptionText">{opt.text}</span>
          </div>
        ))}

        {submitting && <p className="figmaProgressText">Memproses hasil...</p>}
      </div>
    </div>
  );
}