import { useEffect, useState } from "react";
import { getBatches, getSalesAnalytics, getFlockAnalytics } from "./api";

export default function Dashboard() {
  const [batches, setBatches] = useState([]);
  const [sales, setSales] = useState(null);
  const [flock, setFlock] = useState(null);

  useEffect(() => {
    getBatches().then(setBatches);
    getSalesAnalytics().then(setSales);
    getFlockAnalytics().then(setFlock);
  }, []);

  return (
    <div>
      <h2 style={{ color: "#e9c46a" }}>Farm Dashboard</h2>

      <div className="stat-row" style={{ marginBottom: 20 }}>
        <div className="stat"><div className="value">{flock?.activeBatches ?? "-"}</div><div className="label">Active Batches</div></div>
        <div className="stat"><div className="value">{flock?.totalBirds ?? "-"}</div><div className="label">Total Birds</div></div>
        <div className="stat"><div className="value">{flock?.totalEggs ?? "-"}</div><div className="label">Eggs Collected</div></div>
        <div className="stat"><div className="value">ETB {sales?.totalSalesETB ?? "-"}</div><div className="label">Total Sales</div></div>
      </div>

      <div className="card">
        <h3>Batches</h3>
        <table>
          <thead><tr><th>Batch</th><th>Breed</th><th>Birds</th><th>Started</th><th>Status</th></tr></thead>
          <tbody>
            {batches.map((b) => (
              <tr key={b.id}>
                <td>{b.batchName}</td>
                <td>{b.breed}</td>
                <td>{b.birdCount}</td>
                <td>{b.startDate}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Sales by Product</h3>
        <table>
          <thead><tr><th>Product</th><th>Units Sold</th><th>Revenue (ETB)</th></tr></thead>
          <tbody>
            {sales?.byProduct.map((p) => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td>{p.unitsSold}</td>
                <td>{p.revenueETB}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
