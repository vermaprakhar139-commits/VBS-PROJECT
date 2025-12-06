import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import "./i18n/i18n";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient();

// Initialize auth from localStorage
useAuthStore.getState().initialize();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* IMPORTANT: basename tells react-router the app is served from /VBS-PROJECT/ on GitHub Pages */}
      <BrowserRouter basename="/VBS-PROJECT">
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
