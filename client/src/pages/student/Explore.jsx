import { useState, useEffect } from 'react';
import api from '../../services/api';
import CourseCard from '../../components/CourseCard';

const CATEGORIES = ['All', 'Mathematics', 'Science', 'Programming', 'Physics', 'Chemistry', 'Biology', 'History', 'English'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Explore() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');

  useEffect(() => {
    api.get('/courses').then(res => {
      setCourses(res.data);
      setFiltered(res.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = courses;
    if (search) result = result.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== 'All') result = result.filter(c => c.category === category);
    if (level !== 'All') result = result.filter(c => c.level === level);
    setFiltered(result);
  }, [search, category, level, courses]);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Explore Courses</h1>
        <p className="text-gray-500 mt-1">Discover and enroll in courses that match your goals</p>
      </div>

      {/* Search & Filters */}
      <div className="card p-5 space-y-4">
        <input
          type="text"
          placeholder="🔍  Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-500 self-center mr-2">Category:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                category === cat ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >{cat}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-500 self-center mr-2">Level:</span>
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                level === l ? 'bg-ocean-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >{l}</button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-gray-500 mb-4">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''}
        </p>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">😕</div>
            <p className="font-display font-semibold text-gray-700 text-lg">No courses found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        )}
      </div>
    </div>
  );
}
