import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CATEGORIES = ['Mathematics', 'Science', 'Programming', 'Physics', 'Chemistry', 'Biology', 'History', 'English'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: 'Mathematics', level: 'Beginner', thumbnail: '', tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return setError('Title and description are required');
    setLoading(true);
    try {
      const { data } = await api.post('/courses', {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      navigate(`/teacher/course/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-500 mt-1">Fill in the details to create your course</p>
      </div>

      <div className="card p-8">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title *</label>
            <input
              type="text" required
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="input-field"
              placeholder="e.g. Complete Mathematics for Class 10"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              required rows={4}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="input-field resize-none"
              placeholder="Describe what students will learn in this course..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="input-field"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Level *</label>
              <select
                value={form.level}
                onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                className="input-field"
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Thumbnail URL</label>
            <input
              type="url"
              value={form.thumbnail}
              onChange={e => setForm(p => ({ ...p, thumbnail: e.target.value }))}
              className="input-field"
              placeholder="https://example.com/image.jpg (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
              className="input-field"
              placeholder="math, algebra, equations (comma-separated)"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/teacher')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-ocean flex-1 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</> : 'Create Course →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
