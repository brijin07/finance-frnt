import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const TransactionList = ({ transactions, onDelete }) => {
  // Function to export transactions data to Excel
  const exportTransactionsToExcel = () => {
    // Map your transactions to a clean array of objects for Excel
    const data = transactions.map(tx => ({
      Date: new Date(tx.date).toLocaleDateString(),
      Description: tx.description,
      Type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      Amount: parseFloat(tx.amount).toFixed(2),
    }));

    // Create worksheet from JSON data
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    // Write the workbook as an array buffer
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the buffer
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Trigger file download
    saveAs(blob, 'transactions.xlsx');
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center p-4 bg-white border rounded shadow">
        No transactions found.
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <button
          onClick={exportTransactionsToExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Download Excel
        </button>
      </div>

      {/* Table view for sm and above */}
      <div className="hidden sm:block overflow-x-auto bg-white border rounded shadow">
        <table className="min-w-full w-full text-left text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 sm:px-4 py-2">Date</th>
              <th className="px-3 sm:px-4 py-2">Description</th>
              <th className="px-3 sm:px-4 py-2">Type</th>
              <th className="px-3 sm:px-4 py-2">Amount</th>
              <th className="px-3 sm:px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-t hover:bg-gray-50 focus-within:bg-gray-100"
                tabIndex={0}
              >
                <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="px-3 sm:px-4 py-2">{tx.description}</td>
                <td
                  className={`px-3 sm:px-4 py-2 font-semibold whitespace-nowrap ${
                    tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                </td>
                <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                  ₹{parseFloat(tx.amount).toFixed(2)}
                </td>
                <td className="px-3 sm:px-4 py-2 space-x-3 whitespace-nowrap">
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="sm:hidden space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            tabIndex={0}
            className="bg-white border rounded shadow p-4 focus-within:ring-2 focus-within:ring-indigo-500"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">
                {new Date(tx.date).toLocaleDateString()}
              </span>
              <button
                onClick={() => onDelete(tx.id)}
                className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
              >
                Delete
              </button>
            </div>
            <div className="mb-1 text-gray-800">{tx.description}</div>
            <div className="flex justify-between items-center">
              <span
                className={`font-semibold ${
                  tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
              </span>
              <span className="font-semibold">₹{parseFloat(tx.amount).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TransactionList;
