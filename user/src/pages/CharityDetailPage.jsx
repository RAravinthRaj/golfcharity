export default function CharityDetailPage({ charity }) {
  if (!charity) {
    return <div className="page-state">Loading charity profile...</div>;
  }

  return (
    <div className="page">
      <section className="hero compact">
        <div>
          <p className="eyebrow">Charity profile</p>
          <h1>{charity.name}</h1>
          <p className="hero-copy">{charity.description}</p>
        </div>
        <div className="glass-panel">
          <p>
            <strong>Location:</strong> {charity.location || "Global"}
          </p>
          <p>
            <strong>Raised:</strong> ${charity.totalRaised}
          </p>
          <p>
            <strong>Categories:</strong> {charity.categories?.join(", ") || "Community impact"}
          </p>
        </div>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">Upcoming events</p>
          <h2>Golf-led fundraising moments</h2>
        </div>
        <div className="card-grid">
          {(charity.upcomingEvents?.length ? charity.upcomingEvents : ["New event listings coming soon"]).map(
            (eventName) => (
              <article className="card" key={eventName}>
                <h3>{eventName}</h3>
                <p>Feature this inside the charity spotlight module and event calendar later.</p>
              </article>
            )
          )}
        </div>
      </section>
    </div>
  );
}
