import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./router";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Import HomePage directly as a safe fallback when routes return null
// (it's okay to import directly here; router already lazy-loads it for normal navigation)
import HomePage from "./pages/HomePage";

const App: React.FC = () => {
  const element = useRoutes(routes);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* If router returns null (no match), show HomePage as a fallback */}
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          {element ?? <HomePage />}
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default App;
