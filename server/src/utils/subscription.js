function getRenewalDate(plan, startDate = new Date()) {
  const next = new Date(startDate);

  if (plan === "yearly") {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    next.setMonth(next.getMonth() + 1);
  }

  return next;
}

module.exports = { getRenewalDate };
