import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Scanner from './components/Scanner'; // <--- 1. NEW IMPORT HERE
import About from './components/About';
import Features from './components/Features';
import Technology from './components/Technology';
import UseCases from './components/UseCases';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="font-sans antialiased text-navy selection:bg-techBlue/20">
      <Navbar />
      <main>
        <Hero />
        <Scanner /> {/* <--- 2. INSERT COMPONENT HERE */}
        <About />
        <Features />
        <Technology />
        <UseCases />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;