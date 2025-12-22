import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface Props {
  title: string;
  children: React.ReactNode;
}

const LegalLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      {/* Navbar requires onAuthClick — provide safe no-op */}
      <Navbar onAuthClick={() => {}} />

      <section className="min-h-screen bg-white pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-navy mb-6">
            {title}
          </h1>

          <div className="prose prose-lg text-navy max-w-none">
            {children}
          </div>

          <div className="mt-12">
            <Link
              to="/"
              className="inline-block text-techBlue font-semibold hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LegalLayout;
