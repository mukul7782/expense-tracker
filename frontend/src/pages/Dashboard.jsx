import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: '' });

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

  const handleDelete = async (id) => {
    await API.delete('/expenses/' + id);
    fetchExpenses();
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <form onSubmit={handleAdd}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <button type="submit">Add expense</button>
      </form>

      <ul>
        {expenses.map((exp) => (
          <li key={exp._id}>
            {exp.title} - Rs.{exp.amount} ({exp.category})
            <button onClick={() => handleDelete(exp._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}