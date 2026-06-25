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