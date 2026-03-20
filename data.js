// Training plan: 8 weeks, Mar 3 – May 3, 2026
// Run types: easy, tempo, interval, long
// Long run progression: 3, 3.5, 4, 5, 6, 7, 9, race (10)

const RACE_DATE = '2026-05-03';
const PLAN_START = '2026-03-03';

const TRAINING_PLAN = [
  // Week 1: Mar 3–8
  { id: 'w1-long',     week: 1, type: 'long',     targetDate: '2026-03-03', workout: 'Long Run – 3 mi',          targetDistance: 3,   targetPace: '10:30/mi' },
  { id: 'w1-easy1',    week: 1, type: 'easy',     targetDate: '2026-03-05', workout: 'Easy Run – 1.5 mi',        targetDistance: 1.5, targetPace: '10:30–11:00/mi' },
  { id: 'w1-easy2',    week: 1, type: 'easy',     targetDate: '2026-03-07', workout: 'Easy Run – 1.5 mi',        targetDistance: 1.5, targetPace: '10:30–11:00/mi' },

  // Week 2: Mar 9–15
  { id: 'w2-easy1',    week: 2, type: 'easy',     targetDate: '2026-03-10', workout: 'Easy Run – 2 mi',          targetDistance: 2,   targetPace: '10:15–10:45/mi' },
  { id: 'w2-tempo',    week: 2, type: 'tempo',    targetDate: '2026-03-12', workout: 'Tempo Run – 2 mi (0.5 WU + 1 tempo + 0.5 CD)', targetDistance: 2, targetPace: '9:30–9:45/mi tempo' },
  { id: 'w2-long',     week: 2, type: 'long',     targetDate: '2026-03-14', workout: 'Long Run – 3.5 mi',        targetDistance: 3.5, targetPace: '10:15–10:30/mi' },

  // Week 3: Mar 16–22
  { id: 'w3-easy1',    week: 3, type: 'easy',     targetDate: '2026-03-17', workout: 'Easy Run – 2.5 mi',        targetDistance: 2.5, targetPace: '10:15–10:45/mi' },
  { id: 'w3-interval', week: 3, type: 'interval', targetDate: '2026-03-19', workout: 'Intervals – 3 mi (4×400m @ 9:00 w/ 400m jog)', targetDistance: 3, targetPace: '9:00/mi intervals' },
  { id: 'w3-easy2',    week: 3, type: 'easy',     targetDate: '2026-03-21', workout: 'Easy Run – 2 mi',          targetDistance: 2,   targetPace: '10:30/mi' },
  { id: 'w3-long',     week: 3, type: 'long',     targetDate: '2026-03-22', workout: 'Long Run – 4 mi',          targetDistance: 4,   targetPace: '10:15–10:30/mi' },

  // Week 4: Mar 23–29
  { id: 'w4-easy1',    week: 4, type: 'easy',     targetDate: '2026-03-24', workout: 'Easy Run – 2.5 mi',        targetDistance: 2.5, targetPace: '10:00–10:30/mi' },
  { id: 'w4-tempo',    week: 4, type: 'tempo',    targetDate: '2026-03-26', workout: 'Tempo Run – 3 mi (0.5 WU + 2 tempo + 0.5 CD)', targetDistance: 3, targetPace: '9:15–9:30/mi tempo' },
  { id: 'w4-long',     week: 4, type: 'long',     targetDate: '2026-03-28', workout: 'Long Run – 5 mi',          targetDistance: 5,   targetPace: '10:00–10:15/mi' },

  // Week 5: Mar 30–Apr 5
  { id: 'w5-easy1',    week: 5, type: 'easy',     targetDate: '2026-03-31', workout: 'Easy Run – 3 mi',          targetDistance: 3,   targetPace: '10:00–10:30/mi' },
  { id: 'w5-interval', week: 5, type: 'interval', targetDate: '2026-04-02', workout: 'Intervals – 3.5 mi (5×400m @ 8:45 w/ 400m jog)', targetDistance: 3.5, targetPace: '8:45/mi intervals' },
  { id: 'w5-easy2',    week: 5, type: 'easy',     targetDate: '2026-04-04', workout: 'Easy Run – 2.5 mi',        targetDistance: 2.5, targetPace: '10:15/mi' },
  { id: 'w5-long',     week: 5, type: 'long',     targetDate: '2026-04-05', workout: 'Long Run – 6 mi',          targetDistance: 6,   targetPace: '10:00–10:15/mi' },

  // Week 6: Apr 6–12
  { id: 'w6-easy1',    week: 6, type: 'easy',     targetDate: '2026-04-07', workout: 'Easy Run – 3 mi',          targetDistance: 3,   targetPace: '9:45–10:15/mi' },
  { id: 'w6-tempo',    week: 6, type: 'tempo',    targetDate: '2026-04-09', workout: 'Tempo Run – 4 mi (0.5 WU + 3 tempo + 0.5 CD)', targetDistance: 4, targetPace: '9:00–9:15/mi tempo' },
  { id: 'w6-easy2',    week: 6, type: 'easy',     targetDate: '2026-04-11', workout: 'Easy Run – 2.5 mi',        targetDistance: 2.5, targetPace: '10:15/mi' },
  { id: 'w6-long',     week: 6, type: 'long',     targetDate: '2026-04-12', workout: 'Long Run – 7 mi',          targetDistance: 7,   targetPace: '9:45–10:00/mi' },

  // Week 7: Apr 13–19 (peak week, 9 mi long per Ryan's preference)
  { id: 'w7-easy1',    week: 7, type: 'easy',     targetDate: '2026-04-14', workout: 'Easy Run – 3 mi',          targetDistance: 3,   targetPace: '9:45–10:15/mi' },
  { id: 'w7-interval', week: 7, type: 'interval', targetDate: '2026-04-16', workout: 'Intervals – 4 mi (6×400m @ 8:30 w/ 400m jog)', targetDistance: 4, targetPace: '8:30/mi intervals' },
  { id: 'w7-easy2',    week: 7, type: 'easy',     targetDate: '2026-04-18', workout: 'Easy Run – 3 mi',          targetDistance: 3,   targetPace: '10:00/mi' },
  { id: 'w7-long',     week: 7, type: 'long',     targetDate: '2026-04-19', workout: 'Long Run – 9 mi',          targetDistance: 9,   targetPace: '9:45–10:00/mi' },

  // Week 8: Apr 20–May 3 (taper + race)
  { id: 'w8-easy1',    week: 8, type: 'easy',     targetDate: '2026-04-21', workout: 'Easy Run – 3 mi',          targetDistance: 3,   targetPace: '9:45–10:00/mi' },
  { id: 'w8-tempo',    week: 8, type: 'tempo',    targetDate: '2026-04-23', workout: 'Tempo Run – 2 mi (short shakeout)', targetDistance: 2, targetPace: '9:15/mi' },
  { id: 'w8-easy2',    week: 8, type: 'easy',     targetDate: '2026-04-25', workout: 'Easy Run – 2 mi',          targetDistance: 2,   targetPace: '10:00/mi' },
  { id: 'w8-easy3',    week: 8, type: 'easy',     targetDate: '2026-04-29', workout: 'Shakeout Run – 1.5 mi',    targetDistance: 1.5, targetPace: '10:00/mi' },
  { id: 'w8-race',     week: 8, type: 'long',     targetDate: '2026-05-03', workout: 'RACE DAY – Broad Street Run 10 mi', targetDistance: 10, targetPace: '9:30–10:00/mi goal' },
];

// Week labels
const WEEK_LABELS = [
  'Week 1 – Base Building (Mar 3–8)',
  'Week 2 – Building Consistency (Mar 9–15)',
  'Week 3 – Adding Variety (Mar 16–22)',
  'Week 4 – Strength Phase (Mar 23–29)',
  'Week 5 – Endurance Push (Mar 30–Apr 5)',
  'Week 6 – Peak Training (Apr 6–12)',
  'Week 7 – Peak Week (Apr 13–19)',
  'Week 8 – Taper & Race (Apr 20–May 3)',
];

// Pre-populated completed runs
const SEED_RUNS = [
  {
    id: 'seed-1',
    date: '2026-03-03',
    distance: 3.00,
    pace: '10:29/mi',
    duration: '31:32',
    location: '',
    notes: '',
    planRunId: 'w1-long',
  },
  {
    id: 'seed-2',
    date: '2026-03-07',
    distance: 1.53,
    pace: '9:38/mi',
    duration: '14:44',
    location: 'Philadelphia',
    notes: '',
    planRunId: 'w1-easy2',
  },
  {
    id: 'seed-3',
    date: '2026-03-11',
    distance: 2.53,
    pace: '10:43/mi',
    duration: '27:07',
    location: 'Philadelphia',
    notes: '',
    planRunId: 'w2-easy1',
  },
  {
    id: 'seed-4',
    date: '2026-03-14',
    distance: 3.24,
    pace: '9:49/mi',
    duration: '31:50',
    location: 'Scranton, PA',
    notes: '',
    planRunId: 'w2-long',
  },
  {
    id: 'seed-5',
    date: '2026-03-16',
    distance: 3.03,
    pace: '10:21/mi',
    duration: '31:21',
    location: '',
    notes: '',
    planRunId: 'w3-easy1',
  },
  {
    id: 'seed-6',
    date: '2026-03-19',
    distance: 3.08,
    pace: '10:10/mi',
    duration: '31:24',
    location: 'Philadelphia',
    notes: '',
    planRunId: 'w3-interval',
  },
];
