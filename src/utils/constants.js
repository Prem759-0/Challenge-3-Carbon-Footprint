// =============================================
// CARBON EMISSION FACTORS (kg CO2e)
// Based on EPA & DEFRA 2023 Emission Factors
// =============================================

export const EMISSION_FACTORS = {
  transport: {
    petrol_car:   { label: 'Petrol Car',   factor: 0.411, unit: 'per mile' },
    diesel_car:   { label: 'Diesel Car',   factor: 0.350, unit: 'per mile' },
    hybrid_car:   { label: 'Hybrid Car',   factor: 0.220, unit: 'per mile' },
    electric_car: { label: 'Electric Car', factor: 0.053, unit: 'per mile' },
    bus:          { label: 'Bus',          factor: 0.089, unit: 'per mile' },
    train:        { label: 'Train',        factor: 0.041, unit: 'per mile' },
    flight_eco:   { label: 'Flight (Economy)', factor: 0.255, unit: 'per mile' },
    flight_biz:   { label: 'Flight (Business)', factor: 0.765, unit: 'per mile' },
    motorbike:    { label: 'Motorbike',    factor: 0.113, unit: 'per mile' },
  },
  energy: {
    electricity: { label: 'Electricity',  factor: 0.233, unit: 'per kWh' },
    natural_gas: { label: 'Natural Gas',  factor: 0.203, unit: 'per kWh' },
    heating_oil: { label: 'Heating Oil',  factor: 0.298, unit: 'per kWh' },
  },
  diet: {
    vegan:      { label: 'Vegan',         factor: 1.5,   unit: 'per day' },
    vegetarian: { label: 'Vegetarian',    factor: 2.5,   unit: 'per day' },
    low_meat:   { label: 'Low Meat',      factor: 4.5,   unit: 'per day' },
    medium_meat:{ label: 'Medium Meat',   factor: 7.2,   unit: 'per day' },
    high_meat:  { label: 'High Meat',     factor: 10.0,  unit: 'per day' },
  },
  shopping: {
    clothes:       { label: 'Clothing Item',  factor: 6.3,  unit: 'per item' },
    electronics:   { label: 'Electronics',    factor: 70.0, unit: 'per item' },
    general:       { label: 'General Purchase', factor: 0.5, unit: 'per £' },
    appliance:     { label: 'Appliance',      factor: 90.0, unit: 'per item' },
  },
  waste: {
    landfill: { label: 'Landfill Waste',  factor: 0.57,  unit: 'per kg' },
    recycled:  { label: 'Recycled Waste', factor: 0.021, unit: 'per kg' },
  },
};

// =============================================
// PHYSICAL EQUIVALENCIES
// =============================================
export const EQUIVALENCIES = [
  { icon: '🌲', label: 'Trees needed to absorb', calc: (kg) => (kg / 21).toFixed(1), suffix: 'trees/year' },
  { icon: '✈️', label: 'London–NY flights equiv.', calc: (kg) => (kg / 986).toFixed(2), suffix: 'flights' },
  { icon: '📱', label: 'Smartphone charges',       calc: (kg) => Math.round(kg / 0.008).toLocaleString(), suffix: 'charges' },
  { icon: '🚗', label: 'Miles driven (petrol car)', calc: (kg) => Math.round(kg / 0.411).toLocaleString(), suffix: 'miles' },
  { icon: '🗑️', label: 'Rubbish bags to landfill', calc: (kg) => Math.round(kg / 0.57 / 10).toLocaleString(), suffix: 'bags' },
  { icon: '💡', label: 'LED bulb hours lit',       calc: (kg) => Math.round(kg / 0.00001).toLocaleString(), suffix: 'hrs' },
];

// =============================================
// LEVEL SYSTEM
// =============================================
export const LEVELS = [
  { level: 1, name: 'Sprout',           icon: '🌱', xpRequired: 0,    color: '#6ee7b7' },
  { level: 2, name: 'Seedling',         icon: '🌿', xpRequired: 100,  color: '#34d399' },
  { level: 3, name: 'Sapling',          icon: '🌳', xpRequired: 300,  color: '#10b981' },
  { level: 4, name: 'Young Oak',        icon: '🌲', xpRequired: 700,  color: '#059669' },
  { level: 5, name: 'Forest Guardian',  icon: '🏔️', xpRequired: 1500, color: '#047857' },
];

export const getLevelFromXP = (xp) => {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
  }
  return current;
};

export const getNextLevel = (xp) => {
  for (const lvl of LEVELS) {
    if (xp < lvl.xpRequired) return lvl;
  }
  return null;
};

// =============================================
// BADGES
// =============================================
export const BADGES = [
  { id: 'first_log',     icon: '📝', name: 'First Step',      desc: 'Logged your first activity',      xp: 20  },
  { id: 'transit_hero',  icon: '🚌', name: 'Transit Hero',    desc: 'Chose public transit over driving', xp: 30 },
  { id: 'green_plate',   icon: '🥗', name: 'Green Plate',     desc: 'Logged a vegan or vegetarian day', xp: 30 },
  { id: 'solar_sage',    icon: '☀️', name: 'Solar Sage',      desc: 'Reduced home energy usage by 20%',  xp: 50 },
  { id: 'zero_waste',    icon: '♻️', name: 'Zero Waste',      desc: 'Recycled instead of landfill',      xp: 30 },
  { id: 'tree_planter',  icon: '🌳', name: 'Tree Planter',    desc: 'Planted your first virtual tree',   xp: 40 },
  { id: 'streak_7',      icon: '🔥', name: 'Week Streak',     desc: '7-day logging streak',              xp: 60 },
  { id: 'eco_warrior',   icon: '⚔️', name: 'Eco Warrior',    desc: 'Completed 10 challenges',           xp: 100 },
  { id: 'forest_5',      icon: '🏕️', name: 'Mini Forest',    desc: 'Planted 5 virtual trees',           xp: 80  },
  { id: 'coach_chat',    icon: '🤖', name: 'Coach Consulted', desc: 'First EcoCoach chat session',       xp: 20  },
];

// =============================================
// CHALLENGES
// =============================================
export const CHALLENGES = [
  { id: 'c1',  icon: '🚶', title: 'Walk or Cycle Today',    desc: 'Skip motorized transport for a day',       xp: 40,  co2Saved: 3.5,   category: 'transport' },
  { id: 'c2',  icon: '🥗', title: 'Meatless Monday',         desc: 'Eat only plant-based food today',          xp: 35,  co2Saved: 5.5,   category: 'diet' },
  { id: 'c3',  icon: '🚿', title: 'Short Shower Challenge',  desc: 'Keep showers under 4 minutes',            xp: 25,  co2Saved: 0.8,   category: 'energy' },
  { id: 'c4',  icon: '♻️', title: 'Recycle Everything',     desc: 'Sort all your waste for recycling',        xp: 30,  co2Saved: 2.0,   category: 'waste' },
  { id: 'c5',  icon: '🛒', title: 'Buy Nothing Day',         desc: 'Avoid all non-essential purchases',        xp: 30,  co2Saved: 4.2,   category: 'shopping' },
  { id: 'c6',  icon: '🚌', title: 'Public Transit Day',      desc: 'Use only public transit today',            xp: 40,  co2Saved: 6.8,   category: 'transport' },
  { id: 'c7',  icon: '💡', title: 'Lights Off',              desc: 'Turn off all unused lights for a day',    xp: 20,  co2Saved: 0.5,   category: 'energy' },
  { id: 'c8',  icon: '🌱', title: 'Plant-based Protein',     desc: 'Replace all meat with legumes today',     xp: 35,  co2Saved: 4.5,   category: 'diet' },
  { id: 'c9',  icon: '🧴', title: "Refill Don't Rebuy",      desc: 'Use a refillable bottle all day',         xp: 20,  co2Saved: 0.3,   category: 'shopping' },
  { id: 'c10', icon: '🌤️', title: 'Hang Dry Laundry',       desc: 'Skip the tumble dryer today',             xp: 25,  co2Saved: 1.8,   category: 'energy' },
];

// =============================================
// LEADERBOARD MOCK DATA
// =============================================
export const LEADERBOARD = [
  { rank: 1,  name: 'Aria S.',    avatar: '🌿', country: '🇩🇪', xp: 2340, co2Saved: 124 },
  { rank: 2,  name: 'Ben K.',     avatar: '🌊', country: '🇸🇪', xp: 2180, co2Saved: 116 },
  { rank: 3,  name: 'Chen L.',    avatar: '☀️', country: '🇯🇵', xp: 1920, co2Saved: 98  },
  { rank: 4,  name: 'Diana M.',   avatar: '🌺', country: '🇳🇱', xp: 1740, co2Saved: 87  },
  { rank: 5,  name: 'Ethan P.',   avatar: '🔥', country: '🇨🇦', xp: 1620, co2Saved: 81  },
  { rank: 6,  name: 'Fatima A.',  avatar: '🌙', country: '🇦🇪', xp: 1480, co2Saved: 74  },
  { rank: 7,  name: 'George T.',  avatar: '⚡', country: '🇬🇧', xp: 1310, co2Saved: 67  },
  { rank: 8,  name: 'Hana Y.',    avatar: '🌸', country: '🇰🇷', xp: 1200, co2Saved: 61  },
  { rank: 9,  name: 'Ivan B.',    avatar: '❄️', country: '🇷🇺', xp: 1050, co2Saved: 54  },
  { rank: 10, name: 'Julia R.',   avatar: '🌈', country: '🇧🇷', xp: 980,  co2Saved: 50  },
  { rank: 11, name: 'You',        avatar: '⭐', country: '🌍', xp: 0,    co2Saved: 0,  isUser: true },
];

// =============================================
// ECOCOACH AI RESPONSES
// =============================================
export const COACH_RESPONSES = {
  greeting: [
    "Hi! I'm your personal EcoCoach 🌱 I've analyzed your recent activity logs. How can I help you reduce your footprint today?",
    "Welcome back! 🌍 I can see you've been tracking your carbon footprint. What would you like to work on?",
  ],
  transport: [
    "Great question on transport! Switching from a petrol car to public transit for a 10-mile commute saves ~3.7 kg CO₂ per trip — that's 500+ kg/year! 🚌",
    "If you flew economy class on a 1000-mile route, that's about 255 kg CO₂. A train equivalent would be just 41 kg. Huge difference! 🚄",
    "Electric vehicles are 87% cleaner than petrol cars on average, especially in countries with renewable energy grids. Consider switching! ⚡",
  ],
  diet: [
    "Diet is the second-biggest factor for most people. Going fully plant-based saves ~1.5 tonnes CO₂ per year compared to a high-meat diet! 🥗",
    "Just two meatless days per week reduces your annual food footprint by ~22%. Small changes make a massive impact! 🌱",
    "Did you know dairy has 3× the emissions of plant-based milks? Switching your morning coffee is a easy first step ☕",
  ],
  energy: [
    "Home energy is often the largest single source of household emissions. Switching to a green energy tariff instantly reduces that to near zero! 💚",
    "LED bulbs use 85% less energy than incandescents. If you haven't switched, that's one of the fastest wins available! 💡",
    "Reducing your home temperature by 1°C can cut heating emissions by up to 8%. Try a smart thermostat! 🌡️",
  ],
  general: [
    "Based on your logs, your biggest impact area is transport. Even switching one car trip per week to a bus would save ~150 kg CO₂/year! 📊",
    "Your footprint is trending downward this week — great job! Keep focusing on your diet choices for the next big leap. 🎯",
    "The global average is ~4 tonnes CO₂/year per person. The Paris Agreement target is ~2.3 tonnes. You're on the right track! 🌍",
    "Offsetting matters but reducing direct emissions is always better than buying offsets. Let's find more ways to cut first! 🔍",
  ],
};

export const OFFSET_ACTIONS = [
  { id: 'tree',   icon: '🌳', name: 'Plant a Tree',         cost: 50,  co2: 21,   desc: 'One tree absorbs ~21 kg CO₂/year' },
  { id: 'solar',  icon: '☀️', name: 'Solar Panel (1 hour)', cost: 30,  co2: 0.5,  desc: 'Funds 1 hour of community solar energy' },
  { id: 'wind',   icon: '💨', name: 'Wind Farm (1 hour)',   cost: 25,  co2: 0.4,  desc: 'Funds 1 hour of wind generation' },
  { id: 'forest', icon: '🌲', name: 'Forest Conservation',  cost: 120, co2: 500,  desc: 'Protects 1 acre of rainforest for a year' },
  { id: 'kelp',   icon: '🌊', name: 'Kelp Forest Restore',  cost: 80,  co2: 50,   desc: 'Restores ocean CO₂ absorption capacity' },
];

export const CATEGORIES = ['transport', 'energy', 'diet', 'shopping', 'waste'];

export const CATEGORY_COLORS = {
  transport: '#3b82f6',
  energy:    '#f59e0b',
  diet:      '#10b981',
  shopping:  '#8b5cf6',
  waste:     '#f43f5e',
};

export const CATEGORY_ICONS = {
  transport: '🚗',
  energy:    '⚡',
  diet:      '🥗',
  shopping:  '🛍️',
  waste:     '♻️',
};
