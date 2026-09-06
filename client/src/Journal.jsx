import { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  saveJournalEntry,
  getJournalEntries
} from "./services/journalService";

function Journal() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(true);

  // Load entries from Firebase
  const loadEntries = async (user) => {
    if (!user) {
      setEntries([]);
      setLoadingEntries(false);
      return;
    }

    try {
      setLoadingEntries(true);

      const userEntries = await getJournalEntries(user.uid);

      setEntries(userEntries);
    } catch (error) {
      console.error("Error loading journal entries:", error);
      setMessage("Could not load journal entries.");
    } finally {
      setLoadingEntries(false);
    }
  };

  // Wait for Firebase authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadEntries(user);
      } else {
        setEntries([]);
        setLoadingEntries(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save journal entry
  const handleSave = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setMessage("Please write something first.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      setMessage("Please sign in before saving your journal entry.");
      return;
    }

    try {
      setMessage("");

      await saveJournalEntry(user.uid, text.trim());

      setText("");
      setAiReply("");
      setMessage("Journal entry saved!");

      await loadEntries(user);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      setMessage("Could not save journal entry.");
    }
  };

  // Get Gemini reflection
  const handleGemini = async () => {
    if (!text.trim()) {
      setMessage("Please write something first.");
      return;
    }

    setAiLoading(true);
    setAiReply("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gemini request failed.");
      }

      setAiReply(data.reply);
    } catch (error) {
      console.error("Gemini error:", error);
      setMessage("Could not get AI reflection.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="journal-page">

      {/* Writing Section */}
      <section className="journal-card">
        <div className="card-header">
          <div>
            <p className="eyebrow">TODAY'S ENTRY</p>
            <h2>What's on your mind?</h2>
          </div>

          <span className="writing-icon">✍️</span>
        </div>

        <form onSubmit={handleSave}>

          <textarea
            className="journal-textarea"
            rows="10"
            placeholder="Write freely... Your thoughts are private and secure."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="journal-actions">

            <button
              type="submit"
              className="save-btn"
            >
              💾 Save Entry
            </button>

            <button
              type="button"
              className="ai-btn"
              onClick={handleGemini}
              disabled={aiLoading}
            >
              {aiLoading
                ? "✨ Gemini is thinking..."
                : "✨ Get AI Reflection"}
            </button>

          </div>

        </form>

        {message && (
          <div className="status-message">
            {message}
          </div>
        )}
      </section>

      {/* AI Loading */}
      {aiLoading && (
        <section className="ai-card">
          <div className="ai-title">
            <span>✨</span>
            <h2>Gemini is thinking...</h2>
          </div>

          <p className="loading-text">
            Analyzing your thoughts and preparing a reflection.
          </p>
        </section>
      )}

      {/* AI Reflection */}
      {aiReply && !aiLoading && (
        <section className="ai-card">

          <div className="ai-title">
            <span>✨</span>
            <h2>AI Reflection</h2>
          </div>

          <div className="ai-response">
            {aiReply}
          </div>

        </section>
      )}

      {/* Previous Entries */}
      <section className="entries-section">

        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR JOURNAL</p>
            <h2>Previous Entries</h2>
          </div>

          <span className="entry-count">
            {entries.length}{" "}
            {entries.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {/* Loading */}
        {loadingEntries ? (

          <div className="empty-state">
            <div className="empty-icon">⏳</div>

            <h3>Loading your entries...</h3>

            <p>
              Your private journal entries are being loaded.
            </p>
          </div>

        ) : entries.length === 0 ? (

          /* No Entries */
          <div className="empty-state">

            <div className="empty-icon">📖</div>

            <h3>No entries yet</h3>

            <p>
              Your journal entries will appear here after you save them.
            </p>

          </div>

        ) : (

          /* Entries */
          <div className="entries-list">

            {entries.map((entry) => (

              <article
                className="entry-card"
                key={entry.id}
              >

                <div className="entry-top">

                  <span className="entry-label">
                    JOURNAL ENTRY
                  </span>

                  {entry.createdAt?.toDate && (
                    <span className="entry-date">
                      {entry.createdAt
                        .toDate()
                        .toLocaleString()}
                    </span>
                  )}

                </div>

                <p className="entry-text">
                  {entry.text}
                </p>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Journal;