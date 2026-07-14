import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [mappings, setMappings] = useState([]);

  const [text, setText] = useState("");
  const [part, setPart] = useState(1);

  const [optionText, setOptionText] = useState("");
  const [optionValue, setOptionValue] = useState("A");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [code, setCode] = useState("AX");
  const [type, setType] = useState(1);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  function getToken() {
    return localStorage.getItem("token");
  }

  useEffect(() => {
    fetchQuestions();
    fetchMappings();
    fetchUsers();
  }, []);

  async function fetchQuestions() {
    try {
      const res = await fetch("/api/admin/questions", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getToken() || ""}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        setQuestions([]);
        return;
      }

      setQuestions(data);
    } catch {
      setQuestions([]);
    }
  }

  async function fetchMappings() {
    try {
      const res = await fetch("/api/admin/mapping", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getToken() || ""}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMappings([]);
        return;
      }

      setMappings(data);
    } catch {
      setMappings([]);
    }
  }

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getToken() || ""}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        setUsers([]);
        return;
      }

      setUsers(data);
    } catch {
      setUsers([]);
    }
  }

  async function openUserHistory(u) {
    setSelectedUser(u);
    setHistoryLoading(true);
    setUserHistory([]);

    try {
      const res = await fetch(`/api/admin/user-history?user_id=${u.id}`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getToken() || ""}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        setUserHistory([]);
        setHistoryLoading(false);
        return;
      }

      setUserHistory(data);
      setHistoryLoading(false);
    } catch {
      setUserHistory([]);
      setHistoryLoading(false);
    }
  }

  function closeUserHistory() {
    setSelectedUser(null);
    setUserHistory([]);
  }

  async function addQuestion() {
    if (!text) return alert("Text wajib");

    const res = await fetch("/api/admin/add-question", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken() || ""}`,
      },
      body: JSON.stringify({ text, part }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setText("");
    fetchQuestions();
  }

  async function addOption() {
    if (!selectedQuestion) return alert("Pilih question dulu");
    if (!optionText) return alert("Text option wajib");

    const exists = selectedQuestion.options.some(
      (o) => o.value === optionValue
    );

    if (exists) {
      return alert(`Option ${optionValue} sudah ada di question ini`);
    }

    const res = await fetch("/api/admin/add-option", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken() || ""}`,
      },
      body: JSON.stringify({
        question_id: selectedQuestion.id,
        text: optionText,
        value: optionValue,
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setOptionText("");
    fetchQuestions();
  }

  async function updateOption(q, o) {
    const duplicate = q.options.some(
      (opt) => opt.value === o.value && opt.id !== o.id
    );

    if (duplicate) {
      return alert(`Option ${o.value} sudah digunakan`);
    }

    await fetch("/api/admin/update-option", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken() || ""}`,
      },
      body: JSON.stringify(o),
    });

    fetchQuestions();
  }

  async function deleteOption(id) {
    await fetch("/api/admin/delete-option", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken() || ""}`,
      },
      body: JSON.stringify({ id }),
    });

    fetchQuestions();
  }

  async function addMapping() {
    const res = await fetch("/api/admin/mapping", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken() || ""}`,
      },
      body: JSON.stringify({
        code,
        enneagram_type: Number(type),
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    fetchMappings();
  }

  return (
    <div className="figmaAdminWrapper">
      <div className="figmaAdminInner">
        <button
          className="figmaAdminBackButton"
          onClick={() => router.push("/home")}
        >
          ← Kembali ke Home
        </button>

        <h1 className="figmaAdminTitle">Admin Dashboard</h1>

        {/* ADD QUESTION */}
        <div className="figmaAdminSection">
          <h3 className="figmaAdminSectionTitle">Tambah Pertanyaan</h3>

          <div className="figmaAdminRow">
            <input
              className="figmaAdminInput"
              placeholder="Teks pertanyaan"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <select
              className="figmaAdminSelect"
              style={{ flex: "0 0 140px" }}
              value={part}
              onChange={(e) => setPart(Number(e.target.value))}
            >
              <option value={1}>Bagian 1</option>
              <option value={2}>Bagian 2</option>
            </select>

            <button className="figmaAdminButton" onClick={addQuestion}>
              Tambah
            </button>
          </div>
        </div>

        {/* ADD OPTION */}
        <div className="figmaAdminSection">
          <h3 className="figmaAdminSectionTitle">Tambah Option</h3>

          <div className="figmaAdminRow">
            <select
              className="figmaAdminSelect"
              onChange={(e) => {
                const q = questions.find(q => q.id == e.target.value);
                setSelectedQuestion(q);

                if (q?.part === 1) setOptionValue("A");
                else if (q?.part === 2) setOptionValue("X");
              }}
            >
              <option value="">-- pilih question --</option>
              {questions.map(q => (
                <option key={q.id} value={q.id}>
                  [{q.part}] {q.text}
                </option>
              ))}
            </select>
          </div>

          {selectedQuestion && (
            <div className="figmaAdminRow">
              <input
                className="figmaAdminInput"
                placeholder="Teks option"
                value={optionText}
                onChange={(e) => setOptionText(e.target.value)}
              />

              <select
                className="figmaAdminSelect"
                style={{ flex: "0 0 100px" }}
                value={optionValue}
                onChange={(e) => setOptionValue(e.target.value)}
              >
                {selectedQuestion.part === 1 ? (
                  <>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </>
                ) : (
                  <>
                    <option value="X">X</option>
                    <option value="Y">Y</option>
                    <option value="Z">Z</option>
                  </>
                )}
              </select>

              <button className="figmaAdminButton" onClick={addOption}>
                Tambah Option
              </button>
            </div>
          )}
        </div>

        {/* LIST QUESTIONS */}
        <div className="figmaAdminSection">
          <h3 className="figmaAdminSectionTitle">Daftar Pertanyaan &amp; Option</h3>

          {questions.map((q) => (
            <div key={q.id} className="figmaQuestionCard">
              <p className="figmaQuestionCardHeader">
                <span className="figmaQuestionCardBadge">Bagian {q.part}</span>
                {q.text}
              </p>

              {q.options.map((o) => (
                <div key={o.id} className="figmaOptionRow">
                  <input
                    className="figmaAdminInput"
                    value={o.text}
                    onChange={(e) => {
                      const updated = questions.map(item => {
                        if (item.id !== q.id) return item;
                        return {
                          ...item,
                          options: item.options.map(opt =>
                            opt.id === o.id ? { ...opt, text: e.target.value } : opt
                          ),
                        };
                      });
                      setQuestions(updated);
                    }}
                  />

                  <select
                    className="figmaAdminSelect"
                    style={{ flex: "0 0 90px" }}
                    value={o.value}
                    onChange={(e) => {
                      const updated = questions.map(item => {
                        if (item.id !== q.id) return item;
                        return {
                          ...item,
                          options: item.options.map(opt =>
                            opt.id === o.id ? { ...opt, value: e.target.value } : opt
                          ),
                        };
                      });
                      setQuestions(updated);
                    }}
                  >
                    {q.part === 1 ? (
                      <>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </>
                    ) : (
                      <>
                        <option value="X">X</option>
                        <option value="Y">Y</option>
                        <option value="Z">Z</option>
                      </>
                    )}
                  </select>

                  <button
                    className="figmaAdminButtonSmall"
                    onClick={() => updateOption(q, o)}
                  >
                    Save
                  </button>
                  <button
                    className="figmaAdminButtonDanger"
                    onClick={() => deleteOption(o.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* LIST USERS */}
        <div className="figmaAdminSection">
          <h3 className="figmaAdminSectionTitle">Daftar User</h3>

          {users.length === 0 && (
            <p className="figmaHistoryEmpty">Belum ada user.</p>
          )}

          {users.map((u) => (
            <div key={u.id} className="figmaAdminUserRow">
              <div className="figmaAdminUserInfo">
                <p className="figmaAdminUserName">
                  {u.username}
                  {u.is_admin ? (
                    <span className="figmaAdminUserBadgeAdmin">ADMIN</span>
                  ) : null}
                </p>
                <p className="figmaAdminUserMeta">
                  {u.email} &middot; {u.total_tests} tes
                </p>
              </div>

              <button
                className="figmaAdminButtonSmall"
                onClick={() => openUserHistory(u)}
              >
                Lihat History
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL USER HISTORY */}
      {selectedUser && (
        <div className="figmaModalOverlay" onClick={closeUserHistory}>
          <div
            className="figmaModalBox"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="figmaModalCloseButton"
              onClick={closeUserHistory}
            >
              ×
            </button>

            <h3 className="figmaModalTitle">
              Riwayat Tes — {selectedUser.username}
            </h3>

            {historyLoading && <p>Memuat...</p>}

            {!historyLoading && userHistory.length === 0 && (
              <div className="figmaModalEmpty">
                User ini belum melakukan tes.
              </div>
            )}

            {!historyLoading &&
              userHistory.map((h) => (
                <div key={h.id} className="figmaModalResultCard">
                  <p className="figmaModalResultType">
                    Tipe {h.primary_type} - {h.name || "-"}
                  </p>
                  {h.description && (
                    <p className="figmaModalResultDesc">{h.description}</p>
                  )}
                  <p className="figmaModalResultDate">
                    {new Date(h.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}