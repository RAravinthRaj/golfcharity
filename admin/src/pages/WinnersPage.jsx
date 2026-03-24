export default function WinnersPage({ winners, onUpdateStatus }) {
  return (
    <section className="panel">
      <p className="eyebrow">Verification flow</p>
      <h2>Winner proofs and payout statuses</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Winner</th>
              <th>Match</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner) => (
              <tr key={winner._id}>
                <td>{winner.monthKey}</td>
                <td>{winner.user?.name || "Unknown"}</td>
                <td>{winner.matchCount}</td>
                <td>${winner.amount}</td>
                <td>{winner.proofStatus}</td>
                <td>
                  <div className="action-row">
                    <button
                      className="button ghost"
                      onClick={() => onUpdateStatus(winner, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="button ghost"
                      onClick={() => onUpdateStatus(winner, "paid")}
                    >
                      Mark paid
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
