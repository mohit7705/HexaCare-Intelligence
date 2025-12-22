import React from "react";
import LegalLayout from "./LegalLayout";

const TermsOfService: React.FC = () => {
  return (
    <LegalLayout title="Terms of Service">
      <p>
        By accessing or using HexaCare Intelligence, you agree to comply with
        these terms.
      </p>

      <p>
        The platform provides AI-assisted health screening insights and does not
        replace professional medical advice.
      </p>

      <p>
        Users are responsible for the accuracy of the information they provide.
      </p>
    </LegalLayout>
  );
};

export default TermsOfService;
