import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8001/api/tasks';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      setError('Unable to connect to task server. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!inputValue.trim()) {
      setError('Task description cannot be blank');
      return;
    }
    setError('');
    setAdding(true);
    try {
      const response = await axios.post(API_URL, { title: inputValue.trim() });
      setTasks(prev => [response.data, ...prev]);
      setInputValue('');
    } catch (err) {
      setError('Failed to save task. Try again.');
    } finally {
      setAdding(false);
    }
  };

  const getFilteredTasks = () => {
    if (filter === 'recent') {
      return [...tasks].sort((a, b) => b.id - a.id);
    } else if (filter === 'oldest') {
      return [...tasks].sort((a, b) => a.id - b.id);
    }
    return tasks;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          padding: 20px;
        }

        .app-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          overflow: hidden;
        }

        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }

        .header h1 {
          font-size: 36px;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .header p {
          font-size: 16px;
          opacity: 0.9;
        }

        .content {
          padding: 30px;
        }

        .input-section {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 15px;
          margin-bottom: 25px;
        }

        .input-row {
          display: flex;
          gap: 15px;
        }

        .task-input {
          flex: 1;
          padding: 15px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s;
        }

        .task-input:focus {
          border-color: #667eea;
          outline: none;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .add-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0 35px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .add-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .add-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          color: #e74c3c;
          font-size: 14px;
          margin-top: 10px;
          padding: 8px 12px;
          background: #fde8e7;
          border-radius: 8px;
          display: inline-block;
        }

        .stats-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding: 15px 0;
          border-bottom: 2px solid #f0f0f0;
        }

        .task-count {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 30px;
          font-weight: 600;
        }

        .filter-buttons {
          display: flex;
          gap: 10px;
        }

        .filter-btn {
          padding: 8px 18px;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          background: white;
          color: #666;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .filter-btn:hover {
          border-color: #667eea;
        }

        .tasks-container {
          min-height: 200px;
        }

        .task-item {
          background: white;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          padding: 18px 22px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.2s;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .task-item:hover {
          border-color: #667eea;
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
        }

        .task-number {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .task-content {
          flex: 1;
        }

        .task-title {
          font-size: 18px;
          color: #333;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .task-id {
          font-size: 12px;
          color: #999;
        }

        .task-status {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #f0f0f0;
          transition: all 0.2s;
        }

        .task-item:hover .task-status {
          background: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #f8f9fa;
          border-radius: 15px;
        }

        .empty-emoji {
          font-size: 60px;
          margin-bottom: 20px;
        }

        .empty-text {
          color: #999;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .empty-subtext {
          color: #ccc;
          font-size: 14px;
        }

        .loading {
          text-align: center;
          padding: 50px;
          color: #999;
          font-size: 16px;
        }

        .footer {
          background: #f8f9fa;
          padding: 25px 30px;
          border-top: 2px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .student-info h3 {
          color: #333;
          font-size: 18px;
          margin-bottom: 5px;
        }

        .student-info p {
          color: #999;
          font-size: 14px;
        }

        .course-info {
          text-align: right;
        }

        .course-info h4 {
          color: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-size: 16px;
          margin-bottom: 5px;
        }

        .course-info p {
          color: #999;
          font-size: 13px;
        }
      `}</style>

      <div className="app-container">
        <div className="header">
          <h1>JUDE'S TASK MANAGER</h1>
          <p>CCS112 - Application Development & Emerging Technologies</p>
        </div>

        <div className="content">
          <div className="input-section">
            <div className="input-row">
              <input
                className="task-input"
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                placeholder="Enter new task..."
                disabled={adding}
              />
              <button className="add-btn" onClick={handleAddTask} disabled={adding}>
                {adding ? 'ADDING...' : 'ADD TASK'}
              </button>
            </div>
            {error && <div className="error-message">⚠ {error}</div>}
          </div>

          <div className="stats-bar">
            <span className="task-count">{tasks.length} TOTAL TASKS</span>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >ALL</button>
              <button 
                className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
                onClick={() => setFilter('recent')}
              >RECENT</button>
              <button 
                className={`filter-btn ${filter === 'oldest' ? 'active' : ''}`}
                onClick={() => setFilter('oldest')}
              >OLDEST</button>
            </div>
          </div>

          <div className="tasks-container">
            {loading ? (
              <div className="loading">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-emoji">📋</div>
                <div className="empty-text">No tasks yet</div>
                <div className="empty-subtext">Add your first task using the form above</div>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="task-item"
                  onMouseEnter={() => setHoveredId(task.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="task-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    <div className="task-id">ID: {task.id}</div>
                  </div>
                  <div className="task-status" />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="footer">
          <div className="student-info">
            <h3>JUDE C. MARCO</h3>
            <p>3IT-A • Student</p>
          </div>
          <div className="course-info">
            <h4>UNIVERSITY OF CABUYAO</h4>
            <p>Prof. Joseph D. Cartagenas</p>
          </div>
        </div>
      </div>
    </>
  );
}