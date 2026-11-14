import { WatchHero } from '@/components/hero/WatchHero';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
      <WatchHero />

      {/* Continuation content section following hero */}
      <section className="relative z-20 max-w-5xl mx-auto px-6 py-28 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="text-xs font-mono uppercase text-sky-400 mb-2">01 / Materials</p>
            <h3 className="text-xl font-light text-white mb-2">Micro-Blasted Titanium</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Grade 5 titanium alloy brings an exceptional strength-to-weight ratio with superior corrosion resistance.
            </p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase text-sky-400 mb-2">02 / Optics</p>
            <h3 className="text-xl font-light text-white mb-2">Sapphire Crystal</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Curved crystal with dual anti-reflective coating delivers uncompromised clarity in harsh direct sunlight.
            </p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase text-sky-400 mb-2">03 / Thermal</p>
            <h3 className="text-xl font-light text-white mb-2">Zero-Throttling Core</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Next-generation silicon architecture with continuous biometric monitoring and sub-second sensor response.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
