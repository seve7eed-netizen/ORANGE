import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, Clock, Menu, X } from 'lucide-react';
import { isDevelopmentWorkspace } from '../utils/isDev';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  scrollY?: number;
}

export default function Header({
  currentTab,
  setCurrentTab,
  isAdmin,
  onAdminClick,
  onLogout,
  scrollY = 0
}: HeaderProps) {
  const [time, setTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDev = isDevelopmentWorkspace();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'home', label: 'HOME' },
    { id: 'philosophy', label: 'PHILOSOPHY' },
    { id: 'gallery', label: 'EXHIBITION ARCHIVE' }
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  // On landing tab, fade in header based on scroll position
  const isLandingActive = currentTab === 'home';
  const headerOpacity = isLandingActive ? Math.min(scrollY / 180, 1) : 1;
  const isHeaderGhost = isLandingActive && scrollY < 12;

  return (
    <header 
      style={{ 
        opacity: headerOpacity,
        pointerEvents: isHeaderGhost ? 'none' : 'auto' 
      }}
      className="fixed top-0 left-0 w-full z-50 bg-dark-bg/85 backdrop-blur-md border-b border-dark-border py-4 px-6 md:px-12 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Identity / Logo */}
        <div 
          className="flex flex-col cursor-pointer select-none group"
          onClick={() => handleNavClick('home')}
        >
          <div className="flex items-center gap-1">
            <span className="font-syncopate text-base font-bold tracking-wider text-white group-hover:text-accent transition-all duration-300">
              ORANGE
            </span>
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse ml-0.5 mb-1" />
          </div>
          <span className="font-antonio text-[10px] tracking-[0.35em] text-dark-muted font-bold uppercase mt-0.5 group-hover:text-white transition-colors duration-300">
            ON THE TRACK
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="relative font-outfit text-xs tracking-[0.15em] font-medium transition-colors py-2 text-left select-none outline-none group cursor-pointer"
                id={`nav-${item.id}`}
              >
                <span className={`${isActive ? 'text-accent' : 'text-dark-muted group-hover:text-white'} transition-colors duration-300`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="header-active-indicator"
                    className="absolute bottom-0 left-0 w-full h-[1.5px] bg-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Status Actions & Clock Grid */}
        <div className="hidden lg:flex items-center gap-6 border-l border-dark-border pl-6">
          {/* Slogan Live Status Meter */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-dark-muted">
            <Clock size={11} className="text-accent" />
            <span className="text-white font-medium select-none">{time}</span>
            <span className="text-dark-border">|</span>
            <span className="text-dark-muted select-none">TRACK RUNNING</span>
          </div>

          {/* Admin Panel Access Button - Only rendered in personal Dev Workspace */}
          {isDev && (
            currentTab === 'admin' && isAdmin ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-red-950/40 bg-red-950/20 text-red-400 font-mono text-[10px] tracking-wider font-semibold cursor-pointer hover:bg-red-900/35 hover:text-red-300 transition-all duration-300 group"
                id="header-logout-btn"
              >
                <Unlock size={11} className="text-red-400" />
                <span>LOGOUT</span>
              </button>
            ) : (
              <button
                onClick={onAdminClick}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border font-mono text-[10px] tracking-wider font-semibold cursor-pointer transition-all duration-300 group ${
                  isAdmin 
                  ? 'border-accent/40 bg-accent-dim text-accent hover:bg-accent hover:text-black' 
                  : 'border-dark-border bg-dark-card text-dark-muted hover:border-accent hover:text-accent'
                }`}
                id="header-admin-btn"
              >
                {isAdmin ? <Unlock size={11} /> : <Lock size={11} className="group-hover:text-accent transition-colors" />}
                <span>WORKSPACE</span>
              </button>
            )
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          {isDev && isAdmin && (
            <span className="text-accent font-mono text-[10px] px-2 py-0.5 rounded-xs border border-accent/20 bg-accent-dim">
              ADMIN
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-1 hover:text-accent cursor-pointer outline-none"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="left-0 top-full absolute w-full bg-dark-bg border-b border-dark-border py-6 px-6 flex flex-col gap-5 md:hidden"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-left font-outfit text-sm tracking-[0.12em] font-medium py-1 ${
                currentTab === item.id ? 'text-accent' : 'text-dark-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="h-[1px] bg-dark-border my-1" />

          {/* Mobile Admin Mode trigger */}
          {isDev && (
            currentTab === 'admin' && isAdmin ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-2 text-red-400 font-mono text-xs tracking-wider cursor-pointer"
              >
                <Unlock size={12} className="text-red-400" />
                <span>LOGOUT</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdminClick();
                }}
                className={`flex items-center gap-2 font-mono text-xs tracking-wider transition-colors cursor-pointer ${
                  isAdmin ? 'text-accent hover:text-white' : 'text-dark-muted hover:text-accent'
                }`}
              >
                {isAdmin ? <Unlock size={12} /> : <Lock size={12} />}
                <span>WORKSPACE</span>
              </button>
            )
          )}
        </motion.div>
      )}
    </header>
  );
}
