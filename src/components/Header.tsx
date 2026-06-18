import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, Clock, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  isAdmin,
  onAdminClick,
  onLogout
}: HeaderProps) {
  const [time, setTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { id: 'gallery', label: 'EXHIBITION ARCHIVE' },
    { id: 'services', label: 'WORK RANGE' },
    { id: 'philosophy', label: 'PHILOSOPHY' }
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-dark-bg/85 backdrop-blur-md border-b border-dark-border py-4 px-6 md:px-12 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Identity / Logo */}
        <div 
          className="flex flex-col cursor-pointer select-none group"
          onClick={() => handleNavClick('gallery')}
        >
          <div className="flex items-center gap-1.5">
            <span className="font-syne text-2xl font-black tracking-wide text-white group-hover:text-accent transition-colors duration-300">
              ORANGE
            </span>
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          </div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-dark-muted font-medium uppercase mt-0.5 group-hover:text-white transition-colors">
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

          {/* Admin Panel Access Button */}
          {isAdmin ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-accent/40 bg-accent-dim text-accent font-mono text-[10px] tracking-wider font-semibold cursor-pointer hover:bg-accent hover:text-black transition-all duration-300 group"
              id="header-logout-btn"
            >
              <Unlock size={11} />
              <span>LOGOUT [ADMIN]</span>
            </button>
          ) : (
            <button
              onClick={onAdminClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-dark-border bg-dark-card text-dark-muted font-mono text-[10px] tracking-wider font-semibold cursor-pointer hover:border-accent hover:text-accent transition-all duration-300 group"
              id="header-admin-btn"
            >
              <Lock size={11} className="group-hover:text-accent transition-colors" />
              <span>WORKSPACE [1111]</span>
            </button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          {isAdmin && (
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
          {isAdmin ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="flex items-center gap-2 text-accent font-mono text-xs tracking-wider"
            >
              <Unlock size={12} />
              <span>LOGOUT ADMIN</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onAdminClick();
              }}
              className="flex items-center gap-2 text-dark-muted hover:text-accent font-mono text-xs tracking-wider transition-colors"
            >
              <Lock size={12} />
              <span>ADMIN WORKSPACE</span>
            </button>
          )}
        </motion.div>
      )}
    </header>
  );
}
