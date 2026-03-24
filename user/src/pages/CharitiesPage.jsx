import { Link } from "react-router-dom";

export default function CharitiesPage({ charities, search, setSearch }) {
  return (
    <div className="page">
      <section className="section-header">
        <div>
          <p className="eyebrow">Charity directory</p>
          <h1>Browse impact partners</h1>
        </div>
        <input
          className="input"
          placeholder="Search charities"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      <div className="card-grid">
        {charities.map((charity) => (
          <article className="card" key={charity._id}>
            <div className="card-tag">{charity.categories?.join(", ") || "Charity partner"}</div>
            <h3>{charity.name}</h3>
            <p>{charity.description}</p>
            <p className="muted">Raised so far: ${charity.totalRaised}</p>
            <Link className="text-link" to={`/charities/${charity.slug}`}>
              Read more
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
