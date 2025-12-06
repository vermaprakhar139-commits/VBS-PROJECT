import React from "react";

import { useParams } from "react-router-dom";

const VerifyEmailPage: React.FC = () => {
  const { token } = useParams();
  return (
    <div className="p-6">
      Verify Email (placeholder), token: {token}
    </div>
  );
};

export default VerifyEmailPage;