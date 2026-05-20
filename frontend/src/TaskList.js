import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks, onToggle, onDelete, onUpdate, loading }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Add one to get started!</p>
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="task-list-container">
      <div className="task-stats">
        <p>
          {completedCount} of {tasks.length} completed
        </p>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
