import React, { useState } from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onToggle, onDelete, onUpdate, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [error, setError] = useState('');

  const handleToggle = async () => {
    try {
      await onToggle(task.id, !task.completed);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.id);
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      setError('Task title cannot be empty');
      return;
    }

    try {
      setError('');
      await onUpdate(task.id, { title: editTitle });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
    setError('');
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={handleToggle}
          disabled={loading}
        />
        {isEditing ? (
          <input
            type="text"
            className="edit-input"
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              setError('');
            }}
            autoFocus
          />
        ) : (
          <span className="task-title">{task.title}</span>
        )}
      </div>

      <div className="task-actions">
        {isEditing ? (
          <>
            <button
              className="save-button"
              onClick={handleSaveEdit}
              disabled={loading}
            >
              Save
            </button>
            <button
              className="cancel-button"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </button>
          </>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default TaskItem;
