import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function ModuleForm({ courseId, onAdded, onClose }) {
  const [form, setForm] = useState({ title: '', description: '', videoUrl: '', duration: '', isPreview: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(`/courses/${courseId}/modules`, form);
      onAdded(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add module');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-ocean-50 border border-ocean-200 rounded-2xl p-5 mb-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-bold text-ocean-800">Add New Module</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          className="input-field text-sm" placeholder="Module title *" />
        <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          className="input-field text-sm resize-none" placeholder="Short description (optional)" />
        <input type="text" required value={form.videoUrl} onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))}
          className="input-field text-sm" placeholder="YouTube URL or video URL *" />
        <div className="flex gap-3">
          <input type="text" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
            className="input-field text-sm flex-1" placeholder="Duration e.g. 12:30" />
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer bg-white px-3 rounded-xl border border-gray-200">
            <input type="checkbox" checked={form.isPreview} onChange={e => setForm(p => ({ ...p, isPreview: e.target.checked }))} />
            Free preview
          </label>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="btn-secondary text-sm py-2 px-4">Cancel</button>
          <button type="submit" disabled={loading} className="btn-ocean text-sm py-2 px-4 flex-1">
            {loading ? 'Adding...' : 'Add Module'}
          </button>
        </div>
      </form>
    </div>
  );
}

function QuizForm({ courseId, moduleId, existingQuiz, onSaved, onClose }) {
  const [form, setForm] = useState(existingQuiz ? {
    title: existingQuiz.title,
    questions: existingQuiz.questions,
    passThreshold: existingQuiz.passThreshold,
    pointsReward: existingQuiz.pointsReward,
    timeLimit: existingQuiz.timeLimit
  } : {
    title: '', questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }],
    passThreshold: 60, pointsReward: 50, timeLimit: 30
  });
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setForm(p => ({ ...p, questions: [...p.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }] }));
  };

  const removeQuestion = (i) => {
    if (form.questions.length === 1) return;
    setForm(p => ({ ...p, questions: p.questions.filter((_, idx) => idx !== i) }));
  };

  const updateQuestion = (i, field, value) => {
    setForm(p => {
      const q = [...p.questions];
      q[i] = { ...q[i], [field]: value };
      return { ...p, questions: q };
    });
  };

  const updateOption = (qi, oi, value) => {
    setForm(p => {
      const q = [...p.questions];
      const opts = [...q[qi].options];
      opts[oi] = value;
      q[qi] = { ...q[qi], options: opts };
      return { ...p, questions: q };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allFilled = form.questions.every(q => q.question && q.options.every(o => o.trim()));
    if (!allFilled) return alert('Please fill all question fields');
    setLoading(true);
    try {
      let data;
      if (existingQuiz) {
        ({ data } = await api.put(`/quiz/${existingQuiz._id}`, form));
      } else {
        ({ data } = await api.post('/quiz', { ...form, courseId, moduleId }));
      }
      onSaved(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save quiz');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-bold text-amber-800">{existingQuiz ? 'Edit Quiz' : 'Create Quiz'}</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          className="input-field text-sm" placeholder="Quiz title *" />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Pass % (default 60)</label>
            <input type="number" min={1} max={100} value={form.passThreshold} onChange={e => setForm(p => ({ ...p, passThreshold: +e.target.value }))}
              className="input-field text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Points Reward</label>
            <input type="number" min={1} value={form.pointsReward} onChange={e => setForm(p => ({ ...p, pointsReward: +e.target.value }))}
              className="input-field text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Time (mins)</label>
            <input type="number" min={1} value={form.timeLimit} onChange={e => setForm(p => ({ ...p, timeLimit: +e.target.value }))}
              className="input-field text-sm" />
          </div>
        </div>

        <div className="space-y-4">
          {form.questions.map((q, qi) => (
            <div key={qi} className="bg-white rounded-xl p-4 border border-amber-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-700 uppercase">Q{qi + 1}</span>
                <button type="button" onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
              </div>
              <input type="text" required value={q.question} onChange={e => updateQuestion(qi, 'question', e.target.value)}
                className="input-field text-sm mb-3" placeholder="Question text *" />
              <div className="space-y-2 mb-3">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input type="radio" name={`correct_${qi}`} checked={q.correctAnswer === oi}
                      onChange={() => updateQuestion(qi, 'correctAnswer', oi)}
                      className="accent-amber-500 w-4 h-4 flex-shrink-0" />
                    <input type="text" required value={opt} onChange={e => updateOption(qi, oi, e.target.value)}
                      className="input-field text-sm flex-1 py-2"
                      placeholder={`Option ${String.fromCharCode(65 + oi)} ${oi === q.correctAnswer ? '(correct)' : ''}`} />
                  </div>
                ))}
              </div>
              <input type="text" value={q.explanation} onChange={e => updateQuestion(qi, 'explanation', e.target.value)}
                className="input-field text-sm" placeholder="Explanation (optional)" />
            </div>
          ))}
        </div>

        <button type="button" onClick={addQuestion} className="w-full border-2 border-dashed border-amber-300 text-amber-600 font-semibold text-sm py-3 rounded-xl hover:bg-amber-50 transition-colors">
          + Add Question
        </button>

        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="btn-secondary text-sm py-2 px-4">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm py-2 px-4 rounded-xl transition-colors">
            {loading ? 'Saving...' : existingQuiz ? 'Update Quiz' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ManageCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModule, setShowAddModule] = useState(false);
  const [quizForms, setQuizForms] = useState({});
  const [quizzes, setQuizzes] = useState({});
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
    } catch { navigate('/teacher'); }
    finally { setLoading(false); }
  };

  const fetchQuizzes = async () => {
    setLoadingQuizzes(true);
    try {
      const { data } = await api.get(`/quiz/course/${id}`);
      const map = {};
      data.forEach(q => { map[q.module] = q; });
      setQuizzes(map);
    } finally { setLoadingQuizzes(false); }
  };

  useEffect(() => { fetchCourse(); fetchQuizzes(); }, [id]);

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Delete this module?')) return;
    try {
      await api.delete(`/courses/${id}/modules/${moduleId}`);
      await fetchCourse();
    } catch { alert('Delete failed'); }
  };

  const handleDeleteQuiz = async (quizId, moduleId) => {
    if (!confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/quiz/${quizId}`);
      setQuizzes(p => { const n = { ...p }; delete n[moduleId]; return n; });
    } catch { alert('Delete failed'); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-ocean-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!course) return null;

  return (
    <div className="max-w-3xl mx-auto animate-slide-up space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button onClick={() => navigate('/teacher')} className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1">
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-display font-bold text-gray-900">{course.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="badge bg-gray-100 text-gray-600">{course.category}</span>
            <span className="badge bg-gray-100 text-gray-600">{course.level}</span>
            <span className={`badge ${course.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
              {course.isPublished ? '● Published' : '○ Draft'}
            </span>
          </div>
        </div>
        <button
          onClick={async () => {
            const { data } = await api.post(`/courses/${id}/publish`);
            setCourse(p => ({ ...p, isPublished: data.isPublished }));
          }}
          className={course.isPublished ? 'btn-secondary text-sm' : 'btn-ocean text-sm'}
        >
          {course.isPublished ? 'Unpublish' : 'Publish Course'}
        </button>
      </div>

      {/* Course info */}
      <div className="card p-5">
        <p className="text-sm text-gray-600">{course.description}</p>
        <div className="flex gap-4 mt-3 text-xs text-gray-400">
          <span>🎓 {course.enrolledStudents?.length || 0} students</span>
          <span>📹 {course.modules?.length || 0} modules</span>
        </div>
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-gray-900">
            Modules <span className="text-gray-400 font-normal text-base">({course.modules?.length || 0})</span>
          </h2>
          <button onClick={() => setShowAddModule(true)} className="btn-ocean text-sm px-4 py-2">
            + Add Module
          </button>
        </div>

        {showAddModule && (
          <ModuleForm
            courseId={id}
            onAdded={(updated) => { setCourse(updated); setShowAddModule(false); fetchQuizzes(); }}
            onClose={() => setShowAddModule(false)}
          />
        )}

        {course.modules?.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-4xl mb-3">🎥</div>
            <p className="text-gray-500 text-sm">No modules yet. Add your first video lesson above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {course.modules.map((mod, idx) => (
              <div key={mod._id} className="card overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-ocean-100 text-ocean-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-gray-900 text-sm">{mod.title}</h3>
                        {mod.isPreview && <span className="badge bg-ocean-100 text-ocean-600 text-xs">Free Preview</span>}
                        {quizzes[mod._id] && <span className="badge bg-amber-100 text-amber-700 text-xs">📝 Has Quiz</span>}
                      </div>
                      {mod.description && <p className="text-xs text-gray-500 mt-1">{mod.description}</p>}
                      <p className="text-xs text-gray-400 mt-1 truncate">🔗 {mod.videoUrl}</p>
                      {mod.duration && <p className="text-xs text-gray-400">⏱ {mod.duration}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setQuizForms(p => ({ ...p, [mod._id]: !p[mod._id] }))}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all"
                      >
                        {quizzes[mod._id] ? 'Edit Quiz' : '+ Quiz'}
                      </button>
                      <button
                        onClick={() => handleDeleteModule(mod._id)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quiz form for this module */}
                {quizForms[mod._id] && (
                  <div className="border-t border-gray-100 p-5">
                    <QuizForm
                      courseId={id}
                      moduleId={mod._id}
                      existingQuiz={quizzes[mod._id]}
                      onSaved={(quiz) => {
                        setQuizzes(p => ({ ...p, [mod._id]: quiz }));
                        setQuizForms(p => ({ ...p, [mod._id]: false }));
                      }}
                      onClose={() => setQuizForms(p => ({ ...p, [mod._id]: false }))}
                    />
                  </div>
                )}

                {/* Existing quiz summary */}
                {quizzes[mod._id] && !quizForms[mod._id] && (
                  <div className="border-t border-gray-100 px-5 py-3 bg-amber-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-amber-700">
                        <span>📝 {quizzes[mod._id].title}</span>
                        <span>·</span>
                        <span>{quizzes[mod._id].questions?.length} questions</span>
                        <span>·</span>
                        <span>Pass: {quizzes[mod._id].passThreshold}%</span>
                        <span>·</span>
                        <span>⭐ {quizzes[mod._id].pointsReward} pts</span>
                      </div>
                      <button
                        onClick={() => handleDeleteQuiz(quizzes[mod._id]._id, mod._id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >Delete quiz</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
