export const getShortName = (name: string): string => {
  if (!name.trim()) return "";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export const getRecentYears = (count = 3): number[] => {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: count + 1 }, (_, index) => currentYear - index);
};