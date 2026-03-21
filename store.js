// Store V2 — Full CRUD, records, streaks, migration, reactive updates
const STORE_VERSION = 2;
const STORAGE_KEYS = {
  RUNS: 'bsr_runs',
  PLAN_STATE: 'bsr_plan_state',
  INITIALIZED: 'bsr_initialized',
  VERSION: 'bsr_store_version',
};

const Store = {
  _listeners: [],
  _cache: { runs: null, planState: null, records: null, streaks: null },

  // --- Low-level ---
  _read(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Store read error:', e);
      return null;
    }
  },

  _write(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Store write error:', e);
    }
  },

  _notify() {
    this._cache.records = null;
    this._cache.streaks = null;
    this._listeners.forEach(fn => {
      try { fn(); } catch(e) { console.error('Store listener error:', e); }
    });
  },

  onChange(callback) {
    this._listeners.push(callback);
    return () => {
      this._listeners = this._listeners.filter(fn => fn !== callback);
    };
  },

  // --- Migration ---
  _migrateV1toV2() {
    const runs = this._read(STORAGE_KEYS.RUNS) || [];
    const now = new Date().toISOString();
    const migrated = runs.map(r => ({
      ...r,
      // Normalize pace: strip "/mi" if present for consistent storage
      pace: r.pace ? r.pace.replace('/mi', '') : '',
      type: r.type || this._inferType(r.planRunId),
      effort: r.effort || null,
      feel: r.feel || null,
      weather: r.weather || null,
      splits: r.splits || [],
      createdAt: r.createdAt || now,
      updatedAt: r.updatedAt || now,
    }));
    this._write(STORAGE_KEYS.RUNS, migrated);
    this._write(STORAGE_KEYS.VERSION, STORE_VERSION);
  },

  _inferType(planRunId) {
    if (!planRunId) return 'easy';
    const plan = TRAINING_PLAN.find(p => p.id === planRunId);
    return plan ? plan.type : 'easy';
  },

  // --- Init ---
  init() {
    const version = this._read(STORAGE_KEYS.VERSION);

    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      // Fresh install
      this._write(STORAGE_KEYS.RUNS, SEED_RUNS);
      const planState = {};
      SEED_RUNS.forEach(r => {
        if (r.planRunId) {
          planState[r.planRunId] = { completed: true, linkedRunId: r.id };
        }
      });
      this._write(STORAGE_KEYS.PLAN_STATE, planState);
      this._write(STORAGE_KEYS.VERSION, STORE_VERSION);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } else if (!version || version < STORE_VERSION) {
      // Migrate from V1
      this._migrateV1toV2();
    }

    this._cache.runs = null;
    this._cache.planState = null;
  },

  // --- CRUD ---
  getRuns() {
    if (!this._cache.runs) {
      this._cache.runs = this._read(STORAGE_KEYS.RUNS) || [];
    }
    return this._cache.runs;
  },

  _saveRuns(runs) {
    this._cache.runs = runs;
    this._write(STORAGE_KEYS.RUNS, runs);
    this._notify();
  },

  addRun(run) {
    const now = new Date().toISOString();
    const newRun = {
      id: run.id || ('run-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)),
      date: run.date,
      distance: parseFloat(run.distance) || 0,
      pace: run.pace || '',
      duration: run.duration || '',
      type: run.type || 'easy',
      location: run.location || '',
      notes: run.notes || '',
      effort: run.effort || null,
      feel: run.feel || null,
      weather: run.weather || null,
      splits: run.splits || [],
      planRunId: run.planRunId || null,
      createdAt: now,
      updatedAt: now,
    };

    const runs = [...this.getRuns(), newRun];
    this._saveRuns(runs);

    if (newRun.planRunId) {
      this.togglePlanRun(newRun.planRunId, true, newRun.id);
    }

    return newRun;
  },

  updateRun(id, updates) {
    const runs = this.getRuns().map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...updates, updatedAt: new Date().toISOString() };
      // Handle plan link changes
      if (updates.planRunId !== undefined && updates.planRunId !== r.planRunId) {
        // Unlink old
        if (r.planRunId) this.togglePlanRun(r.planRunId, false);
        // Link new
        if (updates.planRunId) this.togglePlanRun(updates.planRunId, true, id);
      }
      return updated;
    });
    this._saveRuns(runs);
    return runs.find(r => r.id === id);
  },

  deleteRun(id) {
    const run = this.getRuns().find(r => r.id === id);
    if (run && run.planRunId) {
      this.togglePlanRun(run.planRunId, false);
    }
    const runs = this.getRuns().filter(r => r.id !== id);
    this._saveRuns(runs);
    return runs;
  },

  // --- Plan State ---
  getPlanState() {
    if (!this._cache.planState) {
      this._cache.planState = this._read(STORAGE_KEYS.PLAN_STATE) || {};
    }
    return this._cache.planState;
  },

  _savePlanState(state) {
    this._cache.planState = state;
    this._write(STORAGE_KEYS.PLAN_STATE, state);
  },

  togglePlanRun(planRunId, completed, linkedRunId) {
    const state = { ...this.getPlanState() };
    if (completed) {
      state[planRunId] = { completed: true, linkedRunId: linkedRunId || null };
    } else {
      delete state[planRunId];
    }
    this._savePlanState(state);
    return state;
  },

  // --- Computed: Personal Records ---
  getRecords() {
    if (this._cache.records) return this._cache.records;
    const runs = this.getRuns().filter(r => r.distance > 0);
    if (runs.length === 0) {
      this._cache.records = { fastestPace: null, longestRun: null, highestWeeklyMileage: null };
      return this._cache.records;
    }

    // Fastest pace
    let fastestPace = null;
    let fastestPaceRun = null;
    runs.forEach(r => {
      const secs = paceStringToSeconds(r.pace);
      if (secs !== null && (fastestPace === null || secs < fastestPace)) {
        fastestPace = secs;
        fastestPaceRun = r;
      }
    });

    // Longest run
    let longestRun = runs.reduce((max, r) => r.distance > (max?.distance || 0) ? r : max, null);

    // Highest weekly mileage
    const weeklyMiles = {};
    runs.forEach(r => {
      const d = new Date(r.date + 'T12:00:00');
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split('T')[0];
      weeklyMiles[key] = (weeklyMiles[key] || 0) + r.distance;
    });
    const highestWeekKey = Object.keys(weeklyMiles).reduce((a, b) => weeklyMiles[a] > weeklyMiles[b] ? a : b, Object.keys(weeklyMiles)[0]);

    this._cache.records = {
      fastestPace: fastestPaceRun ? { pace: fastestPaceRun.pace, date: fastestPaceRun.date, distance: fastestPaceRun.distance } : null,
      longestRun: longestRun ? { distance: longestRun.distance, date: longestRun.date, pace: longestRun.pace } : null,
      highestWeeklyMileage: highestWeekKey ? { miles: weeklyMiles[highestWeekKey], weekOf: highestWeekKey } : null,
    };
    return this._cache.records;
  },

  // --- Computed: Streaks ---
  getStreaks() {
    if (this._cache.streaks) return this._cache.streaks;
    const runs = this.getRuns().filter(r => r.distance > 0);
    if (runs.length === 0) {
      this._cache.streaks = { runDays: 0, activeWeeks: 0 };
      return this._cache.streaks;
    }

    // Consecutive run days (ending today or most recent)
    const dates = [...new Set(runs.map(r => r.date))].sort().reverse();
    let runDays = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1] + 'T12:00:00');
      const curr = new Date(dates[i] + 'T12:00:00');
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff === 1) runDays++;
      else break;
    }

    // Consecutive active weeks
    const weeks = [...new Set(runs.map(r => {
      const d = new Date(r.date + 'T12:00:00');
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      return weekStart.toISOString().split('T')[0];
    }))].sort().reverse();
    let activeWeeks = 1;
    for (let i = 1; i < weeks.length; i++) {
      const prev = new Date(weeks[i - 1] + 'T12:00:00');
      const curr = new Date(weeks[i] + 'T12:00:00');
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff <= 7) activeWeeks++;
      else break;
    }

    this._cache.streaks = { runDays, activeWeeks };
    return this._cache.streaks;
  },

  // --- Computed: Weekly Mileage (planned vs actual) ---
  getWeeklyMileage() {
    const runs = this.getRuns();
    const result = [];
    for (let w = 1; w <= 8; w++) {
      const planned = TRAINING_PLAN
        .filter(p => p.week === w)
        .reduce((s, p) => s + p.targetDistance, 0);
      const actual = runs
        .filter(r => {
          const plan = r.planRunId ? TRAINING_PLAN.find(p => p.id === r.planRunId) : null;
          if (plan) return plan.week === w;
          // Fallback: date-based week assignment
          const meta = WEEK_META[w - 1];
          if (!meta) return false;
          const weekPlans = TRAINING_PLAN.filter(p => p.week === w);
          if (weekPlans.length === 0) return false;
          const firstDate = weekPlans[0].targetDate;
          const lastDate = weekPlans[weekPlans.length - 1].targetDate;
          return r.date >= firstDate && r.date <= lastDate;
        })
        .reduce((s, r) => s + r.distance, 0);
      result.push({ week: w, planned: Math.round(planned * 10) / 10, actual: Math.round(actual * 10) / 10 });
    }
    return result;
  },

  // --- Computed: Next planned run ---
  getNextPlannedRun() {
    const today = new Date().toISOString().split('T')[0];
    const planState = this.getPlanState();
    // Find next uncompleted run on or after today
    const next = TRAINING_PLAN.find(p =>
      p.targetDate >= today && !planState[p.id]?.completed && p.targetDistance > 0
    );
    return next || null;
  },

  // --- Suggested plan link for a date ---
  suggestPlanLink(date) {
    const planState = this.getPlanState();
    // Find closest uncompleted plan run within 2 days
    const candidates = TRAINING_PLAN
      .filter(p => !planState[p.id]?.completed && p.targetDistance > 0)
      .map(p => ({
        ...p,
        daysDiff: Math.abs(
          (new Date(date + 'T12:00:00') - new Date(p.targetDate + 'T12:00:00')) / (1000 * 60 * 60 * 24)
        ),
      }))
      .filter(p => p.daysDiff <= 2)
      .sort((a, b) => a.daysDiff - b.daysDiff);
    return candidates[0] || null;
  },

  // --- Plan adherence ---
  getPlanAdherence() {
    const planState = this.getPlanState();
    const totalRuns = TRAINING_PLAN.filter(p => p.targetDistance > 0).length;
    const completed = Object.keys(planState).filter(k => planState[k].completed).length;
    return { completed, total: totalRuns, pct: totalRuns > 0 ? Math.round((completed / totalRuns) * 100) : 0 };
  },

  // Reset
  reset() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    this._cache = { runs: null, planState: null, records: null, streaks: null };
    this.init();
    this._notify();
  },
};

// Utility used by Store (defined here to avoid circular deps)
function paceStringToSeconds(pace) {
  if (!pace) return null;
  const match = pace.match(/(\d+):(\d+)/);
  if (!match) return null;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}
