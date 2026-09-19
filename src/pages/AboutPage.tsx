import React from 'react';
import { Award, Compass, Eye, Heart, MapPin, ShieldCheck, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Banner */}
      <section className="relative min-h-[45vh] sm:min-h-[55vh] flex items-center justify-center overflow-hidden border-b border-[#1E1E1E]">
        <img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2000&q=85"
          alt="Zikala Atelier Watchmaker bench"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.3] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-2">
            Haute Horlogerie Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white mb-4">
            The Zikala Legacy
          </h1>
          <p className="text-sm sm:text-lg text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
            "Time is not merely measured in passing seconds. It is commemorated through exceptional craftsmanship and enduring personal elegance."
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              The Genesis
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Bridging International Horology with Pakistani Sophistication
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Founded in Karachi, Zikala was established to eliminate the compromise faced by Pakistani watch collectors. For decades, enthusiasts were forced to choose between exorbitant import markups from grey-market dealers or generic, fragile fashion watches.
            </p>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              We set out on a single mission: to design and assemble watches using the world’s most venerable mechanical architectures — Japanese Miyota and Seiko calibres alongside Swiss-inspired tourbillons — cased in marine-grade 316L stainless steel and fronted by scratch-proof sapphire crystal.
            </p>
            <div className="pt-2">
              <span className="text-sm font-serif italic text-[#D4AF37]">
                — The Horology Guild of Zikala Pakistan
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#2B2B2B] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
                alt="Watch movement inspection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <p className="text-xs text-gray-300">
                  Every automatic balance wheel is regulated across 5 positions for chronometer accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Craftsmanship */}
      <section className="bg-[#0E0E0E] border-y border-[#1C1C1C] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
              Material Mastery
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
              Our 4 Pillars of Manufacturing
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              We never cut corners. Each component is specified to survive generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222222]">
              <div className="w-10 h-10 rounded-xl bg-[#1D1D1D] text-[#D4AF37] flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white mb-2">
                Sapphire Crystal Glass
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Rated 9 on the Mohs hardness scale. Second only to natural diamond in hardness, ensuring lifelong scratch resistance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222222]">
              <div className="w-10 h-10 rounded-xl bg-[#1D1D1D] text-[#D4AF37] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white mb-2">
                316L Surgical Steel
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Hypoallergenic, high-nickel marine-grade alloy that resists sweat corrosion and humidity in Pakistan’s coastal and monsoon climates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222222]">
              <div className="w-10 h-10 rounded-xl bg-[#1D1D1D] text-[#D4AF37] flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white mb-2">
                Certified Movements
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Equipped exclusively with mechanical automatic and chronograph calibres from Seiko (NH35/VK63) and Miyota (8215/9015).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222222]">
              <div className="w-10 h-10 rounded-xl bg-[#1D1D1D] text-[#D4AF37] flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white mb-2">
                5-Year Atelier Warranty
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Complimentary cleaning, gasket re-lubrication, and precision calibration at our Clifton Karachi service workshop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Boutique Experience */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#131313] border border-[#282828] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
              Flagship Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Visit The Zikala Boutique in Karachi
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Experience our timepieces in person. Our certified horological concierges are available at Dolmen Mall Clifton for private consultations, wrist sizing, and champagne previews.
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p className="flex items-center">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] mr-2" /> Boutique #4, First Floor, Dolmen Mall Clifton, Karachi
              </p>
              <p>Timings: Monday through Sunday, 11:00 AM – 10:00 PM</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="gold-button px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl flex-shrink-0"
          >
            Contact Concierge Desk
          </button>
        </div>
      </section>
    </div>
  );
};
