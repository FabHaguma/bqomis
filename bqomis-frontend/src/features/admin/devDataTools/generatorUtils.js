export const KIGALI_DISTRICTS = ['Gasabo', 'Kicukiro', 'Nyarugenge']; // Case-sensitive match with your data
export const POPULAR_SERVICES = {
  DEPOSITS: "Deposit", // Match exact service names from your DB
  WITHDRAWALS: "Withdrawal"
};

export const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getRandomDate = (baseDateStr, minDaysOffset, maxDaysOffset) => {
  const base = baseDateStr ? new Date(baseDateStr + 'T00:00:00') : new Date(); // Use current date if no base
  const offset = Math.floor(Math.random() * (maxDaysOffset - minDaysOffset + 1)) + minDaysOffset;
  const newDate = new Date(base.setDate(base.getDate() + offset));
  return newDate.toISOString().split('T')[0]; // yyyy-MM-dd
};

export const getRandomTimeSlot = (startHour, endHour, intervalMinutes) => {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      if (h === endHour -1 && m >= (60 - intervalMinutes +1) && intervalMinutes > 0) continue; // Avoid last slot like 16:45 if interval is 15 and endHour is 17
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  if (!slots.length) return `${String(startHour).padStart(2, '0')}:00`; // Fallback
  return getRandomElement(slots);
};

// Simple weighted random for services (can be improved for more complex weighting)
export const getWeightedRandomService = (availableServicesForBranch, skewPopularity) => {
  if (!availableServicesForBranch || availableServicesForBranch.length === 0) return null;

  if (!skewPopularity) {
    return getRandomElement(availableServicesForBranch);
  }

  const popularServiceNames = Object.values(POPULAR_SERVICES);
  const deposits = availableServicesForBranch.find(s => s.serviceName === POPULAR_SERVICES.DEPOSITS);
  const withdrawals = availableServicesForBranch.find(s => s.serviceName === POPULAR_SERVICES.WITHDRAWALS);
  const otherServices = availableServicesForBranch.filter(s => !popularServiceNames.includes(s.serviceName));

  const rand = Math.random() * 100; // 0-99.99...

  if (withdrawals && rand < 40) { // 40% chance for withdrawals
    return withdrawals;
  } else if (deposits && rand < 60) { // Next 20% chance for deposits (40 + 20)
    return deposits;
  } else if (otherServices.length > 0) { // Remaining 40% for others
    return getRandomElement(otherServices);
  } else if (deposits) { // Fallback if only popular exist
    return deposits;
  } else if (withdrawals) {
    return withdrawals;
  }
  return getRandomElement(availableServicesForBranch); // Absolute fallback
};