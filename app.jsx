const { useState, useEffect, useMemo, useCallback } = React;

// ── Utility helpers ──

function generateId() {
  return 'run-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}

function daysUntilRace() {
  const now = new Date();
  const race = new Date(RACE_DATE + 'T00:00:00');
  const diff = Math.ceil((race - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function paceToSeconds(pace) {
  if (!pace) return null;
  const match = pace.match(/(\d+):(\d+)/);
  if (!match) return null;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}

function secondsToPace(s) {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return m + ':' + String(sec).padStart(2, '0') + '/mi';
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const RUN_TYPE_COLORS = {
  easy: '#4caf50',
  tempo: '#ff9800',
  interval: '#f44336',
  long: '#2196f3',
};

const RUN_TYPE_LABELS = {
  easy: 'Easy',
  tempo: 'Tempo',
  interval: 'Interval',
  long: 'Long',
};

// ── Tab Navigation ──

function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'plan', label: 'Plan', icon: '📋' },
    { id: 'log', label: 'Log Run', icon: '🏃' },
    { id: 'history', label: 'History', icon: '📜' },
  ];
  return (
    <nav className="tab-bar">
      {tabs.map(t => (
        <button
          key={t.id}
          className={'tab-btn' + (active === t.id ? ' active' : '')}
          onClick={() => onChange(t.id)}
        >
          <span className="tab-icon">{t.icon}</span>
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ── Dashboard ──

function Dashboard({ runs, planState }) {
  const days = daysUntilRace();
  const totalMiles = runs.reduce((s, r) => s + (r.distance || 0), 0);
  const totalPlanMiles = TRAINING_PLAN.reduce((s, p) => s + p.targetDistance, 0);
  const completedPlanRuns = Object.keys(planState).length;
  const totalPlanRuns = TRAINING_PLAN.length;
  const progressPct = Math.round((completedPlanRuns / totalPlanRuns) * 100);

  // Pace trend: last 5 runs with valid pace
  const pacedRuns = runs
    .filter(r => paceToSeconds(r.pace) !== null)
    .sort((a, b) => a.date.localeCompare(b.date));
  const recentPaces = pacedRuns.slice(-5);

  // Average pace
  const avgPace = pacedRuns.length > 0
    ? secondsToPace(pacedRuns.reduce((s, r) => s + paceToSeconds(r.pace), 0) / pacedRuns.length)
    : '--';

  // Current week
  const today = new Date().toISOString().split('T')[0];
  const currentWeek = TRAINING_PLAN.find(p => p.targetDate >= today)?.week || 8;

  return (
    <div className="dashboard">
      <div className="hero-card">
        <div className="hero-title">Broad Street Run 10-Miler</div>
        <div className="hero-date">May 3, 2026 &middot; Philadelphia</div>
        <div className="hero-countdown">
          <span className="countdown-num">{days}</span>
          <span className="countdown-label">days to race</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalMiles.toFixed(1)}</div>
          <div className="stat-label">Miles Logged</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{runs.length}</div>
          <div className="stat-label">Runs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgPace}</div>
          <div className="stat-label">Avg Pace</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Wk {currentWeek}</div>
          <div className="stat-label">of 8</div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>Plan Progress</span>
          <span>{completedPlanRuns}/{totalPlanRuns} runs ({progressPct}%)</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: progressPct + '%' }}></div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>Miles Toward Race Distance</span>
          <span>{totalMiles.toFixed(1)}/{totalPlanMiles.toFixed(0)} mi</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill miles" style={{ width: Math.min(100, (totalMiles / totalPlanMiles) * 100) + '%' }}></div>
        </div>
      </div>

      {recentPaces.length > 1 && (
        <div className="pace-trend">
          <h3>Pace Trend (Recent Runs)</h3>
          <div className="pace-chart">
            {recentPaces.map((r, i) => {
              const secs = paceToSeconds(r.pace);
              // Scale: 8:00 (480s) to 12:00 (720s)
              const minS = 480, maxS = 720;
              const pct = 100 - ((secs - minS) / (maxS - minS)) * 100;
              return (
                <div key={i} className="pace-bar-col">
                  <div className="pace-bar" style={{ height: Math.max(10, Math.min(100, pct)) + '%' }}>
                    <span className="pace-bar-label">{r.pace.replace('/mi', '')}</span>
                  </div>
                  <div className="pace-bar-date">{formatDateShort(r.date)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pacedRuns.length > 0 && (
        <div className="recent-activity">
          <h3>Last Run</h3>
          <div className="last-run-card">
            <div><strong>{formatDate(pacedRuns[pacedRuns.length - 1].date)}</strong></div>
            <div>{pacedRuns[pacedRuns.length - 1].distance} mi @ {pacedRuns[pacedRuns.length - 1].pace}</div>
            <div className="muted">{pacedRuns[pacedRuns.length - 1].duration} {pacedRuns[pacedRuns.length - 1].location && '· ' + pacedRuns[pacedRuns.length - 1].location}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Training Plan ──

function PlanView({ planState, runs, onToggle, onNavigateToLog }) {
  const [expandedWeek, setExpandedWeek] = useState(null);

  // Auto-expand current week
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentRun = TRAINING_PLAN.find(p => p.targetDate >= today);
    if (currentRun) setExpandedWeek(currentRun.week);
    else setExpandedWeek(8);
  }, []);

  const weekGroups = useMemo(() => {
    const groups = {};
    TRAINING_PLAN.forEach(p => {
      if (!groups[p.week]) groups[p.week] = [];
      groups[p.week].push(p);
    });
    return groups;
  }, []);

  return (
    <div className="plan-view">
      <h2>8-Week Training Plan</h2>
      <p className="plan-subtitle">Mar 3 – May 3, 2026 &middot; 3–4 runs/week</p>

      {Object.keys(weekGroups).map(weekNum => {
        const w = parseInt(weekNum);
        const weekRuns = weekGroups[w];
        const completed = weekRuns.filter(p => planState[p.id]?.completed).length;
        const isExpanded = expandedWeek === w;

        return (
          <div key={w} className="week-accordion">
            <button
              className={'week-header' + (isExpanded ? ' expanded' : '')}
              onClick={() => setExpandedWeek(isExpanded ? null : w)}
            >
              <div className="week-header-left">
                <span className="week-chevron">{isExpanded ? '▼' : '▶'}</span>
                <span className="week-title">{WEEK_LABELS[w - 1]}</span>
              </div>
              <span className="week-progress">{completed}/{weekRuns.length}</span>
            </button>
            {isExpanded && (
              <div className="week-body">
                {weekRuns.map(plan => {
                  const isCompleted = planState[plan.id]?.completed;
                  const linkedRunId = planState[plan.id]?.linkedRunId;
                  const linkedRun = linkedRunId ? runs.find(r => r.id === linkedRunId) : null;

                  return (
                    <div key={plan.id} className={'plan-run' + (isCompleted ? ' completed' : '')}>
                      <div className="plan-run-top">
                        <label className="plan-check-label">
                          <input
                            type="checkbox"
                            checked={!!isCompleted}
                            onChange={() => onToggle(plan.id, !isCompleted)}
                          />
                          <span className="plan-run-type" style={{ background: RUN_TYPE_COLORS[plan.type] }}>
                            {RUN_TYPE_LABELS[plan.type]}
                          </span>
                          <span className={'plan-run-workout' + (isCompleted ? ' struck' : '')}>{plan.workout}</span>
                        </label>
                      </div>
                      <div className="plan-run-meta">
                        <span>{formatDate(plan.targetDate)}</span>
                        <span className="muted">{plan.targetPace}</span>
                      </div>
                      {linkedRun && (
                        <div className="plan-run-actual">
                          Logged: {linkedRun.distance} mi @ {linkedRun.pace} ({linkedRun.duration})
                          {linkedRun.location && <span className="muted"> · {linkedRun.location}</span>}
                        </div>
                      )}
                      {!isCompleted && (
                        <button className="link-btn" onClick={() => onNavigateToLog(plan.id)}>
                          Log this run
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className="plan-notes">
        <h3>Injury Prevention Rules</h3>
        <ul>
          <li>Never increase long run by more than 1.5 mi per week</li>
          <li>48 hours between intensity runs (tempo/interval)</li>
          <li>Stay in Brooks shoes — no zero-drop</li>
          <li>If anything hurts, drop to easy pace or walk</li>
          <li>Runs can shift within the week — flexibility is key</li>
        </ul>
      </div>
    </div>
  );
}

// ── Log Run Form ──

function LogRunForm({ onSave, prefillPlanId, planState }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [distance, setDistance] = useState('');
  const [paceMin, setPaceMin] = useState('');
  const [paceSec, setPaceSec] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [planRunId, setPlanRunId] = useState(prefillPlanId || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prefillPlanId) {
      setPlanRunId(prefillPlanId);
      const plan = TRAINING_PLAN.find(p => p.id === prefillPlanId);
      if (plan) {
        setDate(plan.targetDate);
      }
    }
  }, [prefillPlanId]);

  const unlinkedPlans = TRAINING_PLAN.filter(p => !planState[p.id]?.completed);

  function handleSubmit(e) {
    e.preventDefault();
    if (!distance) return;

    const paceStr = paceMin && paceSec !== ''
      ? paceMin + ':' + String(paceSec).padStart(2, '0') + '/mi'
      : '';

    const run = {
      id: generateId(),
      date,
      distance: parseFloat(distance),
      pace: paceStr,
      duration,
      location,
      notes,
      planRunId: planRunId || null,
    };

    onSave(run);
    // Reset form
    setDistance('');
    setPaceMin('');
    setPaceSec('');
    setDuration('');
    setLocation('');
    setNotes('');
    setPlanRunId('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="log-form-container">
      <h2>Log a Run</h2>
      {saved && <div className="toast">Run saved!</div>}
      <form className="log-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Distance (miles)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 3.5"
            value={distance}
            onChange={e => setDistance(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Pace (min:sec /mi)</label>
          <div className="pace-inputs">
            <input
              type="number"
              min="0"
              max="30"
              placeholder="min"
              value={paceMin}
              onChange={e => setPaceMin(e.target.value)}
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              placeholder="sec"
              value={paceSec}
              onChange={e => setPaceSec(e.target.value)}
            />
            <span>/mi</span>
          </div>
        </div>

        <div className="form-group">
          <label>Duration</label>
          <input
            type="text"
            placeholder="e.g. 31:32"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="e.g. Philadelphia"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Link to Plan Workout (optional)</label>
          <select value={planRunId} onChange={e => setPlanRunId(e.target.value)}>
            <option value="">— None —</option>
            {unlinkedPlans.map(p => (
              <option key={p.id} value={p.id}>
                Wk{p.week} {formatDateShort(p.targetDate)} – {p.workout}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            rows="2"
            placeholder="How did it feel?"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn-primary">Save Run</button>
      </form>
    </div>
  );
}

// ── Run History ──

function RunHistory({ runs, onDelete }) {
  const sorted = [...runs].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div className="history">
        <h2>Run History</h2>
        <p className="muted">No runs logged yet.</p>
      </div>
    );
  }

  return (
    <div className="history">
      <h2>Run History</h2>
      <div className="history-list">
        {sorted.map(r => {
          const linkedPlan = r.planRunId ? TRAINING_PLAN.find(p => p.id === r.planRunId) : null;
          return (
            <div key={r.id} className="history-card">
              <div className="history-card-top">
                <div className="history-date">{formatDate(r.date)}</div>
                <button className="delete-btn" onClick={() => onDelete(r.id)} title="Delete run">&times;</button>
              </div>
              <div className="history-stats">
                <span><strong>{r.distance}</strong> mi</span>
                {r.pace && <span>@ {r.pace}</span>}
                {r.duration && <span>{r.duration}</span>}
              </div>
              {r.location && <div className="muted">{r.location}</div>}
              {linkedPlan && (
                <div className="history-linked">
                  <span className="plan-run-type" style={{ background: RUN_TYPE_COLORS[linkedPlan.type], fontSize: '0.7rem', padding: '1px 6px' }}>
                    {RUN_TYPE_LABELS[linkedPlan.type]}
                  </span>
                  {' '}{linkedPlan.workout}
                </div>
              )}
              {r.notes && <div className="history-notes">{r.notes}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main App ──

function App() {
  const [tab, setTab] = useState('dashboard');
  const [runs, setRuns] = useState([]);
  const [planState, setPlanState] = useState({});
  const [prefillPlanId, setPrefillPlanId] = useState('');

  useEffect(() => {
    Store.init();
    setRuns(Store.getRuns());
    setPlanState(Store.getPlanState());
  }, []);

  const handleSaveRun = useCallback((run) => {
    const updated = Store.addRun(run);
    setRuns(updated);
    // If linked to plan, mark plan run complete
    if (run.planRunId) {
      const newState = Store.togglePlanRun(run.planRunId, true, run.id);
      setPlanState(newState);
    }
  }, []);

  const handleDeleteRun = useCallback((id) => {
    if (!confirm('Delete this run?')) return;
    const updated = Store.deleteRun(id);
    setRuns(updated);
    setPlanState(Store.getPlanState());
  }, []);

  const handleTogglePlan = useCallback((planRunId, completed) => {
    const newState = Store.togglePlanRun(planRunId, completed);
    setPlanState(newState);
  }, []);

  const handleNavigateToLog = useCallback((planId) => {
    setPrefillPlanId(planId);
    setTab('log');
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>BSR Tracker</h1>
      </header>

      <main className="app-main">
        {tab === 'dashboard' && <Dashboard runs={runs} planState={planState} />}
        {tab === 'plan' && (
          <PlanView
            planState={planState}
            runs={runs}
            onToggle={handleTogglePlan}
            onNavigateToLog={handleNavigateToLog}
          />
        )}
        {tab === 'log' && (
          <LogRunForm
            onSave={handleSaveRun}
            prefillPlanId={prefillPlanId}
            planState={planState}
          />
        )}
        {tab === 'history' && <RunHistory runs={runs} onDelete={handleDeleteRun} />}
      </main>

      <TabBar active={tab} onChange={(t) => { setPrefillPlanId(''); setTab(t); }} />
    </div>
  );
}

// ── Mount ──
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
