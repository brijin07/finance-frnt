import React, { useState, useEffect } from 'react';

const DebtForm = ({ onSubmit, editingDebt, onCancel }) => {
  const [form, setForm] = useState({
    friendName: '',
    amount: '',
    date: '',
    type: 'to_get', // default
    description: '',
  });

  useEffect(() => {
    if (editingDebt) {
      setForm({
        friendName: editingDebt.friendName,
        amount: editingDebt.amount,
        date: editingDebt.date.slice(0, 10),
        type: editingDebt.type,
        description: editingDebt.description || '',
      });
    }
  }, [editingDebt]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.friendName || !form.amount || !form.date) return;
    onSubmit(form);
    setForm({ friendName: '', amount: '', date: '', type: 'to_get', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow mb-6 bg-white">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          name="friendName"
          placeholder="Friend's Name"
          value={form.friendName}
          onChange={handleChange}
          className="flex-1 p-2 border rounded"
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-28 p-2 border rounded"
          required
          step="0.01"
          min="0"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-36 p-2 border rounded"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-32 p-2 border rounded"
        >
          <option value="to_get">Friend Owes Me</option>
          <option value="to_give">I Owe Friend</option>
        </select>
      </div>
      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange}
        className="w-full mt-4 p-2 border rounded resize-none"
        rows="2"
      />
      <div className="mt-4 flex gap-4">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {editingDebt ? 'Update' : 'Add'}
        </button>
        {editingDebt && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default DebtForm;
