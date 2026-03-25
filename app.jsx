const { useState, useEffect, useMemo, useCallback, useRef } = React;

// ── Utility helpers ──

function generateId() {
  return 'run-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}

function daysUntilRace() {
  const now = new Date();
  const race = new Date(RACE_DATE + 'T00:00:00');
  return Math.max(0, Math.ceil((race - now) / (1000 * 60 * 60 * 24)));
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
  return m + ':' + String(sec).padStart(2, '0');
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getCurrentWeek() {
  const today = new Date().toISOString().split('T')[0];
  const currentRun = TRAINING_PLAN.find(p => p.targetDate >= today);
  return currentRun ? currentRun.week : 8;
}

function getPaceZone(paceStr) {
  const secs = paceToSeconds(paceStr);
  if (secs === null) return null;
  for (const [zone, range] of Object.entries(PACE_ZONES)) {
    const minS = paceToSeconds(range.min);
    const maxS = paceToSeconds(range.max);
    if (secs >= minS && secs <= maxS) return zone;
  }
  if (secs < paceToSeconds(PACE_ZONES.interval.min)) return 'interval';
  if (secs > paceToSeconds(PACE_ZONES.easy.max)) return 'easy';
  return null;
}

const TYPE_COLORS = {
  easy: '#00e887',
  tempo: '#ff6b35',
  interval: '#ff4757',
  long: '#00d4ff',
  race: '#fbbf24',
};

// ── SVG Progress Ring ──

function ProgressRing({ radius, stroke, progress, color }) {
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={radius * 2} height={radius * 2}>
      <circle
        stroke="rgba(255,255,255,0.06)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + ' ' + circumference}
        strokeDashoffset={offset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: 'stroke-dashoffset 0.8s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
    </svg>
  );
}

// ── Toast ──

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast-container">
      <div className="toast">{message}</div>
    </div>
  );
}

// ── Confirm Dialog ──

function ConfirmDialog({ message, onConfirm, onCancel }) {
  if (!message) return null;
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Tab Bar ──

function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: '\u{1F3E0}' },
    { id: 'plan', label: 'Plan', icon: '\u{1F4CB}' },
    { id: 'log', label: 'Log', icon: '\u{1F3C3}' },
    { id: 'history', label: 'History', icon: '\u{1F4CA}' },
    { id: 'data', label: 'Sync', icon: '\u{1F504}' },
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

// ══════════════════════════
// DASHBOARD
// ══════════════════════════

function Dashboard({ runs, planState, onNavigateToLog }) {
  const days = daysUntilRace();
  const totalMiles = runs.reduce((s, r) => s + (r.distance || 0), 0);
  const adherence = Store.getPlanAdherence();
  const records = Store.getRecords();
  const streaks = Store.getStreaks();
  const weeklyMileage = Store.getWeeklyMileage();
  const nextRun = Store.getNextPlannedRun();
  const currentWeek = getCurrentWeek();
  const weekMeta = WEEK_META[currentWeek - 1];

  const pacedRuns = runs
    .filter(r => paceToSeconds(r.pace) !== null && r.distance > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  const avgPace = pacedRuns.length > 0
    ? secondsToPace(pacedRuns.reduce((s, r) => s + paceToSeconds(r.pace), 0) / pacedRuns.length)
    : '--';

  return (
    <div className="dashboard page-enter stagger">
      {/* Hero */}
      <div className="hero-card">
        <div className="hero-title">Broad Street Run 10-Miler</div>
        <div className="hero-date">May 3, 2026 &middot; Philadelphia</div>
        <div className="hero-ring-container">
          <ProgressRing radius={70} stroke={6} progress={adherence.pct} color="#00d4ff" />
          <div className="hero-ring-text">
            <span className="countdown-num">{days}</span>
            <span className="countdown-label">days to go</span>
          </div>
        </div>
        <div className="muted" style={{ marginTop: 4 }}>
          {adherence.completed}/{adherence.total} runs complete ({adherence.pct}%)
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value mono">{totalMiles.toFixed(1)}</div>
          <div className="stat-label">Miles</div>
        </div>
        <div className="stat-card">
          <div className="stat-value mono">{runs.filter(r => r.distance > 0).length}</div>
          <div className="stat-label">Runs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value mono">{avgPace}</div>
          <div className="stat-label">Avg Pace</div>
        </div>
        <div className="stat-card">
          <div className="stat-value mono">Wk {currentWeek}</div>
          <div className="stat-label">of 8</div>
        </div>
      </div>

      {/* Streaks */}
      <div className="streak-row">
        <div className="streak-badge">
          <span className="streak-icon">{'\u{1F525}'}</span>
          <span className="streak-value">{streaks.runDays}</span>
          <span className="streak-label">day streak</span>
        </div>
        <div className="streak-badge">
          <span className="streak-icon">{'\u{1F4AA}'}</span>
          <span className="streak-value">{streaks.activeWeeks}</span>
          <span className="streak-label">active wks</span>
        </div>
      </div>

      {/* Next Run */}
      {nextRun && (
        <div className="next-run-card">
          <div className="next-run-header">
            <span className="next-run-label">Next Up</span>
            <span className="next-run-date">{formatDate(nextRun.targetDate)}</span>
          </div>
          <div className="next-run-workout">{nextRun.workout}</div>
          <div className="next-run-meta">
            <span>{nextRun.targetDistance} mi</span>
            <span>{nextRun.targetPace}</span>
          </div>
          <button className="next-run-cta" onClick={() => onNavigateToLog(nextRun.id)}>
            Log this run
          </button>
        </div>
      )}

      {/* Personal Records */}
      {records.fastestPace && (
        <div className="records-grid">
          <div className="record-card">
            <div className="record-icon">{'\u26A1'}</div>
            <div className="record-value">{records.fastestPace.pace}</div>
            <div className="record-label">Fastest</div>
          </div>
          <div className="record-card">
            <div className="record-icon">{'\u{1F4CF}'}</div>
            <div className="record-value">{records.longestRun ? records.longestRun.distance + ' mi' : '--'}</div>
            <div className="record-label">Longest</div>
          </div>
          <div className="record-card">
            <div className="record-icon">{'\u{1F4C8}'}</div>
            <div className="record-value">{records.highestWeeklyMileage ? records.highestWeeklyMileage.miles.toFixed(1) : '--'}</div>
            <div className="record-label">Best Week</div>
          </div>
        </div>
      )}

      {/* Weekly Mileage Chart */}
      <WeeklyMileageChart data={weeklyMileage} currentWeek={currentWeek} />

      {/* Pace Trend */}
      {pacedRuns.length > 2 && <PaceTrendChart runs={pacedRuns} />}

      {/* Motivational Insight */}
      <MotivationalInsight weekMeta={weekMeta} currentWeek={currentWeek} adherence={adherence} />
    </div>
  );
}

// ── Weekly Mileage Chart ──

function WeeklyMileageChart({ data, currentWeek }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.planned, d.actual)), 1);

  return (
    <div className="chart-section">
      <div className="chart-title">Weekly Mileage</div>
      <div className="mileage-chart">
        {data.map(d => (
          <div key={d.week} className="mileage-bar-group">
            <div className="mileage-bar-value">
              {d.actual > 0 ? d.actual.toFixed(1) : ''}
            </div>
            <div className="mileage-bars">
              <div
                className="mileage-bar planned"
                style={{ height: Math.max(2, (d.planned / maxVal) * 90) + '%' }}
              />
              <div
                className={'mileage-bar actual' + (d.actual > d.planned ? ' over' : '')}
                style={{ height: Math.max(d.actual > 0 ? 4 : 0, (d.actual / maxVal) * 90) + '%' }}
              />
            </div>
            <div className={'mileage-week-label' + (d.week === currentWeek ? '' : '')}
                 style={d.week === currentWeek ? { color: '#00d4ff' } : {}}>
              W{d.week}
            </div>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span>Planned</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#00d4ff' }} />
          <span>Actual</span>
        </div>
      </div>
    </div>
  );
}

// ── Pace Trend Chart (SVG) ──

function PaceTrendChart({ runs }) {
  const last8 = runs.slice(-8);
  if (last8.length < 2) return null;

  const width = 320;
  const height = 100;
  const padX = 30;
  const padY = 12;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const paces = last8.map(r => paceToSeconds(r.pace));
  const minPace = Math.min(...paces) - 15;
  const maxPace = Math.max(...paces) + 15;
  const range = maxPace - minPace || 1;

  const points = last8.map((r, i) => {
    const x = padX + (i / (last8.length - 1)) * innerW;
    const y = padY + ((paces[i] - minPace) / range) * innerH;
    return { x, y, pace: r.pace, date: r.date };
  });

  const polyline = points.map(p => p.x + ',' + p.y).join(' ');

  return (
    <div className="chart-section">
      <div className="chart-title">Pace Trend</div>
      <svg className="pace-trend-chart" viewBox={'0 0 ' + width + ' ' + height} preserveAspectRatio="none">
        {/* Zone bands */}
        {Object.entries(PACE_ZONES).map(([zone, z]) => {
          const top = padY + ((paceToSeconds(z.min) - minPace) / range) * innerH;
          const bot = padY + ((paceToSeconds(z.max) - minPace) / range) * innerH;
          if (top > height || bot < 0) return null;
          return (
            <rect
              key={zone}
              x={padX}
              y={Math.max(0, top)}
              width={innerW}
              height={Math.min(height, bot) - Math.max(0, top)}
              fill={TYPE_COLORS[zone] || 'rgba(255,255,255,0.05)'}
              className="pace-zone-band"
            />
          );
        })}
        {/* Line */}
        <polyline points={polyline} className="pace-line" vectorEffect="non-scaling-stroke" />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" className="pace-dot" />
        ))}
        {/* Labels */}
        <text x={padX - 4} y={padY + 4} textAnchor="end" className="pace-label">
          {secondsToPace(minPace)}
        </text>
        <text x={padX - 4} y={height - padY + 4} textAnchor="end" className="pace-label">
          {secondsToPace(maxPace)}
        </text>
      </svg>
      <div style={{ fontSize: '0.6rem', color: '#5f677a', textAlign: 'center', marginTop: 4 }}>
        faster {'\u2191'} &middot; Note: lower = faster pace
      </div>
    </div>
  );
}

// ── Motivational Insight ──

function MotivationalInsight({ weekMeta, currentWeek, adherence }) {
  const messages = [
    adherence.pct >= 80 ? 'You\'re crushing it. ' + adherence.pct + '% plan adherence.' : null,
    adherence.pct >= 50 && adherence.pct < 80 ? 'Solid consistency. Keep showing up.' : null,
    currentWeek <= 3 ? 'Early weeks build the foundation. Every run counts.' : null,
    currentWeek >= 7 ? 'Taper time. Trust the work you\'ve already done.' : null,
  ].filter(Boolean);

  const msg = messages[0] || weekMeta?.theme || 'Keep moving forward.';

  return (
    <div className="insight-card">
      <div className="insight-phase">Week {currentWeek} — {weekMeta?.title || 'Training'}</div>
      <div className="insight-text">{msg}</div>
    </div>
  );
}

// ══════════════════════════
// PLAN VIEW
// ══════════════════════════

function PlanView({ planState, runs, onToggle, onNavigateToLog }) {
  const currentWeek = getCurrentWeek();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const pillsRef = useRef(null);

  // Scroll active pill into view
  useEffect(() => {
    if (pillsRef.current) {
      const active = pillsRef.current.querySelector('.week-pill.active');
      if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedWeek]);

  const weekGroups = useMemo(() => {
    const groups = {};
    TRAINING_PLAN.forEach(p => {
      if (!groups[p.week]) groups[p.week] = [];
      groups[p.week].push(p);
    });
    return groups;
  }, []);

  const weekMeta = WEEK_META[selectedWeek - 1];
  const weekRuns = weekGroups[selectedWeek] || [];
  const weekCompleted = weekRuns.filter(p => planState[p.id]?.completed).length;

  return (
    <div className="plan-view page-enter">
      <h2>Training Plan</h2>
      <p className="plan-subtitle">8 weeks &middot; Coach-reviewed &middot; {'\u{1F3C1}'} May 3</p>

      {/* Week pills */}
      <div className="week-pills" ref={pillsRef}>
        {WEEK_META.map(w => {
          const wRuns = weekGroups[w.week] || [];
          const wDone = wRuns.filter(p => planState[p.id]?.completed).length;
          const allDone = wDone === wRuns.length;
          return (
            <button
              key={w.week}
              className={'week-pill' + (selectedWeek === w.week ? ' active' : '') + (allDone ? ' completed' : '')}
              onClick={() => setSelectedWeek(w.week)}
            >
              Wk {w.week}
              <span className="week-pill-progress">{wDone}/{wRuns.length}</span>
            </button>
          );
        })}
      </div>

      {/* Week detail */}
      <div className="week-detail page-enter stagger" key={selectedWeek}>
        <div className="week-detail-header">
          <div className="week-detail-title">Week {selectedWeek} — {weekMeta?.title}</div>
          <div className="week-detail-subtitle">{weekMeta?.subtitle} &middot; {weekMeta?.dates}</div>
          {weekMeta?.theme && <div className="week-detail-theme">{weekMeta.theme}</div>}
        </div>

        {weekRuns.map(plan => {
          const isCompleted = planState[plan.id]?.completed;
          const linkedRunId = planState[plan.id]?.linkedRunId;
          const linkedRun = linkedRunId ? runs.find(r => r.id === linkedRunId) : null;
          const isRest = plan.targetDistance === 0;

          return (
            <div key={plan.id} className={'plan-run-card' + (isCompleted ? ' completed' : '') + (isRest ? ' rest-day' : '')}>
              <div className="plan-run-top">
                {!isRest && (
                  <input
                    type="checkbox"
                    className="plan-check"
                    checked={!!isCompleted}
                    onChange={() => onToggle(plan.id, !isCompleted)}
                  />
                )}
                <span className={'run-type-badge ' + plan.type}>{plan.type}</span>
                <span className={'plan-run-workout' + (isCompleted ? ' struck' : '')}>{plan.workout}</span>
              </div>
              <div className="plan-run-meta">
                <span>{plan.day} &middot; {formatDate(plan.targetDate)}</span>
                <span className="plan-run-pace">{plan.targetPace}</span>
              </div>
              {plan.notes && <div className="plan-run-notes">{plan.notes}</div>}
              {linkedRun && (
                <div className="plan-run-actual">
                  {'\u2713'} {linkedRun.distance} mi @ {linkedRun.pace} ({linkedRun.duration})
                  {linkedRun.location && ' \u00B7 ' + linkedRun.location}
                </div>
              )}
              {!isCompleted && !isRest && (
                <button className="plan-run-cta" onClick={() => onNavigateToLog(plan.id)}>
                  Log this run
                </button>
              )}
            </div>
          );
        })}

        {/* Race notes for week 8 */}
        {selectedWeek === 8 && weekMeta?.raceNotes && (
          <div className="race-notes">
            <h3>{'\u{1F3C1}'} Race Day Logistics</h3>
            <ul>
              {weekMeta.raceNotes.map((note, i) => <li key={i}>{note}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Safety notes */}
      <div className="plan-safety-notes">
        <h3>Injury Prevention</h3>
        <ul>
          <li>Never increase long run by more than 1.5 mi per week</li>
          <li>48 hours between intensity runs (tempo/interval)</li>
          <li>Stay in Brooks shoes — no zero-drop experiments</li>
          <li>If anything hurts, drop to easy pace or walk</li>
          <li>Runs can shift within the week — flexibility is key</li>
          <li>Strides are optional — skip if fatigued</li>
        </ul>
      </div>
    </div>
  );
}

// ══════════════════════════
// LOG RUN FORM
// ══════════════════════════

function LogRunForm({ onSave, onUpdate, prefillPlanId, editingRun, onCancelEdit, planState, showToast }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [distance, setDistance] = useState('');
  const [paceMin, setPaceMin] = useState('');
  const [paceSec, setPaceSec] = useState('');
  const [duration, setDuration] = useState('');
  const [runType, setRunType] = useState('easy');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [effort, setEffort] = useState(5);
  const [feel, setFeel] = useState(null);
  const [weather, setWeather] = useState(null);
  const [temperature, setTemperature] = useState('');
  const [splits, setSplits] = useState([]);
  const [planRunId, setPlanRunId] = useState(prefillPlanId || '');

  // Populate form when editing
  useEffect(() => {
    if (editingRun) {
      setDate(editingRun.date);
      setDistance(String(editingRun.distance));
      const pSecs = paceToSeconds(editingRun.pace);
      if (pSecs) {
        setPaceMin(String(Math.floor(pSecs / 60)));
        setPaceSec(String(pSecs % 60));
      }
      setDuration(editingRun.duration || '');
      setRunType(editingRun.type || 'easy');
      setLocation(editingRun.location || '');
      setNotes(editingRun.notes || '');
      setEffort(editingRun.effort || 5);
      setFeel(editingRun.feel || null);
      setWeather(editingRun.weather?.condition || null);
      setTemperature(editingRun.weather?.temp || '');
      setSplits(editingRun.splits || []);
      setPlanRunId(editingRun.planRunId || '');
    }
  }, [editingRun]);

  // Populate from plan prefill
  useEffect(() => {
    if (prefillPlanId && !editingRun) {
      setPlanRunId(prefillPlanId);
      const plan = TRAINING_PLAN.find(p => p.id === prefillPlanId);
      if (plan) {
        setDate(plan.targetDate);
        setRunType(plan.type);
        setDistance(String(plan.targetDistance));
      }
    }
  }, [prefillPlanId]);

  // Auto-suggest plan link
  const suggestion = useMemo(() => {
    if (planRunId || editingRun) return null;
    return Store.suggestPlanLink(date);
  }, [date, planRunId, editingRun]);

  const unlinkedPlans = TRAINING_PLAN.filter(p => !planState[p.id]?.completed && p.targetDistance > 0);

  // Pace zone feedback
  const currentPace = paceMin && paceSec !== '' ? paceMin + ':' + String(paceSec).padStart(2, '0') : '';
  const paceZone = getPaceZone(currentPace);

  function resetForm() {
    setDate(new Date().toISOString().split('T')[0]);
    setDistance('');
    setPaceMin('');
    setPaceSec('');
    setDuration('');
    setRunType('easy');
    setLocation('');
    setNotes('');
    setEffort(5);
    setFeel(null);
    setWeather(null);
    setTemperature('');
    setSplits([]);
    setPlanRunId('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!distance || parseFloat(distance) <= 0) return;

    // Validate pace
    if (paceMin && (parseInt(paceMin) < 0 || parseInt(paceMin) > 30)) return;
    if (paceSec !== '' && (parseInt(paceSec) < 0 || parseInt(paceSec) > 59)) return;

    const paceStr = paceMin && paceSec !== ''
      ? paceMin + ':' + String(paceSec).padStart(2, '0')
      : '';

    const weatherObj = weather ? { condition: weather, temp: temperature || null } : null;

    const runData = {
      date,
      distance: parseFloat(distance),
      pace: paceStr,
      duration,
      type: runType,
      location,
      notes,
      effort: effort || null,
      feel,
      weather: weatherObj,
      splits: splits.filter(s => s),
      planRunId: planRunId || null,
    };

    if (editingRun) {
      onUpdate(editingRun.id, runData);
      showToast('Run updated!');
    } else {
      runData.id = generateId();
      onSave(runData);
      showToast('Run saved!');
    }

    resetForm();
    if (editingRun && onCancelEdit) onCancelEdit();
  }

  function addSplit() {
    setSplits([...splits, '']);
  }

  function updateSplit(index, value) {
    const newSplits = [...splits];
    newSplits[index] = value;
    setSplits(newSplits);
  }

  function removeSplit(index) {
    setSplits(splits.filter((_, i) => i !== index));
  }

  return (
    <div className="log-form-container page-enter">
      <h2>{editingRun ? 'Edit Run' : 'Log a Run'}</h2>

      {editingRun && (
        <div className="edit-mode-banner">
          <span className="edit-mode-text">Editing run from {formatDate(editingRun.date)}</span>
          <button className="edit-cancel-btn" onClick={onCancelEdit}>Cancel</button>
        </div>
      )}

      <form className="log-form" onSubmit={handleSubmit}>
        {/* Date */}
        <div className="form-group">
          <label className="form-label">Date</label>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} required />
        </div>

        {/* Run Type */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="run-type-toggles">
            {RUN_TYPES.map(t => (
              <button
                key={t}
                type="button"
                className={'type-toggle ' + t + (runType === t ? ' active' : '')}
                onClick={() => setRunType(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div className="form-group">
          <label className="form-label">Distance (miles)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-input mono"
            placeholder="e.g. 3.5"
            value={distance}
            onChange={e => setDistance(e.target.value)}
            required
          />
        </div>

        {/* Pace */}
        <div className="form-group">
          <label className="form-label">Pace (min:sec /mi)</label>
          <div className="pace-input-group">
            <input
              type="number"
              min="0"
              max="30"
              className="form-input mono"
              placeholder="min"
              value={paceMin}
              onChange={e => setPaceMin(e.target.value)}
            />
            <span className="pace-separator">:</span>
            <input
              type="number"
              min="0"
              max="59"
              className="form-input mono"
              placeholder="sec"
              value={paceSec}
              onChange={e => setPaceSec(e.target.value)}
            />
            <span className="pace-unit">/mi</span>
          </div>
          {paceZone && (
            <span className={'pace-zone-feedback ' + paceZone}>
              {PACE_ZONES[paceZone]?.label} zone ({PACE_ZONES[paceZone]?.description})
            </span>
          )}
        </div>

        {/* Duration */}
        <div className="form-group">
          <label className="form-label">Duration</label>
          <input
            type="text"
            className="form-input mono"
            placeholder="e.g. 31:32"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
        </div>

        {/* Effort (RPE) */}
        <div className="form-group">
          <label className="form-label">Effort (RPE)</label>
          <div className="effort-slider-container">
            <input
              type="range"
              min="1"
              max="10"
              className="effort-slider"
              value={effort}
              onChange={e => setEffort(parseInt(e.target.value))}
            />
            <div className="effort-value">{effort}/10</div>
            <div className="effort-labels">
              <span>Easy</span>
              <span>Moderate</span>
              <span>Max</span>
            </div>
          </div>
        </div>

        {/* Feel */}
        <div className="form-group">
          <label className="form-label">How did it feel?</label>
          <div className="feel-selector">
            {FEEL_OPTIONS.map(f => (
              <button
                key={f.value}
                type="button"
                className={'feel-btn' + (feel === f.value ? ' active' : '')}
                onClick={() => setFeel(feel === f.value ? null : f.value)}
              >
                <span>{f.emoji}</span>
                <span className="feel-btn-label">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="form-group">
          <label className="form-label">Weather</label>
          <div className="weather-selector">
            {WEATHER_OPTIONS.map(w => (
              <button
                key={w.value}
                type="button"
                className={'weather-btn' + (weather === w.value ? ' active' : '')}
                onClick={() => setWeather(weather === w.value ? null : w.value)}
              >
                <span>{w.icon}</span>
                <span>{w.label}</span>
              </button>
            ))}
          </div>
          {weather && (
            <div className="temp-input-group">
              <input
                type="number"
                className="form-input mono"
                placeholder="Temp"
                value={temperature}
                onChange={e => setTemperature(e.target.value)}
              />
              <span className="pace-unit">{'\u00B0'}F</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Philadelphia"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>

        {/* Splits */}
        <div className="form-group">
          <label className="form-label">Per-Mile Splits (optional)</label>
          <div className="splits-container">
            {splits.map((s, i) => (
              <div key={i} className="split-row">
                <span className="split-mile">Mi {i + 1}</span>
                <input
                  type="text"
                  className="form-input mono"
                  placeholder="e.g. 10:15"
                  value={s}
                  onChange={e => updateSplit(i, e.target.value)}
                />
                <button type="button" className="btn-cancel" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => removeSplit(i)}>{'\u2715'}</button>
              </div>
            ))}
            <button type="button" className="add-split-btn" onClick={addSplit}>
              + Add split
            </button>
          </div>
        </div>

        {/* Plan Link */}
        <div className="form-group">
          <label className="form-label">Link to Plan (optional)</label>
          {suggestion && !planRunId && (
            <div className="plan-suggestion">
              <span className="plan-suggestion-text">
                Match: {suggestion.workout}
              </span>
              <button type="button" className="plan-suggestion-btn" onClick={() => setPlanRunId(suggestion.id)}>
                Link
              </button>
            </div>
          )}
          <select className="form-input form-select" value={planRunId} onChange={e => setPlanRunId(e.target.value)}>
            <option value="">— None —</option>
            {unlinkedPlans.map(p => (
              <option key={p.id} value={p.id}>
                Wk{p.week} {formatDateShort(p.targetDate)} — {p.workout}
              </option>
            ))}
            {editingRun?.planRunId && !unlinkedPlans.find(p => p.id === editingRun.planRunId) && (
              <option value={editingRun.planRunId}>
                {(() => {
                  const p = TRAINING_PLAN.find(p => p.id === editingRun.planRunId);
                  return p ? `Wk${p.week} ${formatDateShort(p.targetDate)} — ${p.workout}` : editingRun.planRunId;
                })()}
              </option>
            )}
          </select>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-input form-textarea"
            rows="2"
            placeholder="How did it go?"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-submit">
          {editingRun ? 'Update Run' : 'Save Run'}
        </button>
      </form>
    </div>
  );
}

// ══════════════════════════
// HISTORY
// ══════════════════════════

function RunHistory({ runs, onDelete, onEdit }) {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'easy', label: 'Easy' },
    { id: 'tempo', label: 'Tempo' },
    { id: 'interval', label: 'Interval' },
    { id: 'long', label: 'Long' },
  ];

  const filtered = useMemo(() => {
    let result = [...runs].filter(r => r.distance > 0);
    if (filter !== 'all') result = result.filter(r => r.type === filter);
    return result.sort((a, b) => b.date.localeCompare(a.date));
  }, [runs, filter]);

  if (runs.filter(r => r.distance > 0).length === 0) {
    return (
      <div className="history page-enter">
        <h2>Run History</h2>
        <div className="empty-state">
          <div className="empty-icon">{'\u{1F3C3}'}</div>
          <p className="muted">No runs logged yet. Get out there!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history page-enter">
      <h2>Run History</h2>

      <div className="history-filters">
        {filters.map(f => (
          <button
            key={f.id}
            className={'filter-chip' + (filter === f.id ? ' active' : '')}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="history-list stagger">
        {filtered.map(r => {
          const linkedPlan = r.planRunId ? TRAINING_PLAN.find(p => p.id === r.planRunId) : null;
          const isExpanded = expandedId === r.id;
          const feelOption = r.feel ? FEEL_OPTIONS.find(f => f.value === r.feel) : null;

          return (
            <div key={r.id} className="history-card">
              <div className="history-card-main" onClick={() => setExpandedId(isExpanded ? null : r.id)}>
                <div className="history-card-top">
                  <div className="history-date">{formatDate(r.date)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {feelOption && <span className="history-feel">{feelOption.emoji}</span>}
                    <div className="history-type-dot" style={{ background: TYPE_COLORS[r.type] || '#888' }} />
                  </div>
                </div>
                <div className="history-stats">
                  <span><strong>{r.distance}</strong> mi</span>
                  {r.pace && <span>@ {r.pace}</span>}
                  {r.duration && <span>{r.duration}</span>}
                </div>
                {r.location && <div className="muted" style={{ marginTop: 4 }}>{r.location}</div>}
              </div>

              {isExpanded && (
                <div className="history-expanded">
                  {r.effort && (
                    <div className="history-detail-row">
                      <span className="history-detail-label">Effort (RPE)</span>
                      <span className="history-detail-value">{r.effort}/10</span>
                    </div>
                  )}
                  {r.weather && (
                    <div className="history-detail-row">
                      <span className="history-detail-label">Weather</span>
                      <span className="history-detail-value">
                        {WEATHER_OPTIONS.find(w => w.value === r.weather?.condition)?.icon || ''}{' '}
                        {r.weather.temp && r.weather.temp + '\u00B0F'}
                      </span>
                    </div>
                  )}
                  {r.splits && r.splits.length > 0 && (
                    <div className="history-detail-row" style={{ flexDirection: 'column', gap: 4 }}>
                      <span className="history-detail-label">Splits</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {r.splits.map((s, i) => (
                          <span key={i}>Mi {i + 1}: {s}{i < r.splits.length - 1 ? ' \u00B7 ' : ''}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {linkedPlan && (
                    <div className="history-linked">
                      <span className={'run-type-badge ' + linkedPlan.type} style={{ fontSize: '0.55rem', padding: '2px 6px' }}>
                        {linkedPlan.type}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{linkedPlan.workout}</span>
                    </div>
                  )}
                  {r.notes && <div className="history-notes">{r.notes}</div>}
                  <div className="history-actions">
                    <button className="btn-edit" onClick={() => onEdit(r)}>Edit</button>
                    <button className="btn-delete" onClick={() => onDelete(r.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p className="muted">No {filter} runs found.</p>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════
// DATA SYNC
// ══════════════════════════

function DataManager({ runs, planState, onImport, showToast }) {
  const [importText, setImportText] = useState('');

  function handleExport() {
    const data = Store.exportData();
    const json = JSON.stringify(data, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).then(() => {
        showToast('Copied to clipboard!');
      }).catch(() => {
        setImportText(json);
        showToast('Clipboard unavailable — text shown below, copy manually');
      });
    } else {
      setImportText(json);
      showToast('Clipboard unavailable — text shown below, copy manually');
    }
  }

  function handleImport() {
    if (!importText.trim()) return;
    try {
      const data = JSON.parse(importText.trim());
      const result = Store.importData(data);
      onImport();
      setImportText('');
      showToast(`Imported! ${result.added} new, ${result.updated} updated — ${result.totalRuns} total runs`);
    } catch (e) {
      showToast(e.message || 'Invalid JSON');
    }
  }

  function handleReset() {
    // Use the app's confirm flow would be ideal, but keep it simple
    if (!window.confirm('Reset ALL data back to the original seed runs? This cannot be undone.')) return;
    Store.reset();
    onImport();
    showToast('Data reset to seed runs');
  }

  const adherence = Store.getPlanAdherence();

  return (
    <div className="data-manager">
      <h2>Sync Data</h2>
      <p className="section-subtitle">
        Export your data on one device, then import on another to stay in sync.
      </p>

      <div className="data-section">
        <h3>Export</h3>
        <p className="muted">Copies all {runs.length} runs and {adherence.completed} completed workouts as JSON.</p>
        <button className="btn-primary" onClick={handleExport} style={{ marginTop: '8px' }}>
          Copy Data to Clipboard
        </button>
      </div>

      <div className="data-section">
        <h3>Import</h3>
        <p className="muted">Paste exported JSON from another device. Data is merged (not replaced).</p>
        <textarea
          className="import-textarea"
          rows="6"
          placeholder="Paste exported JSON here..."
          value={importText}
          onChange={e => setImportText(e.target.value)}
        ></textarea>
        <button
          className="btn-primary"
          onClick={handleImport}
          disabled={!importText.trim()}
          style={{ marginTop: '8px', opacity: importText.trim() ? 1 : 0.5 }}
        >
          Import Data
        </button>
      </div>

      <div className="data-section danger-zone">
        <h3>Danger Zone</h3>
        <button className="btn-danger" onClick={handleReset}>Reset to Seed Data</button>
      </div>
    </div>
  );
}

// ══════════════════════════
// MAIN APP
// ══════════════════════════

function App() {
  const [tab, setTab] = useState('dashboard');
  const [runs, setRuns] = useState([]);
  const [planState, setPlanState] = useState({});
  const [prefillPlanId, setPrefillPlanId] = useState('');
  const [editingRun, setEditingRun] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [confirmState, setConfirmState] = useState(null);

  useEffect(() => {
    Store.init();
    setRuns(Store.getRuns());
    setPlanState(Store.getPlanState());

    return Store.onChange(() => {
      setRuns(Store.getRuns());
      setPlanState(Store.getPlanState());
    });
  }, []);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2200);
  }, []);

  const handleSaveRun = useCallback((run) => {
    Store.addRun(run);
    setRuns(Store.getRuns());
    setPlanState(Store.getPlanState());
  }, []);

  const handleUpdateRun = useCallback((id, updates) => {
    Store.updateRun(id, updates);
    setRuns(Store.getRuns());
    setPlanState(Store.getPlanState());
  }, []);

  const handleDeleteRun = useCallback((id) => {
    setConfirmState({
      message: 'Delete this run? This can\'t be undone.',
      onConfirm: () => {
        Store.deleteRun(id);
        setRuns(Store.getRuns());
        setPlanState(Store.getPlanState());
        setConfirmState(null);
        showToast('Run deleted');
      },
    });
  }, [showToast]);

  const handleTogglePlan = useCallback((planRunId, completed) => {
    const newState = Store.togglePlanRun(planRunId, completed);
    setPlanState(newState);
  }, []);

  const handleImportRefresh = useCallback(() => {
    setRuns(Store.getRuns());
    setPlanState(Store.getPlanState());
  }, []);

  const handleNavigateToLog = useCallback((planId) => {
    setPrefillPlanId(planId);
    setEditingRun(null);
    setTab('log');
  }, []);

  const handleEditRun = useCallback((run) => {
    setEditingRun(run);
    setPrefillPlanId('');
    setTab('log');
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingRun(null);
    setTab('history');
  }, []);

  function handleTabChange(t) {
    setPrefillPlanId('');
    if (!editingRun) setEditingRun(null);
    setTab(t);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>BSR Tracker</h1>
      </header>

      <Toast message={toastMsg} />
      <ConfirmDialog
        message={confirmState?.message}
        onConfirm={confirmState?.onConfirm}
        onCancel={() => setConfirmState(null)}
      />

      <main className="app-main" key={tab}>
        {tab === 'dashboard' && (
          <Dashboard runs={runs} planState={planState} onNavigateToLog={handleNavigateToLog} />
        )}
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
            onUpdate={handleUpdateRun}
            prefillPlanId={prefillPlanId}
            editingRun={editingRun}
            onCancelEdit={handleCancelEdit}
            planState={planState}
            showToast={showToast}
          />
        )}
        {tab === 'history' && (
          <RunHistory
            runs={runs}
            onDelete={handleDeleteRun}
            onEdit={handleEditRun}
          />
        )}
        {tab === 'data' && (
          <DataManager
            runs={runs}
            planState={planState}
            onImport={handleImportRefresh}
            showToast={showToast}
          />
        )}
      </main>

      <TabBar active={tab} onChange={handleTabChange} />
    </div>
  );
}

// ── Mount ──
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
