export const Regex = {
  Password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
