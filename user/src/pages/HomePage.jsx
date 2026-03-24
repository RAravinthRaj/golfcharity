import { Link } from "react-router-dom";

export default function HomePage({ homeData }) {
  const featuredCharities = homeData?.featuredCharities || [];
  const recentDraws = homeData?.recentDraws || [];

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy-wrap">
          <p className="eyebrow">Golf Charity Subscription Platform</p>
          <h1>Track your latest five rounds, fund a cause, and enter every monthly draw.</h1>
          <p className="hero-copy">
            A modern subscription platform built around Stableford score tracking, monthly prize
            tiers, and visible charitable impact.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/signup">
              Start Monthly Plan
            </Link>
            <Link className="button ghost" to="/charities">
              Explore Charities
            </Link>
          </div>
          <div className="hero-badges">
            <span>Monthly and yearly plans</span>
            <span>Rolling 5-score memory</span>
            <span>Charity-first prize experience</span>
          </div>
        </div>
        <div className="hero-side">
          <div className="glass-panel live-panel">
            <div className="live-panel-head">
              <div>
                <small>Live impact snapshot</small>
                <h3>Built to feel active, not static</h3>
              </div>
              <span className="pulse-dot">Live</span>
            </div>
            <div className="impact-stack">
              <div className="impact-stat">
                <span>Draw focus</span>
                <strong>5-match jackpot</strong>
              </div>
              <div className="impact-stat">
                <span>Prize split</span>
                <strong>40 / 35 / 25</strong>
              </div>
              <div className="impact-stat">
                <span>Contribution floor</span>
                <strong>10% minimum donation</strong>
              </div>
            </div>
          </div>
          <div className="glass-panel editorial-panel">
            <p className="eyebrow">Why this feels different</p>
            <ul className="feature-list">
              <li>Emotion-led homepage and charity-first storytelling</li>
              <li>Rolling 5-score history in Stableford format</li>
              <li>Monthly 3, 4, and 5-match draw tiers</li>
              <li>Admin-controlled simulations, publishing, and winner verification</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="metric-card metric-tall">
          <span>Active subscribers</span>
          <strong>{homeData?.heroStats?.activeSubscribers || 0}</strong>
          <small>Subscribers currently entering live draw cycles</small>
        </article>
        <article className="metric-card metric-tall">
          <span>Published draws</span>
          <strong>{homeData?.heroStats?.totalDraws || 0}</strong>
          <small>Completed result releases already visible to players</small>
        </article>
        <article className="metric-card metric-tall">
          <span>Featured charities</span>
          <strong>{homeData?.heroStats?.featuredCharities || 0}</strong>
          <small>Spotlight causes presented inside the signup journey</small>
        </article>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">Featured charities</p>
          <h2>Choose where your subscription leaves a mark.</h2>
        </div>
        <div className="card-grid">
          {featuredCharities.map((charity) => (
            <article className="card feature-card" key={charity._id}>
              <div className="card-topline">
                <div className="card-tag">{charity.location}</div>
                <span className="mini-kicker">Featured partner</span>
              </div>
              <h3>{charity.name}</h3>
              <p>{charity.description}</p>
              <Link className="text-link" to={`/charities/${charity.slug}`}>
                View profile
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">Draw mechanics</p>
          <h2>Monthly rewards with transparent prize logic.</h2>
        </div>
        <div className="card-grid">
          <article className="card feature-card">
            <h3>3-match tier</h3>
            <p>25% of the prize pool, shared equally across eligible winners.</p>
          </article>
          <article className="card feature-card">
            <h3>4-match tier</h3>
            <p>35% of the prize pool, distributed among subscribers who match four numbers.</p>
          </article>
          <article className="card feature-card">
            <h3>5-match jackpot</h3>
            <p>40% of the pool with rollover logic if no perfect match is found.</p>
          </article>
        </div>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">Recent results</p>
          <h2>Latest published draws</h2>
        </div>
        <div className="card-grid">
          {recentDraws.length ? (
            recentDraws.map((draw) => (
              <article className="card feature-card" key={draw._id}>
                <div className="card-topline">
                  <div className="card-tag">{draw.monthKey}</div>
                  <span className="mini-kicker">{draw.status}</span>
                </div>
                <h3>{draw.numbers.join(" • ")}</h3>
                <p>{draw.winners.length} winners and a prize pool of ${draw.totalPrizePool}</p>
              </article>
            ))
          ) : (
            <article className="card feature-card">
              <h3>First draw pending</h3>
              <p>Run a simulation from the admin panel and publish once the review is complete.</p>
            </article>
          )}
        </div>
      </section>

      <section className="impact-band">
        <div>
          <p className="eyebrow">Built around momentum</p>
          <h2>Subscription revenue, charitable intent, and draw excitement in one elegant loop.</h2>
        </div>
        <div className="impact-steps">
          <article>
            <span>01</span>
            <h3>Subscribe</h3>
            <p>Choose a plan and point your contribution toward a cause you care about.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Track</h3>
            <p>Keep your five most recent Stableford scores current and competition-ready.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Enter</h3>
            <p>Move into the monthly draw cycle with clear prize logic and visible impact.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
