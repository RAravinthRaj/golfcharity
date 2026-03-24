export default function DashboardPage({ data }) {
  if (!data) {
    return <div className="page-state">Loading dashboard metrics...</div>;
  }

  return (
    <div className="content-grid">
      <section className="metrics-grid">
        <article className="metric-card">
          <span>Total users</span>
          <strong>{data.stats.totalUsers}</strong>
          <small>Registered subscriber accounts</small>
        </article>
        <article className="metric-card">
          <span>Active subscribers</span>
          <strong>{data.stats.activeSubscribers}</strong>
          <small>Plans currently contributing to prize logic</small>
        </article>
        <article className="metric-card">
          <span>Total prize pool</span>
          <strong>${data.stats.totalPrizePool}</strong>
          <small>Aggregated draw pool value</small>
        </article>
        <article className="metric-card">
          <span>Charity raised</span>
          <strong>${data.stats.totalCharityRaised}</strong>
          <small>Visible impact tracked across causes</small>
        </article>
      </section>

      <section className="admin-hero-grid">
        <article className="panel accent-panel">
          <p className="eyebrow">Draw engine</p>
          <h2>Simulate first, publish with confidence, and keep payout control centralized.</h2>
          <p>
            The admin experience is designed around operational clarity instead of just raw tables.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Charity layer</p>
          <h2>{data.charities.length} visible causes</h2>
          <p>Featured partners, contribution optics, and content control all stay easy to review.</p>
        </article>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Recent draws</p>
            <h2>Operational snapshot</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Numbers</th>
                <th>Pool</th>
              </tr>
            </thead>
            <tbody>
              {data.draws.map((draw) => (
                <tr key={draw._id}>
                  <td>{draw.monthKey}</td>
                  <td>{draw.drawMode}</td>
                  <td>{draw.status}</td>
                  <td>{draw.numbers.join(", ")}</td>
                  <td>${draw.totalPrizePool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
