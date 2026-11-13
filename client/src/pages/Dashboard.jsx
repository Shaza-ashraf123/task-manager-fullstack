import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleError = (err, fallback) => {
    if (err.response?.status === 401) {
      logout(); // التوكن انتهى أو غلط
      return;
    }
    setError(err.response?.data?.message || fallback);
  };

  useEffect(() => {
    api
      .get('/tasks')
      .then((res) => setTasks(res.data))
      .catch((err) => handleError(err, 'Failed to load tasks'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/tasks', { title, description });
      setTasks([data, ...tasks]);
      setTitle('');
      setDescription('');
    } catch (err) {
      handleError(err, 'Failed to add task');
    }
  };

  const toggleTask = async (task) => {
    try {
      const { data } = await api.put(`/tasks/${task.id}`, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? data : t)));
    } catch (err) {
      handleError(err, 'Failed to update task');
    }
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      const { data } = await api.put(`/tasks/${id}`, { title: editTitle });
      setTasks(tasks.map((t) => (t.id === id ? data : t)));
      setEditingId(null);
    } catch (err) {
      handleError(err, 'Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      handleError(err, 'Failed to delete task');
    }
  };

  return (
    <div className="card wide">
      <div className="header">
        <h2>Welcome, {user.name}</h2>
        <button className="secondary" onClick={logout}>
          Logout
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <h3>My Tasks</h3>
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet. Add your first one!</p>
      ) : (
        <ul className="tasks">
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? 'done' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />

              {editingId === task.id ? (
                <div className="edit">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <button onClick={() => saveEdit(task.id)}>Save</button>
                  <button className="secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="info">
                    <strong>{task.title}</strong>
                    {task.description && <small>{task.description}</small>}
                  </div>
                  <button
                    className="secondary"
                    onClick={() => {
                      setEditingId(task.id);
                      setEditTitle(task.title);
                    }}
                  >
                    Edit
                  </button>
                  <button className="danger" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}