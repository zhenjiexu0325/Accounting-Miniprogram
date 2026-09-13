// Shared expense/income category config
const CATEGORIES = {
  expense: [
    { key: 'food', label: 'Food', icon: '🍚' },
    { key: 'transport', label: 'Transport', icon: '🚗' },
    { key: 'shopping', label: 'Shopping', icon: '🛍' },
    { key: 'entertainment', label: 'Entertainment', icon: '🎮' },
    { key: 'housing', label: 'Housing', icon: '🏠' },
    { key: 'other', label: 'Other', icon: '📌' }
  ],
  income: [
    { key: 'salary', label: 'Salary', icon: '💰' },
    { key: 'bonus', label: 'Bonus', icon: '🎁' },
    { key: 'invest', label: 'Investment', icon: '📈' },
    { key: 'other', label: 'Other', icon: '📌' }
  ]
};

// Format date as YYYY-MM-DD
function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Simple unique id (timestamp + random); enough for local use
function genId() {
  return `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

// Look up category config by key
function getCategoryInfo(type, key) {
  const list = CATEGORIES[type] || [];
  return list.find(item => item.key === key) || { key, label: key, icon: '📌' };
}

// Monthly income/expense summary; month like '2024-05'
function calcMonthSummary(records, month) {
  let income = 0;
  let expense = 0;
  records.forEach(r => {
    if (r.date && r.date.startsWith(month)) {
      if (r.type === 'income') income += r.amount;
      else expense += r.amount;
    }
  });
  return {
    income: Math.round(income * 100) / 100,
    expense: Math.round(expense * 100) / 100,
    balance: Math.round((income - expense) * 100) / 100
  };
}

// Category breakdown for a month (for pie chart); returns [{key,label,value}]
function calcCategoryBreakdown(records, month, type = 'expense') {
  const map = {};
  records.forEach(r => {
    if (r.type === type && r.date && r.date.startsWith(month)) {
      map[r.category] = (map[r.category] || 0) + r.amount;
    }
  });
  return Object.keys(map).map(key => {
    const info = getCategoryInfo(type, key);
    return { key, label: info.label, icon: info.icon, value: Math.round(map[key] * 100) / 100 };
  }).sort((a, b) => b.value - a.value);
}

module.exports = {
  CATEGORIES,
  formatDate,
  genId,
  getCategoryInfo,
  calcMonthSummary,
  calcCategoryBreakdown
};
