import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        deadline: editingTask.deadline,
      });
    } else {
      setFormData({ title: '', description: '', deadline: '' });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const response = await axiosInstance.put(`/api/tasks/${editingTask._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(tasks.map((task) => (task._id === response.data._id ? response.data : task)));
      } else {
        const response = await axiosInstance.post('/api/tasks', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks([...tasks, response.data]);
      }
      setEditingTask(null);
      setFormData({ title: '', description: '', deadline: '' });
    } catch (error) {
      alert('Failed to save task.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingTask ? 'Book Your Hotels' : 'Book Your Hotels'}</h1>
      <input
        type="text"
        placeholder="Room Type"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <label htmlFor="checkInDate" className="block mb-1 font-medium">
  Check-In Date
</label>
<input
  id="checkInDate"
  type="date"
  value={formData.checkInDate ? new Date(formData.checkInDate).toISOString().split('T')[0] : ''}
  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
  className="w-full mb-4 p-2 border rounded"
/>
      <label htmlFor="checkOutDate" className="block mb-1 font-medium">
  Check-Out Date
</label>
<input
  id="checkOutDate"
  type="date"
  value={formData.checkOutDate ? new Date(formData.checkInDate).toISOString().split('T')[0] : ''}
  onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
  className="w-full mb-4 p-2 border rounded"
/>


      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingTask ? 'Update Button' : 'Search'}
      </button>
    </form>
  );
};

export default TaskForm;
