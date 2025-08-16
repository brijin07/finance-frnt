import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import { AuthContext } from '../context/AuthContext';
import BarChartComponent from '../components/BarChartComponent';
import YearlyIncomeExpenseChart from '../components/YearlyIncomeExpenseChart';



const tabIcons = {
  summary: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-3 0-5 2-5 5v3h10v-3c0-3-2-5-5-5z" />
    </svg>
  ),
  chart: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6m4 6v-10m4 10v-4" />
    </svg>
  ),
  yearly: (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <rect x="7" y="14" width="3" height="5" fill="#6366F1" />
    <rect x="14" y="12" width="3" height="7" fill="#4F46E5" />
  </svg>
),

  add: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  list: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  logout: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16v1a2 2 0 002 2h6a2 2 0 002-2v-1" />
    </svg>
  ),
};

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  // Fetch all transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
      setError('');
    } catch {
      setError('Failed to fetch transactions');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token]);

  // Add transaction
  const addTransaction = async (formData) => {
    try {
      await axios.post('http://localhost:5000/api/transactions', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
      setActiveTab('list');
    } catch {
      setError('Failed to add transaction');
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    if (!window.confirm('Are you sure to delete this transaction?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
    } catch {
      setError('Failed to delete transaction');
    }
  };

  // Filter transactions by selectedMonth
  const filteredTransactions = useMemo(() => {
    if (!selectedMonth) return transactions;
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const txYearMonth = `${txDate.getFullYear()}-${(txDate.getMonth() + 1).toString().padStart(2, '0')}`;
      return txYearMonth === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  // Calculate totals based on filtered transactions
  const totalIncome = filteredTransactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

  const totalExpense = filteredTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

  const totalDebtPay = filteredTransactions
    .filter(tx => tx.type === 'debt_pay')
    .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

  const totalDebtReceive = filteredTransactions
    .filter(tx => tx.type === 'debt_receive')
    .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

  const balance = totalIncome + totalDebtReceive - totalExpense - totalDebtPay;

  // Aggregate for existing BarChartComponent (top descriptions)
  const aggregatedByDescription = useMemo(() => {
    const map = {};
    filteredTransactions.forEach(({ type, amount, description }) => {
      if (!map[description]) {
        map[description] = { description, income: 0, expense: 0, debt_pay: 0, debt_receive: 0 };
      }
      if (type === 'income') map[description].income += parseFloat(amount);
      else if (type === 'expense') map[description].expense += parseFloat(amount);
      else if (type === 'debt_pay') map[description].debt_pay += parseFloat(amount);
      else if (type === 'debt_receive') map[description].debt_receive += parseFloat(amount);
    });
    return Object.values(map)
      .sort((a, b) => {
        const totalA = a.income + a.expense + a.debt_pay + a.debt_receive;
        const totalB = b.income + b.expense + b.debt_pay + b.debt_receive;
        return totalB - totalA;
      })
      .slice(0, 10);
  }, [filteredTransactions]);

  // Calculate yearly totals for income & expense for YearlyIncomeExpenseChart
  const yearlyIncomeExpense = useMemo(() => {
    const map = {};
    transactions.forEach(({ date, type, amount }) => {
      const year = new Date(date).getFullYear();
      if (!map[year]) map[year] = { year, income: 0, expense: 0 };
      if (type === 'income') map[year].income += parseFloat(amount);
      else if (type === 'expense') map[year].expense += parseFloat(amount);
    });
    return Object.values(map).sort((a, b) => a.year - b.year);
  }, [transactions]);

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'chart', label: 'Chart' },      // Existing chart
    { id: 'yearly', label: 'Yearly' },    // New yearly chart
    { id: 'add', label: 'Add' },
    { id: 'list', label: 'Transactions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4 sm:p-12 font-sans text-gray-800 pb-24 sm:pb-20">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700 select-none">
          Finance Dashboard
        </h1>
        <button
          onClick={logout}
          className="hidden sm:inline-block bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-3 rounded-xl shadow-lg hover:from-red-600 hover:to-red-800 transition duration-300 font-semibold w-full sm:w-auto"
          aria-label="Logout"
          type="button"
        >
          Logout
        </button>
      </header>

      {/* Error */}
      {error && (
        <p className="max-w-xl mx-auto mb-6 px-4 py-3 rounded-lg border border-red-400 bg-red-50 text-red-700 font-medium shadow-sm text-center">
          {error}
        </p>
      )}

      {/* Month Filter */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2 sm:gap-4 px-2 sm:px-0">
        <label
          htmlFor="monthPicker"
          className="font-semibold text-indigo-700"
        >
          Filter by Month:
        </label>
        <input
          type="month"
          id="monthPicker"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="border border-indigo-300 rounded px-3 py-2 text-indigo-800 text-sm sm:text-base w-full sm:w-auto"
          aria-label="Select month to filter transactions"
        />
      </div>

      {/* Tabs for desktop */}
      <nav className="hidden sm:flex max-w-6xl mx-auto justify-center sm:justify-start mb-8 space-x-6 border-b border-indigo-300" aria-label="Primary tabs">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative pb-3 text-lg font-semibold transition-colors duration-300 focus:outline-none ${
              activeTab === id
                ? 'text-indigo-700 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-1 after:rounded-full after:bg-indigo-600'
                : 'text-indigo-400 hover:text-indigo-600'
            }`}
            aria-current={activeTab === id ? 'page' : undefined}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <section
            className="grid grid-cols-1 sm:grid-cols-5 gap-6"
            aria-label="Summary statistics"
          >
            {[{
                title: 'Total Income',
                value: totalIncome.toFixed(2),
                bgGradient: 'from-green-400 to-green-600',
                textColor: 'text-green-100',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-3 0-5 2-5 5v3h10v-3c0-3-2-5-5-5z" />
                  </svg>
                ),
              },
              {
                title: 'Total Exp',
                value: totalExpense.toFixed(2),
                bgGradient: 'from-red-400 to-red-600',
                textColor: 'text-red-100',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-red-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m3 6H9a6 6 0 01-6-6v-3a6 6 0 016-6h3" />
                  </svg>
                ),
              },
              {
                title: 'Dpt Pay ',
                value: totalDebtPay.toFixed(2),
                bgGradient: 'from-yellow-400 to-yellow-600',
                textColor: 'text-yellow-100',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v5" />
                  </svg>
                ),
              },
              {
                title: 'Dpt Receive',
                value: totalDebtReceive.toFixed(2),
                bgGradient: 'from-blue-400 to-blue-600',
                textColor: 'text-blue-100',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m0 0l-4-4m4 4l4-4" />
                  </svg>
                ),
              },
              {
                title: 'Balance',
                value: balance.toFixed(2),
                bgGradient: 'from-purple-400 to-purple-600',
                textColor: 'text-purple-100',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                ),
              },
            ].map(({ title, value, bgGradient, textColor, icon }) => (
              <article
                key={title}
                className={`relative rounded-2xl bg-gradient-to-br ${bgGradient} shadow-lg
                  p-6 sm:p-8 flex flex-col items-center text-center text-white
                  backdrop-blur-md bg-opacity-30 hover:scale-105 transform transition-transform duration-300`}
                tabIndex={0}
                aria-label={`${title}: ₹${value}`}
              >
                <div className="mb-3">{icon}</div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-wide mb-1">{title}</h2>
                <p className={`text-3xl sm:text-4xl font-mono font-extrabold ${textColor}`}>
                  ₹{value}
                </p>
              </article>
            ))}
          </section>
        )}

        {/* Chart Tab: Existing chart with top descriptions */}
        {activeTab === 'chart' && (
          <section className="max-w-6xl mx-auto p-4 bg-white rounded-3xl shadow-xl">
            <BarChartComponent data={aggregatedByDescription} />
          </section>
        )}

      {activeTab === 'yearly' && (
  <section
    className="
      max-w-6xl mx-auto p-6
      bg-gradient-to-r from-indigo-50 via-white to-indigo-50
      rounded-3xl shadow-xl
      sm:p-8
      flex flex-col items-center
      "
    aria-label="Yearly income vs expense chart"
  >
    <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-indigo-800 text-center">
      Yearly Income vs Expense
    </h2>
    <p className="mb-6 text-center text-indigo-600 text-sm sm:text-base max-w-md px-4">
      Visualize your total income and expenses per year to track your financial trends.
    </p>

    <div className="w-full max-w-full sm:max-w-4xl" style={{ minHeight: 300 }}>
      <YearlyIncomeExpenseChart data={yearlyIncomeExpense} />
    </div>
  </section>
)}


        {/* Add Tab */}
        {activeTab === 'add' && (
          <section
            className="mb-8 p-4 sm:p-6 bg-white rounded-3xl shadow-xl
            backdrop-blur-sm bg-opacity-90 max-w-3xl mx-auto"
            aria-label="Add new transaction form"
          >
            <TransactionForm
              onSubmit={addTransaction}
              editingTransaction={null}
              onCancel={null}
            />
          </section>
        )}

        {/* List Tab */}
        {activeTab === 'list' && (
          <>
            {loading ? (
              <p className="text-center text-indigo-600 text-lg font-semibold my-12 sm:my-20">
                Loading transactions...
              </p>
            ) : (
              <section
                className="overflow-x-auto max-w-6xl mx-auto px-2 sm:px-0"
                aria-label="List of transactions"
              >
                <TransactionList
                  transactions={filteredTransactions}
                  onEdit={null}
                  onDelete={deleteTransaction}
                />
              </section>
            )}
          </>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-indigo-200
                   shadow-inner flex justify-around items-center sm:hidden h-16 z-50"
        role="navigation"
        aria-label="Mobile navigation tabs"
      >
        {[...tabs, { id: 'logout', label: 'Logout' }].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => {
              if (id === 'logout') logout();
              else setActiveTab(id);
            }}
            className={`flex flex-col items-center justify-center
              focus:outline-none focus:ring-0
              transition-colors duration-300 text-xs font-semibold
              ${
                id === 'logout'
                  ? 'text-red-600 hover:text-red-700'
                  : activeTab === id
                  ? 'text-indigo-700'
                  : 'text-indigo-400 hover:text-indigo-600'
              }`}
            aria-current={activeTab === id ? 'page' : undefined}
            type="button"
          >
            {tabIcons[id] && React.cloneElement(tabIcons[id], {
              className: `h-6 w-6 mb-0.5 ${
                id === 'logout' ? 'text-red-600' : ''
              }`
            })}
            <span className="leading-none mt-0.5">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Dashboard;
