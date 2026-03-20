// localStorage persistence layer
const STORAGE_KEYS = {
  RUNS: 'bsr_runs',
  PLAN_STATE: 'bsr_plan_state',
  INITIALIZED: 'bsr_initialized',
};

const Store = {
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

  // Initialize with seed data if first visit
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this._write(STORAGE_KEYS.RUNS, SEED_RUNS);
      // Mark seeded plan runs as completed
      const planState = {};
      SEED_RUNS.forEach(r => {
        if (r.planRunId) {
          planState[r.planRunId] = { completed: true, linkedRunId: r.id };
        }
      });
      this._write(STORAGE_KEYS.PLAN_STATE, planState);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  },

  getRuns() {
    return this._read(STORAGE_KEYS.RUNS) || [];
  },

  saveRuns(runs) {
    this._write(STORAGE_KEYS.RUNS, runs);
  },

  addRun(run) {
    const runs = this.getRuns();
    runs.push(run);
    this.saveRuns(runs);
    return runs;
  },

  deleteRun(id) {
    const runs = this.getRuns().filter(r => r.id !== id);
    this.saveRuns(runs);
    // Also unlink from plan state
    const planState = this.getPlanState();
    Object.keys(planState).forEach(k => {
      if (planState[k].linkedRunId === id) {
        delete planState[k];
      }
    });
    this.savePlanState(planState);
    return runs;
  },

  updateRun(id, updates) {
    const runs = this.getRuns().map(r => r.id === id ? { ...r, ...updates } : r);
    this.saveRuns(runs);
    return runs;
  },

  getPlanState() {
    return this._read(STORAGE_KEYS.PLAN_STATE) || {};
  },

  savePlanState(state) {
    this._write(STORAGE_KEYS.PLAN_STATE, state);
  },

  togglePlanRun(planRunId, completed, linkedRunId) {
    const state = this.getPlanState();
    if (completed) {
      state[planRunId] = { completed: true, linkedRunId: linkedRunId || null };
    } else {
      delete state[planRunId];
    }
    this.savePlanState(state);
    return state;
  },

  // Reset everything (for debugging)
  reset() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    this.init();
  },
};
