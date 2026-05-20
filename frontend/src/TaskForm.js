import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onAddTask, loading }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a task');
      return;
    }

    try {
      setError('');
      await onAddTask(title);
      setTitle('');
    } catch (err) {
      setError(err.message || 'Failed to add task');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="task-input"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          disabled={loading}
        />
        <button
          type="submit"
          className="add-button"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default TaskForm;
