import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Domains from '../components/Domains';
import WhyJoin from '../components/WhyJoin';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import CircuitDivider from '../components/CircuitDivider';
import UpcomingEventSection from '../components/UpcomingEventSection';
import TechOrbitSection from '../components/TechOrbitSection';

export default function LandingPage() {
  return (
    <>
      {/* Hero: uses its own full-bleed dark-capable background */}
      <Hero />

      {/* About — section A */}
      <About sectionClass="sec-a" />

      <CircuitDivider />

      {/* Upcoming Event Section */}
      <UpcomingEventSection />

      <CircuitDivider />

      {/* Tech Orbit — additive section before Domains */}
      <TechOrbitSection />

      {/* Domains — section B */}
      <Domains sectionClass="sec-b" />

      <CircuitDivider />

      {/* Why Join — section C (mint tint) */}
      <WhyJoin sectionClass="sec-c" />

      <CircuitDivider />

      {/* FAQ — section B */}
      <FAQ sectionClass="sec-b" />

      {/* Contact — section A */}
      <Contact sectionClass="sec-a" />
    </>
  );
}
