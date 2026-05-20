import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { api } from './api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title) => {
    try {
      setLoading(true);
      setError('');
      const newTask = await api.createTask(title);
      setTasks([newTask, ...tasks]);
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (id, completed) => {
    try {
      setError('');
      const updatedTask = await api.updateTask(id, { completed });
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setError('');
      await api.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
      throw err;
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      setError('');
      const updatedTask = await api.updateTask(id, updates);
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>My To-Do List</h1>
          <p>Stay organized and productive</p>
        </header>

        {error && <div className="error-banner">{error}</div>}

        <TaskForm onAddTask={handleAddTask} loading={loading} />

        {loading && !tasks.length ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

export default App;
