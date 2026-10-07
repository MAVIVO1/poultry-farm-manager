import { useState } from "react";
import Login from "./Login";
import Shop from "./Shop";
import Dashboard from "./Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("shop");

  function handleLogout() {
    localStorage.removeItem("farm_token");
    setUser(null);
  }

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="shell">
      <header>
        <h1>🐔 Poultry Farm Manager</h1>
        <div>
          <nav style={{ display: "inline-block", marginRight: 20 }}>
            <button className={tab === "shop" ? "active" : ""} onClick={() => setTab("shop")}>Shop</button>
            {user.role === "admin" && (
              <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>Dashboard</button>
            )}
          </nav>
          <span style={{ marginRight: 14, opacity: 0.85 }}>{user.name} ({user.role})</span>
          <button className="primary" onClick={handleLogout}>Log out</button>
        </div>
      </header>
      <main>{tab === "dashboard" && user.role === "admin" ? <Dashboard /> : <Shop />}</main>
    </div>
  );
}
