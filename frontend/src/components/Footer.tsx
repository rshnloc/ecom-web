import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Headphones, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Value propositions banner */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Simulated Express</h4>
                <p className="text-[11px] text-slate-400">Free delivery on orders $100+</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Zero Risk Test Data</h4>
                <p className="text-[11px] text-slate-400">No real billing or cards required</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                <RefreshCw size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">30-Day Evaluation</h4>
                <p className="text-[11px] text-slate-400">Instant test returns and refunds</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sky-400">
                <Headphones size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Test Documentation</h4>
                <p className="text-[11px] text-slate-400">Full REST API Swagger /docs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag size={16} />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white font-display">
                APEX<span className="text-indigo-400 font-light">STORE</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              An advanced, modern e-commerce platform built on FastAPI (Python) and React (TypeScript), engineered for performance, modularity, and clean architectural design.
            </p>
            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold block mb-0.5">Synthetic & Safe by Design</span>
              All catalog items, customer accounts, order histories, and promo codes are purely synthetic test fixtures. Zero personal identifiable information (PII) or external payment keys exist.
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Categories</h5>
            <ul className="space-y-2">
              <li><span className="hover:text-white transition-colors cursor-pointer">Audio & Electronics</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Computing & Gaming</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Smart Living</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Workstation & Desk</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Everyday Carry</span></li>
            </ul>
          </div>

          {/* Developer & Stack */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Architecture</h5>
            <ul className="space-y-2">
              <li><span className="hover:text-white transition-colors cursor-pointer">Python 3.10 FastAPI</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">TypeScript + React 18</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Tailwind CSS 3</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">SQLite Zero-Config DB</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">No Docker Required</span></li>
            </ul>
          </div>

          {/* Test Newsletter */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Newsletter</h5>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to test product announcements and discount updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="testuser@example.com"
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 w-full focus:outline-none focus:border-indigo-500"
              />
              <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
          <p>&copy; 2026 ApexStore Test Project. No real names or sensitive credentials used.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Simulation</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Test</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Overview</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
