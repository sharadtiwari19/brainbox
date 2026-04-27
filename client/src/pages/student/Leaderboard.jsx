import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const medals = ['🥇', '🥈', '🥉'];
const rowColors = ['from-amber-50 to-amber-100 border-amber-200', 'from-gray-50 to-gray-100 border-gray-200', 'from-orange-50 to-orange-100 border-orange-200'];

export default function Leaderboard() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/leaderboard'),
      api.get('/leaderboard/my-rank')
    ]).then(([lb, rank]) => {
      setData(lb.data);
      setMyRank(rank.data);
    }).finally(() => setLoading(false));
  }, []);

  const myEntry = data.find(d => d._id === user?._id);

  return (
    <div className="max-w-3xl mx-auto animate-slide-up space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-500 mt-1">Top learners ranked by points earned</p>
      </div>

      {/* My rank card */}
      {myRank && user?.role === 'student' && (
        <div className="bg-gradient-to-r from-brand-500 to-orange-400 rounded-2xl p-6 text-white">
          <p className="text-brand-100 text-sm font-medium mb-1">Your Standing</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-display font-bold">#{myRank.rank}</div>
              <div className="text-brand-100 text-sm mt-1">{user.name}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-bold">{myRank.points.toLocaleString()}</div>
              <div className="text-brand-100 text-sm mt-1">Total Points</div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Top 3 podium */}
          {data.length >= 3 && (
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 p-6">
              <div className="flex items-end justify-center gap-4">
                {[data[1], data[0], data[2]].map((entry, i) => {
                  const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
                  const heights = ['h-24', 'h-32', 'h-20'];
                  return (
                    <div key={entry._id} className={`flex-1 flex flex-col items-center ${heights[i]}`}>
                      <div className="text-2xl mb-1">{medals[actualRank - 1]}</div>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs mb-2">
                        {entry.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className={`w-full rounded-t-xl flex flex-col items-center justify-start pt-2 ${
                        actualRank === 1 ? 'bg-amber-400' : actualRank === 2 ? 'bg-gray-400' : 'bg-orange-400'
                      }`} style={{ height: heights[i] === 'h-32' ? '8rem' : heights[i] === 'h-24' ? '6rem' : '5rem' }}>
                        <span className="text-white font-display font-bold text-xs text-center px-1 line-clamp-1">{entry.name.split(' ')[0]}</span>
                        <span className="text-white/80 text-xs font-medium">{entry.points.toLocaleString()}pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full list */}
          <div>
            {data.map((entry, idx) => {
              const isMe = entry._id === user?._id;
              return (
                <div
                  key={entry._id}
                  className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 transition-colors ${isMe ? 'bg-brand-50' : 'hover:bg-gray-50'}`}
                >
                  <div className={`w-8 text-center font-display font-bold text-lg ${idx < 3 ? 'text-2xl' : 'text-gray-400 text-sm'}`}>
                    {idx < 3 ? medals[idx] : `${idx + 1}`}
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                    isMe ? 'bg-gradient-to-br from-brand-400 to-brand-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
                  }`}>
                    {entry.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isMe ? 'text-brand-700' : 'text-gray-900'}`}>
                      {entry.name} {isMe && <span className="text-xs font-normal">(You)</span>}
                    </p>
                    <p className="text-xs text-gray-400">{entry.coursesEnrolled} courses · {entry.modulesCompleted} modules</p>
                  </div>
                  <div className="text-right">
                    <div className={`font-display font-bold ${isMe ? 'text-brand-600' : 'text-gray-900'}`}>
                      {entry.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </div>
              );
            })}
            {data.length === 0 && (
              <div className="p-16 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <p className="text-gray-500">No entries yet. Complete quizzes to appear here!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
