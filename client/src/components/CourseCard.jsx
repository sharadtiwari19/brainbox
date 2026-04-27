import { Link } from 'react-router-dom';

const levelColors = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
};

const categoryColors = {
  Mathematics: 'from-blue-500 to-blue-700',
  Science: 'from-emerald-500 to-emerald-700',
  Programming: 'from-violet-500 to-violet-700',
  Physics: 'from-indigo-500 to-indigo-700',
  Chemistry: 'from-orange-500 to-orange-700',
  Biology: 'from-green-500 to-green-700',
  History: 'from-amber-500 to-amber-700',
  English: 'from-pink-500 to-pink-700',
};

export default function CourseCard({ course, enrolled = false }) {
  const gradient = categoryColors[course.category] || 'from-brand-500 to-brand-700';

  return (
    <Link to={`/course/${course._id}`} className="card card-hover flex flex-col group">
      {/* Thumbnail */}
      <div className={`h-40 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-20 font-display font-bold text-white">
              {course.category?.[0] || 'L'}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`badge bg-white/20 text-white backdrop-blur-sm border border-white/30`}>
            {course.category}
          </span>
        </div>
        {enrolled && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-emerald-500 text-white">✓ Enrolled</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge ${levelColors[course.level] || 'bg-gray-100 text-gray-600'}`}>
            {course.level}
          </span>
        </div>
        <h3 className="font-display font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{course.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center text-white text-xs font-bold">
              {course.teacher?.name?.[0]?.toUpperCase() || 'T'}
            </div>
            <span className="text-xs text-gray-500 font-medium">{course.teacher?.name || 'Instructor'}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>📹</span>
            <span>{course.modules?.length || 0} modules</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
