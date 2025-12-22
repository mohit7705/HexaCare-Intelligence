import React from "react";
import LegalLayout from "./LegalLayout";

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        HexaCare Intelligence respects your privacy and is committed to
        protecting your personal data.
      </p>

      <p>
        We do not sell, rent, or misuse user information. Data submitted through
        this platform is used strictly for communication, service improvement,
        and security purposes.
      </p>

      <p>
        Our systems are designed following industry best practices for data
        protection, encryption, and access control.
      </p>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
