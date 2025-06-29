export type Theme = "light" | "dark" | "cozy";

export const setTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
};

export const getStoredTheme = (): Theme => {
  const stored = localStorage.getItem("theme") as Theme | null;
  return stored || "light";
};
