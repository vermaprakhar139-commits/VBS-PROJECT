import React from "react";
import { useRoutes } from "react-router-dom";
import routes from "./router";
import ErrorBoundary from "./components/common/ErrorBoundary";

const App: React.FC = () => {
  const element = useRoutes(routes);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{element}</div>
    </ErrorBoundary>
  );
};

export default App;