import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function QuizPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quiz/questions")
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      });
  }, []);

  function handleSelect(questionId, optionId) {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  }

  async function handleSubmit() {
    if (Object.keys(answers).length !== questions.length) {
      alert("Semua pertanyaan harus dijawab.");
      return;
    }

    const payload = {
      answers: Object.entries(answers).map(([q, o]) => ({
        question_id: q,
        option_id: o,
      })),
    };

    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    localStorage.setItem("result", JSON.stringify(result));

    router.push("/result");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Quiz Enneagram</h1>

      {Array.isArray(questions) && questions.map((q) => (
        <div key={q.id}>
          <p><b>{q.text}</b></p>

          {q.options.map((opt) => (
            <div className="option" key={opt.id}>
              <input
                type="radio"
                name={`q-${q.id}`}
                onChange={() => handleSelect(q.id, opt.id)}
              />
              <label>{opt.text}</label>
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}