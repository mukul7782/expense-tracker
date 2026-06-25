import { useState, useEffect } from 'react';
import API from '../api/axios';


export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: '' });
  const [editingId, setEditingId] = useState(null);

 const fetchExpenses = async () => {
    const { data } = await API.get('/expenses');
    setExpenses(data);
  };
   useEffect(() => { fetchExpenses(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await API.post('/expenses', form);
    setForm({ title: '', amount: '', category: '' });
    fetchExpenses();
  };
  
  const handleEdit = (exp) => {
  setEditingId(exp._id);
  setForm({ title: exp.title, amount: exp.amount, category: exp.category });
};
  const handleSave = async (e) => {
  e.preventDefault();
  if (editingId) {
    await API.put('/expenses/' + editingId, form);
    setEditingId(null);
  } else {
    await API.post('/expenses', form);
  }
  setForm({ title: '', amount: '', category: '' });
  fetchExpenses();
};
 
const handleDelete = async (id) => {
    await API.delete('/expenses/' + id);
    fetchExpenses();
};
const [filter, setFilter] = useState('all');

const visible = filter === 'all'
  ? expenses
  : expenses.filter((e) => e.category === filter);

// in JSX, above the list:
// <select onChange={(e) => setFilter(e.target.value)}>
//   <option value="all">All categories</option>
//   <option value="food">Food</option>
//   <option value="travel">Travel</option>
// </select>
const total = expenses.reduce(
  (sum, exp) => sum + Number(exp.amount || 0),
  0
);

const thisMonthTotal = expenses
  .filter((exp) => {
    const expenseDate = new Date(exp.createdAt);
    const today = new Date();

    return (
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getFullYear() === today.getFullYear()
    );
  })
  .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);


return (
  <div className="container">
    <h2>Expense dashboard</h2>

    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-label">Total spent</div>
        <div className="summary-value">₹{total}</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Transactions</div>
        <div className="summary-value">{expenses.length}</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">This month</div>
        <div className="summary-value">₹{thisMonthTotal}</div>
      </div>
    </div>

    <form onSubmit={handleAdd} className="expense-form card">
      <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
      <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <button type="submit" className="btn-primary">Add</button>
    </form>

    <ul className="expense-list">
      {expenses.map((exp) => (
        <li key={exp._id} className="expense-item">
          <div className="expense-info">
            <span className="expense-title">{exp.title}</span>
            <span className="category-tag">{exp.category}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="expense-amount">₹{exp.amount}</span>
            <button className="btn-danger" onClick={() => handleDelete(exp._id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
};