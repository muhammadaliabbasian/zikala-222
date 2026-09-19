import React from 'react';
import { ChevronRight, FileText, RotateCcw, ShieldCheck } from 'lucide-react';

interface LegalPageProps {
  onNavigate: (page: string) => void;
}

// ============================================================
// PRIVACY POLICY PAGE
// ============================================================
export const PrivacyPolicyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 text-xs sm:text-sm text-gray-300 leading-relaxed">
      <nav className="flex items-center space-x-2 text-xs text-gray-400">
        <button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37]">
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white font-medium">Privacy Policy</span>
      </nav>

      <div className="border-b border-[#222222] pb-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
          Data Governance
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
          Zikala Privacy & Data Policy
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Effective Date: January 1, 2026 • Compliant with Pakistani Electronic Transactions Ordinance
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-serif font-bold text-white">1. Commitment to Discretion</h2>
        <p>
          At Zikala Watches Pakistan (Pvt) Ltd ("Zikala", "we", "our"), protecting the confidentiality and personal integrity of our discerning clients is a foundational principle. We collect only the information strictly necessary to process your horological commission, arrange secure courier dispatch via TCS Vault Express, and administer your official warranty.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-serif font-bold text-white">2. Information We Collect</h2>
        <p>
          When you place an order, create an account, or request concierge assistance, we collect:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-400">
          <li>Full legal name, phone number, and delivery destination within Pakistan.</li>
          <li>Email address for tracking dispatch notifications and electronic certificates.</li>
          <li>Payment verification tokens (Easypaisa/JazzCash Transaction ID or bank transfer references). We do not store raw card numbers.</li>
          <li>Device telemetry and IP address strictly for anti-fraud validation.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-serif font-bold text-white">3. Information Sharing & Third Parties</h2>
        <p>
          We do not sell, rent, or trade your personal data. We disclose information strictly to:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-400">
          <li>Licensed express courier partners (TCS Pakistan) for delivery fulfillment.</li>
          <li>Corporate banking conduits (Meezan Bank Ltd) for verified payment clearing.</li>
          <li>Law enforcement agencies only when mandated under sovereign court orders of Pakistan.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-serif font-bold text-white">4. Data Security</h2>
        <p>
          Our platform operates behind 256-bit SSL encryption. Order records and addresses are stored in restricted-access databases behind firewalls and monitored around the clock.
        </p>
      </section>
    </div>
  );
};

// ============================================================
// TERMS & CONDITIONS PAGE
// ============================================================
export const TermsPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 text-xs sm:text-sm text-gray-300 leading-relaxed">
      <nav className="flex items-center space-x-2 text-xs text-gray-400">
        <button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37]">
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white font-medium">Terms & Conditions</span>
      </nav>

      <div className="border-b border-[#222222] pb-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
          Legal Agreement
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
          Terms & Conditions of Sale
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Please review before commissioning any timepiece from Zikala Pakistan.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-serif font-bold text-white">1. Authenticity & Calibration Guarantee</h2>
        <p>
          Every watch dispatched by Zikala is guaranteed to be 100% authentic, brand-new, and inspected by our master watchmakers. Mechanical calibres are regulated to ±10 seconds/day before sealing in presentation packaging.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-serif font-bold text-white">2. Pricing & Currency</h2>
        <p>
          All prices displayed are denominated in Pakistani Rupees (PKR) and include all applicable customs tariffs and atelier assembly costs. We reserve the right to correct typographical pricing discrepancies prior to order dispatch.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-serif font-bold text-white">3. Shipping & Handover</h2>
        <p>
          Nationwide delivery across Pakistan is conducted via TCS Vault Express. Delivery timelines (24–72 hours) are estimates subject to weather or civil logistics delays. Risk of transit loss passes to the client upon recorded physical handover by the courier.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-serif font-bold text-white">4. Official Warranty Scope</h2>
        <p>
          Each timepiece includes an official 2 to 5 years manufacturer warranty certificate. The warranty covers internal mechanical movement failures and defect in materials. Normal wear and tear, cosmetic scratches to steel, unauthorized tampering, or water ingress exceeding the rated depth are excluded.
        </p>
      </section>
    </div>
  );
};

// ============================================================
// RETURN & REFUND POLICY PAGE
// ============================================================
export const ReturnPolicyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 text-xs sm:text-sm text-gray-300 leading-relaxed">
      <nav className="flex items-center space-x-2 text-xs text-gray-400">
        <button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37]">
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white font-medium">Return & Refund Policy</span>
      </nav>

      <div className="border-b border-[#222222] pb-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
          Client Peace of Mind
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
          7-Day Inspection & Return Privilege
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Transparent, client-first satisfaction guarantee across Pakistan.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-[#142017] border border-emerald-800/60 text-xs text-emerald-300 flex items-center space-x-3">
        <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
        <span>
          Every Zikala purchase is backed by our 7-day hassle-free return and exchange policy from the date of physical receipt.
        </span>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-serif font-bold text-white">1. Eligibility Criteria</h2>
        <p>To qualify for a full refund or timepiece exchange:</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-400">
          <li>The watch must be unworn with original plastic protective film intact.</li>
          <li>Bracelet links must not have been removed, scratched, or resized.</li>
          <li>All original packaging, wooden trunk box, and warranty card must be returned intact.</li>
          <li>The claim must be initiated within 7 calendar days of receipt.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-serif font-bold text-white">2. Return Process</h2>
        <p>
          Contact our Karachi Concierge desk via WhatsApp (+92 300 1122334) or email (concierge@zikala.com) with your Order Reference ID. Our courier partner will pick up the parcel from your doorstep, or you may return it to our Dolmen Mall Clifton boutique.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-serif font-bold text-white">3. Refund Disbursement</h2>
        <p>
          Upon inspection at our atelier (usually within 24 hours of receipt), refunds are processed directly to your Pakistani bank account, Easypaisa, or JazzCash within 2–3 business days.
        </p>
      </section>
    </div>
  );
};
