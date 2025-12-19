import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getSession, onAuthStateChange, signOut } from "./utils/authService";
import Login from "./components/Login";
import Home from "./pages/Home";

function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const s = await getSession();
        setSession(s);
        if (!s) navigate("/login", { replace: true });
      } catch (e) {
        setSession(null);
        navigate("/login", { replace: true });
      }
    })();

    const { data: sub } = onAuthStateChange((event, session) => {
      setSession(session?.access_token ? session : null);
      if (!session) navigate("/login", { replace: true });
    });

    return () => sub?.unsubscribe && sub.unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => navigate("/")} />} />
      <Route path="/" element={<Home session={session} onSignOut={signOut} />} />
    </Routes>
  );
}

export default App;
