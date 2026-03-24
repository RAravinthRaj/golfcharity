import { useState } from "react";

const initialForm = {
  name: "",
  slug: "",
  description: "",
  location: "",
  categories: "",
  featured: false
};

export default function CharitiesPage({ charities, onCreate, onDelete }) {
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreate({
      ...form,
      categories: form.categories.split(",").map((item) => item.trim()).filter(Boolean)
    });
    setForm(initialForm);
  };

  return (
    <div className="content-grid two-column">
      <section className="panel">
        <p className="eyebrow">Add charity</p>
        <h2>Expand the directory</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Slug"
            value={form.slug}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
            required
          />
          <textarea
            className="input"
            rows="4"
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Location"
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
          />
          <input
            className="input"
            placeholder="Categories (comma separated)"
            value={form.categories}
            onChange={(event) => setForm({ ...form, categories: event.target.value })}
          />
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setForm({ ...form, featured: event.target.checked })}
            />
            Featured charity
          </label>
          <button className="button" type="submit">
            Add charity
          </button>
        </form>
      </section>

      <section className="panel">
        <p className="eyebrow">Current directory</p>
        <h2>Manage listings</h2>
        <div className="stack-list">
          {charities.map((charity) => (
            <div className="stack-item" key={charity._id}>
              <div>
                <strong>{charity.name}</strong>
                <p>{charity.description}</p>
              </div>
              <button className="button ghost" onClick={() => onDelete(charity._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
