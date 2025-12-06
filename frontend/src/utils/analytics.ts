// Google Analytics / Plausible integration
export const initAnalytics = () => {
  if (import.meta.env.PROD) {
    // Google Analytics
    if (import.meta.env.VITE_GA_ID) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag("js", new Date());
      gtag("config", import.meta.env.VITE_GA_ID);
    }

    // Plausible (alternative)
    if (import.meta.env.VITE_PLAUSIBLE_DOMAIN) {
      const script = document.createElement("script");
      script.defer = true;
      script.setAttribute("data-domain", import.meta.env.VITE_PLAUSIBLE_DOMAIN);
      script.src = "https://plausible.io/js/script.js";
      document.head.appendChild(script);
    }
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    // Google Analytics
    if (window.gtag) {
      window.gtag("event", eventName, properties);
    }
    // Plausible
    if (window.plausible) {
      window.plausible(eventName, { props: properties });
    }
  }
};

// Add to main.tsx:
// import { initAnalytics } from "./utils/analytics";
// initAnalytics();
