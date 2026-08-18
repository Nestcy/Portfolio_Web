import React, { useState, useEffect } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { TimelineSection } from './components/TimelineSection';
import { CertificationsSection } from './components/CertificationsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { CommandPalette } from './components/CommandPalette';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

function PortfolioApp() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if url contains ?admin=true, #admin, ?console=true, or ?key=admin
    const checkAdminQuery = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (
        urlParams.get('admin') === 'true' ||
        urlParams.get('console') === 'true' ||
        window.location.hash === '#admin' ||
        window.location.hash === '#console'
      ) {
        setAdminOpen(true);
      }
    };

    checkAdminQuery();
    window.addEventListener('hashchange', checkAdminQuery);

    // Global Owner Secret Shortcut: Cmd + Shift + A (Mac) or Ctrl + Shift + A (Windows/Linux)
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setAdminOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminQuery);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (adminOpen) {
      setAdminOpen(false);
    }
    setActiveSection(sectionId);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0d0c0b] text-[#dfdbd7] selection:bg-[#ff4d00] selection:text-[#0d0c0b] font-geist antialiased">
      
      {/* If Admin Mode is active, show Admin Dashboard view */}
      {adminOpen ? (
        <AdminDashboard
          onClose={() => setAdminOpen(false)}
          onViewLiveSection={scrollToSection}
        />
      ) : (
        <>
          {/* Fixed Navigation Bar */}
          <Navbar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenResume={() => setResumeOpen(true)}
            onOpenAdmin={() => setAdminOpen(true)}
          />

          {/* Main Page Sections */}
          <main>
            {/* Landing Hero */}
            <Hero
              onViewProjects={() => scrollToSection('projects')}
              onOpenResume={() => setResumeOpen(true)}
            />

            {/* Featured Projects Showcase */}
            <ProjectsSection />

            {/* Categorized Skills & Frameworks Matrix */}
            <SkillsSection />

            {/* Career Journey Timeline */}
            <TimelineSection />

            {/* Industry Certifications */}
            <CertificationsSection />

            {/* Engineer Profile & Philosophy */}
            <AboutSection />

            {/* Direct Contact & Inquiries */}
            <ContactSection onOpenResume={() => setResumeOpen(true)} />
          </main>

          {/* Footer */}
          <Footer
            onSelectSection={scrollToSection}
            onOpenAdmin={() => setAdminOpen(true)}
          />
        </>
      )}

      {/* Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectSection={scrollToSection}
        onOpenResume={() => setResumeOpen(true)}
        onOpenAdmin={() => {
          setCommandPaletteOpen(false);
          setAdminOpen(true);
        }}
      />

      {/* Curriculum Vitae Resume Modal */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
