import React, { useState, useEffect } from 'react';

const TransactionForm = ({ onSubmit, editingTransaction, onCancel }) => {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: '',
    type: 'expense',
  });

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        description: editingTransaction.description,
        amount: editingTransaction.amount,
        date: editingTransaction.date.slice(0, 10), // format date for input[type=date]
        type: editingTransaction.type,
      });
    }
  }, [editingTransaction]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;
    onSubmit(form);
    setForm({ description: '', amount: '', date: '', type: 'expense' });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow mb-6 bg-white max-w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full sm:flex-1 p-2 border rounded"
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full sm:w-28 p-2 border rounded"
          required
          step="0.01"
          min="0"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full sm:w-36 p-2 border rounded"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full sm:w-48 p-2 border rounded"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="debt_pay">Debt Pay (You Owe)</option>
          <option value="debt_receive">Debt Receive (You Get)</option>
        </select>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editingTransaction ? 'Update' : 'Add'}
        </button>
        {editingTransaction && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;
