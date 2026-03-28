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
  {
    id: 'w1-long', week: 1, day: 'Mon', type: 'long', targetDate: '2026-03-03',
    workout: 'Long Run — 3 mi', targetDistance: 3, targetPace: '10:15–10:30/mi',
    notes: 'Effort: conversational — you should be able to speak in full sentences the whole time. Start slower than you think you need to. The goal is just time on feet and finding your rhythm. If the pace feels awkward, slow down. Run/walk is totally fine. Focus on relaxed shoulders, soft landing, easy breathing.',
  },
  {
    id: 'w1-easy1', week: 1, day: 'Wed', type: 'easy', targetDate: '2026-03-05',
    workout: 'Easy Run — 1.5 mi', targetDistance: 1.5, targetPace: '10:30–11:00/mi',
    notes: 'Pure recovery run. If your legs feel heavy from Monday, go even slower or walk sections. The only rule: don\'t go hard. Think of this as shaking out the stiffness, not building fitness. Done in about 15 minutes.',
  },
  {
    id: 'w1-easy2', week: 1, day: 'Fri', type: 'easy', targetDate: '2026-03-07',
    workout: 'Easy Run — 1.5 mi', targetDistance: 1.5, targetPace: '10:30–11:00/mi',
    notes: 'Same as Wednesday — easy and relaxed. You\'ve got a rest day tomorrow, so no need to hold back if you feel good, but don\'t force the pace. Focus on form: tall posture, arms swinging forward (not across your body), feet landing under your hips.',
  },

  // Week 2: Mar 9–15 — Building Consistency (7.5 mi total)
  {
    id: 'w2-easy1', week: 2, day: 'Tue', type: 'easy', targetDate: '2026-03-10',
    workout: 'Easy Run — 2 mi', targetDistance: 2, targetPace: '10:15–10:45/mi',
    notes: 'First run of the week — use it to shake out the weekend. RPE 3–4 out of 10. The talk test: can you recite the alphabet out loud without gasping? If not, slow down. You\'re building aerobic base here, and easy runs done too fast undermine that. Takes about 20 minutes.',
  },
  {
    id: 'w2-tempo', week: 2, day: 'Thu', type: 'tempo', targetDate: '2026-03-12',
    workout: 'Tempo Run — 2 mi (0.5 WU + 1 tempo + 0.5 CD)', targetDistance: 2, targetPace: '9:30–9:50/mi tempo',
    notes: 'Structure: 0.5 mi easy warm-up jog (10:30+), then 1 mi at tempo effort, then 0.5 mi easy cool-down. Tempo feel: comfortably hard — you can say a few words but not hold a conversation. RPE 7/10. Don\'t go out too fast on the tempo mile; the second half should feel the same effort as the first. Your logged tempo paces have been around 9:40, so that\'s right in the zone.',
  },
  {
    id: 'w2-long', week: 2, day: 'Sat', type: 'long', targetDate: '2026-03-14',
    workout: 'Long Run — 3.5 mi', targetDistance: 3.5, targetPace: '10:15–10:30/mi',
    notes: 'Slightly longer than last Saturday. Keep it truly easy — the pace should feel almost embarrassingly slow. Focus on running the whole distance without walking breaks if possible, but walk if needed. Check in at mile 2: are you still comfortable? If so, you\'re doing it right. Hydrate before you go and carry water if it\'s warm.',
  },

  // Week 3: Mar 16–22 — Adding Variety (11.5 mi total)
  {
    id: 'w3-easy1', week: 3, day: 'Mon', type: 'easy', targetDate: '2026-03-17',
    workout: 'Easy Run — 2.5 mi + 4×20 sec strides', targetDistance: 2.5, targetPace: '10:15–10:45/mi',
    notes: 'Run the 2.5 mi easy, then do 4 strides at the end. Strides: accelerate smoothly over the first 5 sec, hold fast-but-controlled for 10 sec, then ease off the last 5 sec. Think 85–90% effort, not an all-out sprint. Walk 60 sec between each. They should feel quick and light, not labored. This is your first week doing strides — don\'t overthink it.',
  },
  {
    id: 'w3-interval', week: 3, day: 'Wed', type: 'interval', targetDate: '2026-03-19',
    workout: 'Intervals — 3 mi (4×400m @ 9:00 w/ 400m jog)', targetDistance: 3, targetPace: '9:00/mi intervals',
    notes: 'Structure: 0.5 mi easy warm-up, then 4 repeats of [400m hard / 400m easy jog], then 0.5 mi cool-down. Target 400m time: ~2:15 per rep. The jog recovery is just as important as the fast part — keep moving but go genuinely easy, enough that you can catch your breath before the next rep. RPE on the hard 400s: 8/10. If rep 3 or 4 falls apart, that\'s fine — finish the distance at a manageable pace.',
  },
  {
    id: 'w3-easy2', week: 3, day: 'Fri', type: 'easy', targetDate: '2026-03-21',
    workout: 'Easy Run — 2 mi', targetDistance: 2, targetPace: '10:30/mi',
    notes: 'Recovery run between Wednesday intervals and Saturday long run. This one should feel effortless — if your legs are still sore from Wednesday, go even slower or walk/run. The purpose is blood flow and loosening up, not adding stress. About 20 minutes. Don\'t skip it just because it feels short.',
  },
  {
    id: 'w3-long', week: 3, day: 'Sat', type: 'long', targetDate: '2026-03-22',
    workout: 'Long Run — 4 mi', targetDistance: 4, targetPace: '10:00–10:30/mi',
    notes: 'First time hitting 4 miles. Break it mentally into two halves: miles 1–2 are your warm-up, miles 3–4 are proof you can hold it. If you start at 10:30 and finish at 10:15, that\'s a perfect negative split. Conversational pace the whole way. Eat something small 60–90 min beforehand if you haven\'t already.',
  },

  // Week 4: Mar 23–29 — Strength Phase (11.5 mi total, 4 runs)
  {
    id: 'w4-easy1', week: 4, day: 'Mon', type: 'easy', targetDate: '2026-03-24',
    workout: 'Easy Run — 2.5 mi + 4×20 sec strides', targetDistance: 2.5, targetPace: '10:00–10:30/mi',
    notes: 'Four-run week starts here. Keep this genuinely easy so you have legs left for Wednesday\'s tempo and Saturday\'s long run. After the run, do 4 strides: smooth acceleration, hold for 20 sec, walk 60 sec. Focus on quick turnover during the strides — short, snappy steps rather than long bounding strides.',
  },
  {
    id: 'w4-tempo', week: 4, day: 'Wed', type: 'tempo', targetDate: '2026-03-26',
    workout: 'Tempo Run — 3 mi (0.5 WU + 2 tempo + 0.5 CD)', targetDistance: 3, targetPace: '9:30–9:50/mi tempo',
    notes: 'Longer tempo than last week — 2 full miles at comfortably hard effort. Structure: 0.5 mi easy warm-up, 2 mi tempo, 0.5 mi cool-down. The challenge is holding the same effort for both tempo miles. Mile 1 will feel manageable; mile 2 should feel like work but still controlled breathing. If you need to slow to 9:55 in mile 2, that\'s fine — effort matters more than splits. Don\'t skip the cool-down jog.',
  },
  {
    id: 'w4-easy2', week: 4, day: 'Fri', type: 'easy', targetDate: '2026-03-27',
    workout: 'Easy Run — 2 mi + 4×20 sec strides', targetDistance: 2, targetPace: '10:15–10:45/mi',
    notes: 'Short shakeout before the weekend long run. Keep it very easy — Wednesday was hard, Saturday is hard. This is the bridge between them. Do the 4 strides at the end to keep the legs feeling lively without taxing them. Walk breaks are fine. The goal is to arrive Saturday feeling fresh, not fatigued.',
  },
  {
    id: 'w4-long', week: 4, day: 'Sat', type: 'long', targetDate: '2026-03-28',
    workout: 'Long Run — 5 mi', targetDistance: 5, targetPace: '10:00–10:30/mi',
    notes: 'New distance PR — longest run yet. The key: start at 10:30 for the first mile no matter how good you feel, then settle into 10:00–10:15 for miles 2–4, and just survive mile 5. Bring water. If you hit mile 3 and feel great, resist the urge to speed up — you still have 2 miles to go. After the run: eat within 30 min, get your feet up, and stretch your calves and hip flexors.',
  },

  // Week 5: Mar 30–Apr 5 — Endurance Push (14.5 mi total, +9%)
  {
    id: 'w5-easy1', week: 5, day: 'Mon', type: 'easy', targetDate: '2026-03-31',
    workout: 'Easy Run — 3 mi + 4×20 sec strides', targetDistance: 3, targetPace: '10:00–10:30/mi',
    notes: 'Back to easy after the weekend long run. Your legs might feel a little dead — that\'s normal adaptation. Don\'t push the pace. The strides at the end will help flush out any stiffness. Focus on relaxed arms, upright posture, and breathing through your nose if you can. If you\'re still sore from Saturday, drop the strides and just run easy.',
  },
  {
    id: 'w5-interval', week: 5, day: 'Wed', type: 'interval', targetDate: '2026-04-02',
    workout: 'Intervals — 3.5 mi (5×400m @ 8:45 w/ 400m jog)', targetDistance: 3.5, targetPace: '8:45/mi intervals',
    notes: 'Structure: 0.5 mi warm-up, 5 repeats of [400m at 8:45 / 400m jog], 0.5 mi cool-down. Target 400m time: ~2:11. One more rep than last time and slightly faster — your legs should be more adapted now. The jog recovery should be slow enough that you feel ready (not just willing) to go again. If rep 4 or 5 falls apart, finish the rest as easy running. Don\'t gut out bad reps at the expense of good form.',
  },
  {
    id: 'w5-easy2', week: 5, day: 'Fri', type: 'easy', targetDate: '2026-04-04',
    workout: 'Easy Run — 2 mi', targetDistance: 2, targetPace: '10:15/mi',
    notes: 'Short and easy before tomorrow\'s longest run yet. Keep this one honest — no faster than 10:15. If you feel good, that\'s tempting, but the banked energy belongs to Saturday. After you\'re done: legs up the wall for 10 minutes, drink water, eat well tonight. No alcohol. Get to bed by 10pm.',
  },
  {
    id: 'w5-long', week: 5, day: 'Sat', type: 'long', targetDate: '2026-04-05',
    workout: 'Long Run — 6 mi', targetDistance: 6, targetPace: '10:00–10:30/mi',
    notes: 'Six miles — over half the race distance. Practice everything race-day: same shoes, same socks, bring water (sip every 1.5 miles), eat a light breakfast 90 min before. Run by feel in the first half. If miles 1–3 feel easy, good — that means you\'re pacing right. Miles 4–6 should feel like steady work but never desperate. Walk 1 minute at mile 3 if you want a mental reset. Celebrate afterward.',
  },

  // Week 6: Apr 6–12 — Peak Training (16.5 mi total, PEAK WEEK)
  {
    id: 'w6-easy1', week: 6, day: 'Mon', type: 'easy', targetDate: '2026-04-07',
    workout: 'Easy Run — 3 mi + 4×20 sec strides', targetDistance: 3, targetPace: '10:00–10:30/mi',
    notes: 'Peak week starts. You\'ll have more miles this week than any other — protect your legs on the easy days. This run should feel like a warm shower, not a workout. RPE 3/10. Strides at the end: smooth and quick, not desperate. Focus on light foot contact — imagine running on hot sand. 60 sec walk between each stride.',
  },
  {
    id: 'w6-interval', week: 6, day: 'Wed', type: 'interval', targetDate: '2026-04-09',
    workout: 'Intervals — 3.5 mi (6×400m @ 8:30 w/ 400m jog)', targetDistance: 3.5, targetPace: '8:30/mi intervals',
    notes: 'Your hardest interval session of the plan. Structure: 0.5 mi warm-up, 6 repeats of [400m at 8:30 / 400m jog], 0.5 mi cool-down. Target 400m time: ~2:07. The jump to 6 reps and faster pace is significant — the first 3 should feel controlled, reps 4–6 will require focus. If your form breaks down (hunching, gasping, shuffling) on a rep, cut it short and jog. Quality over quantity. Take an extra 90 sec recovery if you need it between reps 5 and 6.',
  },
  {
    id: 'w6-easy2', week: 6, day: 'Fri', type: 'easy', targetDate: '2026-04-11',
    workout: 'Easy Run — 2 mi', targetDistance: 2, targetPace: '10:15/mi',
    notes: 'The most important easy run of the plan. You have your peak long run tomorrow — 8 miles. This 2-miler is purely to stay loose and keep the body primed without adding fatigue. No strides today. Go slow. If you\'re feeling beat up from Wednesday, it\'s OK to walk this one. Eat well tonight: carbs, some protein, plenty of water. Lay out your gear.',
  },
  {
    id: 'w6-long', week: 6, day: 'Sat', type: 'long', targetDate: '2026-04-12',
    workout: 'Long Run — 8 mi (PEAK)', targetDistance: 8, targetPace: '10:00–10:30/mi',
    notes: 'This is the summit of your training. 8 miles = 80% of race distance. Start at 10:30 for mile 1, settle into 10:15 for miles 2–5, and just finish miles 6–8 strong but controlled. Bring water and a gel or 2 dates around mile 4 if you want to practice fueling. Miles 6–8 will feel hard — that\'s the point. Run through it, not around it. When you finish, you will know you can handle race day. Recover: eat within 20 min, stretch, nap if possible.',
  },

  // Week 7: Apr 13–19 — Taper Week 1 (12 mi total, -27% from peak)
  {
    id: 'w7-easy1', week: 7, day: 'Mon', type: 'easy', targetDate: '2026-04-14',
    workout: 'Easy Run — 3 mi', targetDistance: 3, targetPace: '10:00–10:30/mi',
    notes: 'Welcome to the taper. Volume drops this week and you may feel restless, flat, or even sluggish — that\'s completely normal and called "taper madness." Your body is absorbing the fitness you built. Resist the urge to run extra miles or push the pace to feel better. Just run easy, smile, and trust the process. RPE 3–4/10, conversational the whole way.',
  },
  {
    id: 'w7-tempo', week: 7, day: 'Wed', type: 'tempo', targetDate: '2026-04-16',
    workout: 'Tempo Run — 2 mi (race pace practice)', targetDistance: 2, targetPace: '9:45–10:00/mi',
    notes: 'This is your dress rehearsal. Structure: 0.5 mi warm-up, 1 mi at goal race pace (9:45–10:00), 0.5 mi cool-down. The middle mile should feel exactly like what you want mile 3 of the race to feel like — controlled, focused, sustainable. Not easy, not desperate. This run is about ingraining the feeling, not about fitness gains. Wear what you plan to race in.',
  },
  {
    id: 'w7-easy2', week: 7, day: 'Fri', type: 'easy', targetDate: '2026-04-18',
    workout: 'Easy Run — 2 mi + 4×20 sec strides', targetDistance: 2, targetPace: '10:15/mi',
    notes: 'Short and sharp. Easy 2 miles, then 4 strides to keep the legs feeling snappy without taxing them. The strides should feel effortless and quick — almost fun. 60 sec walk between each. This is your last pre-long-run run. Keep it brief. Don\'t add miles. Don\'t push the strides. Just stay loose.',
  },
  {
    id: 'w7-long', week: 7, day: 'Sat', type: 'long', targetDate: '2026-04-19',
    workout: 'Long Run — 5 mi', targetDistance: 5, targetPace: '10:00–10:30/mi',
    notes: 'Last long run before race week. 5 miles should feel comfortable now — you ran 8 last week. Go easy and enjoy it. This is a confidence run, not a fitness run. Let yourself feel good. If the legs feel light and springy, that\'s the taper working. After this run, your hardest work is done. Soak your legs if you can. Keep eating well.',
  },

  // Week 8: Apr 20–May 3 — Race Week (proper taper + race)
  {
    id: 'w8-easy1', week: 8, day: 'Mon', type: 'easy', targetDate: '2026-04-21',
    workout: 'Easy Run — 2.5 mi', targetDistance: 2.5, targetPace: '10:00–10:30/mi',
    notes: 'Race week. Keep all runs this week short and easy — you are not gaining fitness anymore, just staying loose. This 2.5 mi should take about 25 minutes and feel like a casual walk-jog. RPE 3/10. Focus on breathing, posture, and relaxation. Start mentally preparing: visualize the start line, the feeling of the first mile, crossing Broad St.',
  },
  {
    id: 'w8-easy2', week: 8, day: 'Wed', type: 'easy', targetDate: '2026-04-23',
    workout: 'Easy Run — 2 mi', targetDistance: 2, targetPace: '10:15/mi',
    notes: 'Last proper easy run of the week. Keep it light — 20 minutes max. No strides, no tempo pushes. Drink extra water today and Thursday. Start carb-loading Thursday dinner. If you feel stiff or anxious, that\'s normal pre-race nerves. Running easy for 20 minutes will help settle both.',
  },
  {
    id: 'w8-shakeout', week: 8, day: 'Thu', type: 'easy', targetDate: '2026-04-29',
    workout: 'Shakeout Run — 1.5 mi + 4×20 sec strides', targetDistance: 1.5, targetPace: '10:00/mi',
    notes: 'Last run before the race. 15 minutes easy, then 4 quick strides to remind your legs what fast feels like. Everything should feel smooth and effortless — if it does, you\'re ready. After this run: lay out all your gear (bib, chip, shoes, socks, shorts, top, fuel, watch). Set two alarms. Eat your normal dinner, nothing adventurous. Get to bed by 9:30pm.',
  },
  {
    id: 'w8-rest', week: 8, day: 'Fri–Sat', type: 'easy', targetDate: '2026-05-01',
    workout: 'REST — Full rest days', targetDistance: 0, targetPace: '—',
    notes: 'Full rest. Walk normally, don\'t stand for hours. Fri dinner: big pasta or rice meal with protein. Sat: light carb-heavy meals throughout the day, no big dinner. Hydrate all day both days — your urine should be pale yellow. Avoid alcohol. Charge your watch. Confirm your bib pickup if needed. Bus to start: check the BSR schedule, arrive at Navy Yard early. Visualize your race.',
  },
  {
    id: 'w8-race', week: 8, day: 'Sun', type: 'race', targetDate: '2026-05-03',
    workout: 'RACE DAY — Broad Street Run 10 mi', targetDistance: 10, targetPace: '9:45–10:00/mi goal',
    notes: 'Goal: 1:37–1:40 finish (9:45–10:00/mi). Strategy: Miles 1–2 will feel easy — hold back, run 10:00–10:15. Miles 3–6 settle into goal pace, 9:45–10:00, find your groove. Miles 7–8 stay focused, this is where the race gets real. Miles 9–10 leave it all on the course. The crowd on Broad St will carry you. Start conservative. Do not go out with the fast pack. The first 2 miles of BSR notoriously pull people out too fast. You trained for this — trust it.',
  },
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
  {
    id: 'seed-7',
    date: '2026-03-22',
    distance: 4.22,
    pace: '10:12',
    duration: '43',
    type: 'long',
    location: 'Philadelphia',
    notes: 'Hard start felt a groove after like 2',
    effort: 7,
    feel: 3,
    weather: { condition: 'sunny', temp: '60' },
    splits: ['10:40', '10:02', '9:53', '10:01'],
    planRunId: 'w3-long',
    createdAt: '2026-03-22T18:08:10.689Z',
    updatedAt: '2026-03-22T18:08:10.689Z',
  },
  {
    id: 'seed-8',
    date: '2026-03-24',
    distance: 2.5,
    pace: '10:48',
    duration: '27:02',
    type: 'easy',
    location: 'Philadelphia',
    notes: '',
    effort: 4,
    feel: 4,
    weather: { condition: 'sunny', temp: '49' },
    splits: ['10:49', '10:44'],
    planRunId: 'w4-easy1',
    createdAt: '2026-03-24T20:35:52.302Z',
    updatedAt: '2026-03-24T20:35:52.302Z',
  },
  {
    id: 'seed-9',
    date: '2026-03-26',
    distance: 3,
    pace: '9:27',
    duration: '28:52',
    type: 'tempo',
    location: 'Philadelphia',
    notes: 'Mile 1 and 4 are really just the splits for the 0.5 mile warm up and cooldown',
    effort: 8,
    feel: 3,
    weather: { condition: 'sunny', temp: '55' },
    splits: ['9:50', '8:45', '8:54', '11:07'],
    planRunId: 'w4-tempo',
    createdAt: '2026-03-25T21:39:55.896Z',
    updatedAt: '2026-03-25T21:39:55.896Z',
  },
  {
    id: 'seed-10',
    date: '2026-03-27',
    distance: 2,
    pace: '10:56',
    duration: '23:12',
    type: 'easy',
    location: 'Philadelphia',
    notes: '',
    effort: 4,
    feel: 4,
    weather: { condition: 'cloudy', temp: '51' },
    splits: ['10:54', '10:56'],
    planRunId: 'w4-easy2',
    createdAt: '2026-03-27T21:41:23.346Z',
    updatedAt: '2026-03-27T21:41:23.346Z',
  },
];

// Coach notes — updated each time Ryan syncs progress
// Each entry corresponds to a sync checkpoint
const COACH_NOTES = [
  {
    id: 'note-1',
    date: '2026-03-22',
    title: 'Week 3 Complete',
    progress: 'First 3 weeks in the books with 6 runs and 16.4 miles total. You went from 1.5 mi comfortable to a 4.22 mi long run — that\'s nearly tripling your distance in 3 weeks while staying in the 10:00\u201310:45 range. The negative split on Mar 22 (10:40 down to 10:01) shows you\'re learning to settle in and find a groove mid-run, which is exactly what you want for a 10-miler.',
    nextRun: 'Week 4 opens with an easy 2.5 mi on Monday. Keep it truly conversational \u2014 this is a recovery week opener after your longest run yet.',
    planAdjustment: null,
  },
  {
    id: 'note-2',
    date: '2026-03-26',
    title: 'Tempo Pace is Dialed In',
    progress: 'That Week 4 tempo was excellent. Your middle splits (8:45, 8:54) are right in the interval zone, not just tempo \u2014 which means your tempo ceiling is higher than expected. The warm-up at 9:50 and cool-down at 11:07 show good discipline in not starting too hot and properly winding down. 9 runs logged, 23.6 total miles, and you\'re 3-for-3 in Week 4.',
    nextRun: 'Week 4 long run on Saturday \u2014 5 miles, your first time past 4.22. This is the biggest single-week distance jump in the plan (+0.78 mi). Keep pace at 10:00\u201310:30, don\'t chase the tempo fitness. If mile 4 feels hard, slow down rather than push through.',
    planAdjustment: 'No changes needed. Your paces are consistently faster than target across all run types. If the 5-miler feels comfortable, you\'re in great shape for the Week 5 jump to 6.',
  },
  {
    id: 'note-3',
    date: '2026-03-28',
    title: '5-Miler Day',
    progress: 'Smart recovery run Friday \u2014 2 mi at 10:56 with dead-even splits (10:54, 10:56) and feeling good (4/4). That\u2019s exactly how you should feel two days after a tempo: low effort, legs turning over, nothing forced. You\u2019re now 10 runs in with 25.6 total miles. Week 4 has been your most complete week yet \u2014 easy, tempo, AND recovery all logged before the long run.',
    nextRun: 'The big one: 5 miles today (Saturday). This is your longest run ever in this training cycle. Target 10:00\u201310:15 pace. Don\u2019t start faster than 10:20 for the first mile even if you feel great \u2014 save that energy for miles 3\u20135. Your Mar 22 long run showed you tend to start hard and settle in, so deliberately hold back early.',
    planAdjustment: 'Everything on track. After the 5-miler, Week 5 jumps to a 6 mi long run \u2014 only +1 mi, well within the 1.5 mi/week cap. Your tempo and easy paces are both ahead of schedule, so the fitness is there. Just respect the distance.',
  },
];
