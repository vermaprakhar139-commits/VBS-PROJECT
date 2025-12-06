import React from "react";

import { useParams } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
  return (
    <div className="p-6">
      Reset Password (placeholder), token: {token}
    </div>
  );
};

export default ResetPasswordPage;