import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Journal from "./Journal";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span>Gemini Journal</span>
        </div>

        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>

      <main className="main-content">
        {user ? (
          <div className="dashboard">
            <section className="welcome">
              <p className="eyebrow">YOUR PRIVATE JOURNAL</p>
              <h1>Welcome back 👋</h1>
              <p>
                A safe space to write, reflect, and understand your thoughts
                with Gemini.
              </p>
            </section>

            <Journal />
          </div>
        ) : (
          <div className="auth-container">
            <div className="auth-heading">
              <div className="logo-large">✦</div>
              <p className="eyebrow">YOUR PRIVATE SPACE</p>
              <h1>Secure Gemini Journal</h1>
              <p>
                Write your thoughts privately and use AI to reflect on your
                day.
              </p>
            </div>

            <div className="auth-card">
              <Signup />

              <div className="divider">
                <span>Already have an account?</span>
              </div>

              <Login />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>🔒 Your journal is protected with Firebase authentication.</p>
      </footer>
    </div>
  );
}

export default App;