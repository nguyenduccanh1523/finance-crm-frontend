// Environment variables configuration
export const ENV = {
  STRIPE_PUBLISHABLE_KEY:
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
    "",
  API_BASE_URL:
    import.meta.env.VITE_API_URL ||
    import.meta.env.REACT_APP_API_URL ||
    "http://localhost:3000/api",
  APP_ENV: import.meta.env.MODE || "development",
};

// Validate required env vars
if (!ENV.STRIPE_PUBLISHABLE_KEY) {
  console.warn(
    "⚠️  VITE_STRIPE_PUBLISHABLE_KEY is not set. Payment functionality will not work.",
  );
}
