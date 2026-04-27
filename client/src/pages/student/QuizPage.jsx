import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    api.get(`/quiz/${id}`)
      .then(res => {
        setQuiz(res.data);
        setTimeLeft(res.data.timeLimit * 60);
      })
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, submitted]);

  const handleSubmit = async () => {
    if (submitting) return;
    clearTimeout(timerRef.current);
    const answersArray = quiz.questions.map((_, i) => answers[i] ?? -1);
    setSubmitting(true);
    try {
      const { data } = await api.post(`/quiz/${id}/submit`, { answers: answersArray });
      setResult(data);
      setSubmitted(true);
      await refreshUser();
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerUrgent = timeLeft < 60;

  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto animate-slide-up">
        {/* Result card */}
        <div className={`card p-8 text-center mb-6 ${result.passed ? 'border-2 border-emerald-200' : 'border-2 border-red-200'}`}>
          <div className="text-6xl mb-4">{result.passed ? '🎉' : '😓'}</div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
            {result.passed ? 'Congratulations!' : 'Better Luck Next Time'}
          </h2>
          <p className="text-gray-500 mb-6">
            {result.passed ? 'You passed the quiz and unlocked the next module!' : 'You need 60% to pass. Review and try again!'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="text-3xl font-display font-bold text-gray-900">{result.score}%</div>
              <div className="text-xs text-gray-500 mt-1">Score</div>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4">
              <div className="text-3xl font-display font-bold text-emerald-600">{result.correct}</div>
              <div className="text-xs text-gray-500 mt-1">Correct</div>
            </div>
            <div className="bg-red-50 rounded-2xl p-4">
              <div className="text-3xl font-display font-bold text-red-500">{result.total - result.correct}</div>
              <div className="text-xs text-gray-500 mt-1">Wrong</div>
            </div>
          </div>

          {result.pointsEarned > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <p className="font-bold text-amber-700">+{result.pointsEarned} points earned! ⭐</p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(-1)} className="btn-secondary">← Back to Course</button>
            {!result.passed && (
              <button onClick={() => { setSubmitted(false); setResult(null); setAnswers({}); setTimeLeft(quiz.timeLimit * 60); }} className="btn-primary">Retry Quiz</button>
            )}
          </div>
        </div>

        {/* Detailed results */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-gray-900 text-lg">Review Answers</h3>
          {result.results.map((r, i) => (
            <div key={i} className={`card p-5 border-l-4 ${r.isCorrect ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${r.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {r.isCorrect ? '✓' : '✗'}
                </span>
                <p className="font-semibold text-gray-800 text-sm">{r.question}</p>
              </div>
              <div className="ml-9 space-y-1">
                {r.options.map((opt, j) => (
                  <div key={j} className={`text-sm px-3 py-2 rounded-lg ${
                    j === r.correctAnswer ? 'bg-emerald-50 text-emerald-700 font-medium' :
                    j === r.yourAnswer && !r.isCorrect ? 'bg-red-50 text-red-600 line-through' : 'text-gray-500'
                  }`}>
                    {j === r.correctAnswer && '✓ '}{opt}
                  </div>
                ))}
                {r.explanation && (
                  <p className="text-xs text-gray-400 italic mt-2">💡 {r.explanation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Quiz header */}
      <div className="card p-5 mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-lg text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-500">{quiz.questions.length} questions · {quiz.passThreshold}% to pass</p>
        </div>
        <div className={`text-center px-4 py-2 rounded-xl ${timerUrgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className={`text-2xl font-display font-bold ${timerUrgent ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-400">remaining</div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{answeredCount} of {quiz.questions.length} answered</span>
          <span>{Math.round((answeredCount / quiz.questions.length) * 100)}%</span>
        </div>
        <div className="bg-gray-100 rounded-full h-2">
          <div className="progress-bar h-2" style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions.map((q, i) => (
          <div key={i} className="card p-6 animate-fade-in">
            <div className="flex items-start gap-3 mb-4">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                answers[i] !== undefined ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>{i + 1}</span>
              <p className="font-semibold text-gray-900 text-sm leading-relaxed">{q.question}</p>
            </div>
            <div className="ml-11 space-y-2">
              {q.options.map((opt, j) => (
                <button
                  key={j}
                  onClick={() => setAnswers(prev => ({ ...prev, [i]: j }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-200 ${
                    answers[i] === j
                      ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 text-xs font-bold ${
                    answers[i] === j ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>{String.fromCharCode(65 + j)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="mt-8 flex gap-3 items-center">
        <button onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={submitting || answeredCount < quiz.questions.length}
          className="btn-primary flex-1 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : answeredCount < quiz.questions.length ? `Answer all questions (${quiz.questions.length - answeredCount} left)` : 'Submit Quiz →'}
        </button>
      </div>
    </div>
  );
}
