import { useState } from "react";

export default function DrawsPage({ draws, onSimulate, onPublish }) {
  const [mode, setMode] = useState("random");

  return (
    <div className="content-grid">
      <section className="panel">
        <p className="eyebrow">Draw engine</p>
        <h2>Simulate and publish monthly results</h2>
        <div className="action-row">
          <select className="input compact" value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="random">Random</option>
            <option value="algorithmic">Algorithmic</option>
          </select>
          <button className="button" onClick={() => onSimulate(mode)}>
            Run simulation
          </button>
          <button className="button ghost" onClick={() => onPublish()}>
            Publish current month
          </button>
        </div>
      </section>
      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Numbers</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Winners</th>
                <th>Rollover</th>
              </tr>
            </thead>
            <tbody>
              {draws.map((draw) => (
                <tr key={draw._id}>
                  <td>{draw.monthKey}</td>
                  <td>{draw.numbers.join(", ")}</td>
                  <td>{draw.drawMode}</td>
                  <td>{draw.status}</td>
                  <td>{draw.winners.length}</td>
                  <td>${draw.prizeBreakdown?.rollover || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
