// localStorage keys
const KEYS = {
  LOGS:       'ct_logs',
  USER:       'ct_user',
  CHALLENGES: 'ct_challenges',
  COACH_MSGS: 'ct_coach_msgs',
  OFFSETS:    'ct_offsets',
  ONBOARDED:  'ct_onboarded',
  FOREST:     'ct_forest',
};

// ---- User Profile ----
export const getUser = () => {
  const raw = localStorage.getItem(KEYS.USER);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const saveUser = (user) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const defaultUser = (name = 'EcoHero') => ({
  name,
  xp: 0,
  streak: 0,
  lastLogDate: null,
  badges: [],
  baselineKg: 0,
  targetKg: 0,
  createdAt: Date.now(),
});

// ---- Activity Logs ----
export const getLogs = () => {
  const raw = localStorage.getItem(KEYS.LOGS);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
};

export const saveLogs = (logs) => {
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
};

export const addLog = (entry) => {
  const logs = getLogs();
  const newLog = { ...entry, id: Date.now(), timestamp: Date.now() };
  const updated = [newLog, ...logs];
  saveLogs(updated);
  return newLog;
};

export const deleteLog = (id) => {
  const logs = getLogs().filter(l => l.id !== id);
  saveLogs(logs);
};

// ---- Challenges ----
export const getCompletedChallenges = () => {
  const raw = localStorage.getItem(KEYS.CHALLENGES);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
};

export const completeChallenge = (challengeId) => {
  const done = getCompletedChallenges();
  if (!done.includes(challengeId)) {
    done.push(challengeId);
    localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(done));
  }
};

// ---- Coach Messages ----
export const getCoachMessages = () => {
  const raw = localStorage.getItem(KEYS.COACH_MSGS);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
};

export const saveCoachMessages = (msgs) => {
  localStorage.setItem(KEYS.COACH_MSGS, JSON.stringify(msgs));
};

// ---- Offsets / Forest ----
export const getOffsets = () => {
  const raw = localStorage.getItem(KEYS.OFFSETS);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
};

export const addOffset = (offset) => {
  const offsets = getOffsets();
  const newOffset = { ...offset, id: Date.now(), timestamp: Date.now() };
  offsets.push(newOffset);
  localStorage.setItem(KEYS.OFFSETS, JSON.stringify(offsets));
  return newOffset;
};

export const getForest = () => {
  const raw = localStorage.getItem(KEYS.FOREST);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
};

export const addTree = (tree) => {
  const forest = getForest();
  forest.push({ ...tree, id: Date.now(), plantedAt: Date.now() });
  localStorage.setItem(KEYS.FOREST, JSON.stringify(forest));
};

// ---- Onboarding ----
export const isOnboarded = () => localStorage.getItem(KEYS.ONBOARDED) === 'true';
export const setOnboarded = () => localStorage.setItem(KEYS.ONBOARDED, 'true');

// ---- Computed Helpers ----
export const getTotalKg = (logs) => logs.reduce((sum, l) => sum + (l.kg || 0), 0);

export const getTotalOffsetKg = (offsets) => offsets.reduce((sum, o) => sum + (o.co2 || o.kg || 0), 0);

export const getKgByCategory = (logs) => {
  return logs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + (log.kg || 0);
    return acc;
  }, {});
};

export const getWeeklyData = (logs) => {
  const now = Date.now();
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const start = now - (7 - i) * 7 * 86400000;
    const end   = now - (6 - i) * 7 * 86400000;
    const total = logs
      .filter(l => l.timestamp >= start && l.timestamp < end)
      .reduce((s, l) => s + l.kg, 0);
    const d = new Date(start);
    return {
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      kg: parseFloat(total.toFixed(1)),
    };
  });
  return weeks;
};

// seed mock data for demo purposes
export const seedMockData = () => {
  if (getLogs().length > 0) return;

  const now = Date.now();
  const mockLogs = [
    { id: 1, timestamp: now - 1 * 86400000, category: 'transport', subcategory: 'petrol_car',   label: 'Petrol Car 15 mi',   kg: 6.2,  amount: 15, unit: 'miles' },
    { id: 2, timestamp: now - 2 * 86400000, category: 'diet',      subcategory: 'medium_meat',  label: 'Medium Meat Day',    kg: 7.2,  amount: 1,  unit: 'day' },
    { id: 3, timestamp: now - 2 * 86400000, category: 'energy',    subcategory: 'electricity',  label: 'Electricity 12 kWh', kg: 2.8,  amount: 12, unit: 'kWh' },
    { id: 4, timestamp: now - 3 * 86400000, category: 'transport', subcategory: 'bus',           label: 'Bus 8 mi',           kg: 0.7,  amount: 8,  unit: 'miles' },
    { id: 5, timestamp: now - 4 * 86400000, category: 'diet',      subcategory: 'vegetarian',   label: 'Vegetarian Day',     kg: 2.5,  amount: 1,  unit: 'day' },
    { id: 6, timestamp: now - 5 * 86400000, category: 'shopping',  subcategory: 'clothes',      label: 'Bought Clothes',     kg: 6.3,  amount: 1,  unit: 'item' },
    { id: 7, timestamp: now - 6 * 86400000, category: 'waste',     subcategory: 'landfill',     label: 'Landfill 2 kg',      kg: 1.1,  amount: 2,  unit: 'kg' },
    { id: 8, timestamp: now - 7 * 86400000, category: 'transport', subcategory: 'petrol_car',   label: 'Petrol Car 22 mi',   kg: 9.0,  amount: 22, unit: 'miles' },
    { id: 9, timestamp: now - 8 * 86400000, category: 'diet',      subcategory: 'high_meat',    label: 'High Meat Day',      kg: 10.0, amount: 1,  unit: 'day' },
    { id: 10,timestamp: now - 9 * 86400000, category: 'energy',    subcategory: 'natural_gas',  label: 'Gas Heating 20 kWh', kg: 4.1,  amount: 20, unit: 'kWh' },
    { id: 11,timestamp: now - 10*86400000, category: 'transport', subcategory: 'train',         label: 'Train 30 mi',        kg: 1.2,  amount: 30, unit: 'miles' },
    { id: 12,timestamp: now - 11*86400000, category: 'diet',      subcategory: 'vegan',         label: 'Vegan Day',          kg: 1.5,  amount: 1,  unit: 'day' },
    { id: 13,timestamp: now - 12*86400000, category: 'shopping',  subcategory: 'electronics',  label: 'Bought Gadget',      kg: 70.0, amount: 1,  unit: 'item' },
    { id: 14,timestamp: now - 13*86400000, category: 'waste',     subcategory: 'recycled',     label: 'Recycled 5 kg',      kg: 0.1,  amount: 5,  unit: 'kg' },
    { id: 15,timestamp: now - 14*86400000, category: 'transport', subcategory: 'petrol_car',   label: 'Petrol Car 10 mi',   kg: 4.1,  amount: 10, unit: 'miles' },
  ];
  saveLogs(mockLogs);

  const mockOffsets = [
    { id: 1, timestamp: now - 3 * 86400000, name: 'Plant a Tree', icon: '🌳', co2: 21, cost: 50 },
  ];
  localStorage.setItem('ct_offsets', JSON.stringify(mockOffsets));

  const forest = [{ id: 1, plantedAt: now - 3 * 86400000, emoji: '🌱', stage: 1 }];
  localStorage.setItem('ct_forest', JSON.stringify(forest));
};
