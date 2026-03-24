import { useState } from "react";

export default function UsersPage({ users, onSaveSubscription, onSaveScores }) {
  const [drafts, setDrafts] = useState({});
  const [scoreDrafts, setScoreDrafts] = useState({});

  const getDraft = (user) =>
    drafts[user._id] || {
      status: user.subscription?.status || "inactive",
      plan: user.subscription?.plan || "none"
    };

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">User management</p>
          <h2>Subscribers and score owners</h2>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Charity</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Scores</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const draft = getDraft(user);

              const scoreDraft =
                scoreDrafts[user._id] ||
                user.scores
                  .map(
                    (score) =>
                      `${score.value}|${new Date(score.playedAt).toISOString().slice(0, 10)}`
                  )
                  .join("\n");

              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.selectedCharity?.name || "None"}</td>
                  <td>
                    <select
                      className="input compact"
                      value={draft.plan}
                      onChange={(event) =>
                        setDrafts({
                          ...drafts,
                          [user._id]: { ...draft, plan: event.target.value }
                        })
                      }
                    >
                      <option value="none">None</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="input compact"
                      value={draft.status}
                      onChange={(event) =>
                        setDrafts({
                          ...drafts,
                          [user._id]: { ...draft, status: event.target.value }
                        })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="lapsed">Lapsed</option>
                    </select>
                  </td>
                  <td>
                    <textarea
                      className="input"
                      rows="4"
                      value={scoreDraft}
                      onChange={(event) =>
                        setScoreDrafts({
                          ...scoreDrafts,
                          [user._id]: event.target.value
                        })
                      }
                    />
                  </td>
                  <td>
                    <div className="action-row">
                      <button className="button ghost" onClick={() => onSaveSubscription(user, draft)}>
                        Save sub
                      </button>
                      <button className="button ghost" onClick={() => onSaveScores(user, scoreDraft)}>
                        Save scores
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
