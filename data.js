// BSR Training Plan — Revised by Coach Review
// 8 weeks: Mar 3 – May 3, 2026
// Race: Broad Street Run 10-Miler, Philadelphia (point-to-point, bus to start)

const RACE_DATE = '2026-05-03';
const PLAN_START = '2026-03-03';

const PACE_ZONES = {
  easy:     { min: '10:00', max: '10:45', label: 'Easy', description: 'Conversational pace' },
  tempo:    { min: '9:30',  max: '9:50',  label: 'Tempo', description: 'Comfortably hard' },
  interval: { min: '8:30',  max: '9:00',  label: 'Interval', description: 'Hard effort, controlled' },
  long:     { min: '10:00', max: '10:30', label: 'Long Run', description: 'Easy + steady' },
  race:     { min: '9:45',  max: '10:00', label: 'Race Goal', description: '~1:37–1:40 finish' },
};

const RUN_TYPES = ['easy', 'tempo', 'interval', 'long', 'race'];

const FEEL_OPTIONS = [
  { value: 5, emoji: '\u{1F929}', label: 'Great' },
  { value: 4, emoji: '\u{1F60A}', label: 'Good' },
  { value: 3, emoji: '\u{1F610}', label: 'OK' },
  { value: 2, emoji: '\u{1F615}', label: 'Rough' },
  { value: 1, emoji: '\u{1F635}', label: 'Terrible' },
];

const WEATHER_OPTIONS = [
  { value: 'sunny',   icon: '\u2600\uFE0F',  label: 'Sunny' },
  { value: 'cloudy',  icon: '\u2601\uFE0F',  label: 'Cloudy' },
  { value: 'rainy',   icon: '\u{1F327}\uFE0F', label: 'Rainy' },
  { value: 'windy',   icon: '\u{1F32C}\uFE0F', label: 'Windy' },
  { value: 'cold',    icon: '\u2744\uFE0F',  label: 'Cold' },
  { value: 'hot',     icon: '\u{1F525}',     label: 'Hot' },
];

const WEEK_META = [
  {
    week: 1,
    title: 'Base Building',
    subtitle: 'Find your rhythm',
    dates: 'Mar 3–8',
    theme: 'Establish the habit. Every mile counts.',
  },
  {
    week: 2,
    title: 'Building Consistency',
    subtitle: 'Show up, then show up again',
    dates: 'Mar 9–15',
    theme: 'You\'re building the engine. Trust the easy pace.',
  },
  {
    week: 3,
    title: 'Adding Variety',
    subtitle: 'New gears, same engine',
    dates: 'Mar 16–22',
    theme: 'Intervals teach your legs to change speeds. Strides start this week!',
  },
  {
    week: 4,
    title: 'Strength Phase',
    subtitle: 'Building the foundation',
    dates: 'Mar 23–29',
    theme: '4 runs this week. You\'re ready for this volume.',
  },
  {
    week: 5,
    title: 'Endurance Push',
    subtitle: 'You\'re tougher than you think',
    dates: 'Mar 30–Apr 5',
    theme: 'The long run is where race confidence is built.',
  },
  {
    week: 6,
    title: 'Peak Training',
    subtitle: 'This is the summit',
    dates: 'Apr 6–12',
    theme: 'Peak long run this week — 8 miles. After this, it\'s all downhill to race day.',
  },
  {
    week: 7,
    title: 'Taper Week 1',
    subtitle: 'Trust the training',
    dates: 'Apr 13–19',
    theme: 'Less is more. Your body is absorbing the work. Stay sharp, stay easy.',
  },
  {
    week: 8,
    title: 'Race Week',
    subtitle: 'You earned this',
    dates: 'Apr 20–May 3',
    theme: 'Keep it light. Visualize. Hydrate. You\'re ready.',
    raceNotes: [
      'BSR is point-to-point: bus from the Navy Yard to the start at Broad & Fisher Park',
      'Arrive early — buses start at 6:00 AM, race at 8:00 AM',
      'Lay out everything the night before: bib, shoes, fuel, layers',
      'Nothing new on race day — no new shoes, no new food',
      'Start conservative. Negative split the second half.',
    ],
  },
];

// Revised 8-week plan with coach modifications
// Key changes: smoother mileage progression, realistic paces, proper taper
const TRAINING_PLAN = [
  // Week 1: Mar 3–8 — Base Building (6 mi total)
  { id: 'w1-long',     week: 1, day: 'Mon', type: 'long',     targetDate: '2026-03-03', workout: 'Long Run — 3 mi',          targetDistance: 3,   targetPace: '10:15–10:30/mi', notes: 'First long run. Find a comfortable rhythm.' },
  { id: 'w1-easy1',    week: 1, day: 'Wed', type: 'easy',     targetDate: '2026-03-05', workout: 'Easy Run — 1.5 mi',        targetDistance: 1.5, targetPace: '10:30–11:00/mi', notes: 'Recovery pace. Walk breaks are fine.' },
  { id: 'w1-easy2',    week: 1, day: 'Fri', type: 'easy',     targetDate: '2026-03-07', workout: 'Easy Run — 1.5 mi',        targetDistance: 1.5, targetPace: '10:30–11:00/mi', notes: '' },

  // Week 2: Mar 9–15 — Building Consistency (7.5 mi total)
  { id: 'w2-easy1',    week: 2, day: 'Tue', type: 'easy',     targetDate: '2026-03-10', workout: 'Easy Run — 2 mi',          targetDistance: 2,   targetPace: '10:15–10:45/mi', notes: '' },
  { id: 'w2-tempo',    week: 2, day: 'Thu', type: 'tempo',    targetDate: '2026-03-12', workout: 'Tempo Run — 2 mi (0.5 WU + 1 tempo + 0.5 CD)', targetDistance: 2, targetPace: '9:30–9:50/mi tempo', notes: 'First tempo effort. Don\'t chase pace, find the feel.' },
  { id: 'w2-long',     week: 2, day: 'Sat', type: 'long',     targetDate: '2026-03-14', workout: 'Long Run — 3.5 mi',        targetDistance: 3.5, targetPace: '10:15–10:30/mi', notes: '' },

  // Week 3: Mar 16–22 — Adding Variety (11.5 mi total, +8% from W2 seed-adjusted)
  { id: 'w3-easy1',    week: 3, day: 'Mon', type: 'easy',     targetDate: '2026-03-17', workout: 'Easy Run — 2.5 mi + 4×100m strides', targetDistance: 2.5, targetPace: '10:15–10:45/mi', notes: 'Strides: 100m at fast-but-controlled effort, full recovery walk between.' },
  { id: 'w3-interval', week: 3, day: 'Wed', type: 'interval', targetDate: '2026-03-19', workout: 'Intervals — 3 mi (4×400m @ 9:00 w/ 400m jog)', targetDistance: 3, targetPace: '9:00/mi intervals', notes: '400m = 2:15. Jog recovery should be truly easy.' },
  { id: 'w3-easy2',    week: 3, day: 'Fri', type: 'easy',     targetDate: '2026-03-21', workout: 'Easy Run — 2 mi',          targetDistance: 2,   targetPace: '10:30/mi', notes: '' },
  { id: 'w3-long',     week: 3, day: 'Sat', type: 'long',     targetDate: '2026-03-22', workout: 'Long Run — 4 mi',          targetDistance: 4,   targetPace: '10:00–10:30/mi', notes: '' },

  // Week 4: Mar 23–29 — Strength Phase (11.5 mi total, 4 runs, +0% — consolidation week)
  { id: 'w4-easy1',    week: 4, day: 'Mon', type: 'easy',     targetDate: '2026-03-24', workout: 'Easy Run — 2.5 mi + 4×100m strides', targetDistance: 2.5, targetPace: '10:00–10:30/mi', notes: '' },
  { id: 'w4-tempo',    week: 4, day: 'Wed', type: 'tempo',    targetDate: '2026-03-26', workout: 'Tempo Run — 3 mi (0.5 WU + 2 tempo + 0.5 CD)', targetDistance: 3, targetPace: '9:30–9:50/mi tempo', notes: 'Hold tempo effort for the full 2 mi middle section.' },
  { id: 'w4-easy2',    week: 4, day: 'Fri', type: 'easy',     targetDate: '2026-03-27', workout: 'Easy Run — 2 mi + 4×100m strides', targetDistance: 2, targetPace: '10:15–10:45/mi', notes: 'Strides help with turnover without adding fatigue.' },
  { id: 'w4-long',     week: 4, day: 'Sat', type: 'long',     targetDate: '2026-03-28', workout: 'Long Run — 5 mi',          targetDistance: 5,   targetPace: '10:00–10:30/mi', notes: 'New longest run! Take it easy, especially the last mile.' },

  // Week 5: Mar 30–Apr 5 — Endurance Push (14.5 mi total, +9%)
  { id: 'w5-easy1',    week: 5, day: 'Mon', type: 'easy',     targetDate: '2026-03-31', workout: 'Easy Run — 3 mi + 4×100m strides', targetDistance: 3, targetPace: '10:00–10:30/mi', notes: '' },
  { id: 'w5-interval', week: 5, day: 'Wed', type: 'interval', targetDate: '2026-04-02', workout: 'Intervals — 3.5 mi (5×400m @ 8:45 w/ 400m jog)', targetDistance: 3.5, targetPace: '8:45/mi intervals', notes: '5 reps this week. Save 6× for next week.' },
  { id: 'w5-easy2',    week: 5, day: 'Fri', type: 'easy',     targetDate: '2026-04-04', workout: 'Easy Run — 2 mi',          targetDistance: 2,   targetPace: '10:15/mi', notes: 'Legs-up-the-wall for 10 min after this one.' },
  { id: 'w5-long',     week: 5, day: 'Sat', type: 'long',     targetDate: '2026-04-05', workout: 'Long Run — 6 mi',          targetDistance: 6,   targetPace: '10:00–10:30/mi', notes: 'Practice race-day hydration. Bring water.' },

  // Week 6: Apr 6–12 — Peak Training (16.5 mi total, PEAK WEEK)
  { id: 'w6-easy1',    week: 6, day: 'Mon', type: 'easy',     targetDate: '2026-04-07', workout: 'Easy Run — 3 mi + 4×100m strides', targetDistance: 3, targetPace: '10:00–10:30/mi', notes: '' },
  { id: 'w6-interval', week: 6, day: 'Wed', type: 'interval', targetDate: '2026-04-09', workout: 'Intervals — 3.5 mi (6×400m @ 8:30 w/ 400m jog)', targetDistance: 3.5, targetPace: '8:30/mi intervals', notes: '6 reps — your sharpest interval session.' },
  { id: 'w6-easy2',    week: 6, day: 'Fri', type: 'easy',     targetDate: '2026-04-11', workout: 'Easy Run — 2 mi',          targetDistance: 2,   targetPace: '10:15/mi', notes: 'Keep this one truly easy. Big run tomorrow.' },
  { id: 'w6-long',     week: 6, day: 'Sat', type: 'long',     targetDate: '2026-04-12', workout: 'Long Run — 8 mi (PEAK)',   targetDistance: 8,   targetPace: '10:00–10:30/mi', notes: 'PEAK LONG RUN. After this, you\'re tapering. You\'ve got this.' },

  // Week 7: Apr 13–19 — Taper Week 1 (12 mi total, -27% from peak)
  { id: 'w7-easy1',    week: 7, day: 'Mon', type: 'easy',     targetDate: '2026-04-14', workout: 'Easy Run — 3 mi',          targetDistance: 3,   targetPace: '10:00–10:30/mi', notes: 'You may feel restless with less volume. That\'s normal.' },
  { id: 'w7-tempo',    week: 7, day: 'Wed', type: 'tempo',    targetDate: '2026-04-16', workout: 'Tempo Run — 2 mi (race pace practice)', targetDistance: 2, targetPace: '9:45–10:00/mi', notes: 'Practice your race pace feel. This is a dress rehearsal.' },
  { id: 'w7-easy2',    week: 7, day: 'Fri', type: 'easy',     targetDate: '2026-04-18', workout: 'Easy Run — 2 mi + 4×100m strides', targetDistance: 2, targetPace: '10:15/mi', notes: 'Stay loose. Strides keep the legs snappy.' },
  { id: 'w7-long',     week: 7, day: 'Sat', type: 'long',     targetDate: '2026-04-19', workout: 'Long Run — 5 mi',          targetDistance: 5,   targetPace: '10:00–10:30/mi', notes: 'Last long effort before race week. Enjoy it.' },

  // Week 8: Apr 20–May 3 — Race Week (proper taper + race)
  { id: 'w8-easy1',    week: 8, day: 'Mon', type: 'easy',     targetDate: '2026-04-21', workout: 'Easy Run — 2.5 mi',        targetDistance: 2.5, targetPace: '10:00–10:30/mi', notes: 'Keep moving. Light and easy.' },
  { id: 'w8-easy2',    week: 8, day: 'Wed', type: 'easy',     targetDate: '2026-04-23', workout: 'Easy Run — 2 mi',          targetDistance: 2,   targetPace: '10:15/mi', notes: '' },
  { id: 'w8-shakeout', week: 8, day: 'Thu', type: 'easy',     targetDate: '2026-04-29', workout: 'Shakeout Run — 1.5 mi + 4×100m strides', targetDistance: 1.5, targetPace: '10:00/mi', notes: 'Last run before the race. Short and crisp. Lay out your gear tonight.' },
  { id: 'w8-rest',     week: 8, day: 'Fri–Sat', type: 'easy', targetDate: '2026-05-01', workout: 'REST — Full rest days',    targetDistance: 0,   targetPace: '—', notes: 'Hydrate. Carb-load Friday dinner. Visualize the course. Sleep early.' },
  { id: 'w8-race',     week: 8, day: 'Sun', type: 'race',     targetDate: '2026-05-03', workout: 'RACE DAY — Broad Street Run 10 mi', targetDistance: 10, targetPace: '9:45–10:00/mi goal', notes: 'Target: ~1:37–1:40. Start conservative, negative split the back half. You trained for this.' },
];

// Week labels for backward compat
const WEEK_LABELS = WEEK_META.map(w => `Week ${w.week} — ${w.title} (${w.dates})`);

// Pre-populated completed runs (Ryan's actual logged data)
const SEED_RUNS = [
  {
    id: 'seed-1',
    date: '2026-03-03',
    distance: 3.00,
    pace: '10:29',
    duration: '31:32',
    type: 'long',
    location: '',
    notes: '',
    effort: null,
    feel: null,
    weather: null,
    splits: [],
    planRunId: 'w1-long',
    createdAt: '2026-03-03T18:00:00Z',
    updatedAt: '2026-03-03T18:00:00Z',
  },
  {
    id: 'seed-2',
    date: '2026-03-07',
    distance: 1.53,
    pace: '9:38',
    duration: '14:44',
    type: 'easy',
    location: 'Philadelphia',
    notes: '',
    effort: null,
    feel: null,
    weather: null,
    splits: [],
    planRunId: 'w1-easy2',
    createdAt: '2026-03-07T18:00:00Z',
    updatedAt: '2026-03-07T18:00:00Z',
  },
  {
    id: 'seed-3',
    date: '2026-03-11',
    distance: 2.53,
    pace: '10:43',
    duration: '27:07',
    type: 'easy',
    location: 'Philadelphia',
    notes: '',
    effort: null,
    feel: null,
    weather: null,
    splits: [],
    planRunId: 'w2-easy1',
    createdAt: '2026-03-11T18:00:00Z',
    updatedAt: '2026-03-11T18:00:00Z',
  },
  {
    id: 'seed-4',
    date: '2026-03-14',
    distance: 3.24,
    pace: '9:49',
    duration: '31:50',
    type: 'long',
    location: 'Scranton, PA',
    notes: '',
    effort: null,
    feel: null,
    weather: null,
    splits: [],
    planRunId: 'w2-long',
    createdAt: '2026-03-14T18:00:00Z',
    updatedAt: '2026-03-14T18:00:00Z',
  },
  {
    id: 'seed-5',
    date: '2026-03-16',
    distance: 3.03,
    pace: '10:21',
    duration: '31:21',
    type: 'easy',
    location: '',
    notes: '',
    effort: null,
    feel: null,
    weather: null,
    splits: [],
    planRunId: 'w3-easy1',
    createdAt: '2026-03-16T18:00:00Z',
    updatedAt: '2026-03-16T18:00:00Z',
  },
  {
    id: 'seed-6',
    date: '2026-03-19',
    distance: 3.08,
    pace: '10:10',
    duration: '31:24',
    type: 'interval',
    location: 'Philadelphia',
    notes: '',
    effort: null,
    feel: null,
    weather: null,
    splits: [],
    planRunId: 'w3-interval',
    createdAt: '2026-03-19T18:00:00Z',
    updatedAt: '2026-03-19T18:00:00Z',
  },
];
