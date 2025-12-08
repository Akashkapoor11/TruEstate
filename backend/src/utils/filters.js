/*
This utils file provides helper functions used by previous non-streaming code.
The streaming service uses its own inline filter for efficiency; however these helpers remain
for compatibility and potential future use.
*/

function containsIgnoreCase(haystack, needle) {
  if (!haystack || !needle) return false;
  return haystack.toString().toLowerCase().includes(needle.toLowerCase());
}

function inListIgnoreCase(value, list) {
  if (!list || list.length === 0) return true;
  if (!value) return false;
  const v = value.toString().toLowerCase();
  return list.some((item) => v === item.toString().toLowerCase());
}

function dateInRange(dateStr, startDate, endDate) {
  if (!startDate && !endDate) return true;
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;

  if (startDate && d < new Date(startDate)) return false;
  if (endDate && d > new Date(endDate)) return false;

  return true;
}

function tagsMatch(recordTags, filterTags) {
  if (!filterTags || filterTags.length === 0) return true;
  if (!recordTags) return false;

  if (Array.isArray(recordTags)) {
    const lowerSet = new Set(recordTags.map((t) => String(t).toLowerCase()));
    return filterTags.some((ft) => lowerSet.has(String(ft).toLowerCase()));
  } else {
    const recordStr = String(recordTags).toLowerCase();
    return filterTags.some((tag) => recordStr.includes(String(tag).toLowerCase()));
  }
}

module.exports = {
  containsIgnoreCase,
  inListIgnoreCase,
  dateInRange,
  tagsMatch
};
