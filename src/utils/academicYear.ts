export function getCurrentAcademicYear(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  if (month >= 7) {
    return `${year}/${year + 1}`;
  }
  return `${year - 1}/${year}`;
}

export function isValidAcademicYear(year: string): boolean {
  if (!year) return false;
  const trimmed = year.trim();
  if (!/^\d{4}\/\d{4}$/.test(trimmed)) return false;
  const [start, end] = trimmed.split("/").map((v) => parseInt(v, 10));
  return end === start + 1;
}

export function getAcademicYearOptions(
  centerYear?: string
): { label: string; value: string }[] {
  const currentStr = centerYear || getCurrentAcademicYear();
  const baseStart =
    parseInt(currentStr.split("/")[0], 10) || new Date().getFullYear();

  const years: string[] = [];
  for (let i = -3; i <= 3; i++) {
    const start = baseStart + i;
    years.push(`${start}/${start + 1}`);
  }

  // Ensure unique and sort descending (newest first)
  const unique = Array.from(new Set(years)).sort().reverse();
  return unique.map((yr) => ({
    label: `${yr}`,
    value: yr,
  }));
}
