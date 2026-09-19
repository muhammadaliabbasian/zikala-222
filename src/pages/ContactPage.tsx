import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

const FAQS = [
  {
    q: 'How long does express courier delivery take across Pakistan?',
    a: 'Orders are dispatched via TCS Vault Express within 24 hours of confirmation. Delivery to Karachi takes 24–48 hours; Lahore, Islamabad, and Rawalpindi take 48–72 hours; other cities across Pakistan take 3–4 business days.',
  },
  {
    q: 'Can I physically inspect the watch before paying on Cash on Delivery?',
    a: 'Yes! All Zikala shipments are sent under our "Inspection Privilege". You can open the outer courier flyer to inspect the authenticated sealed luxury packaging before paying cash to the delivery courier.',
  },
  {
    q: 'What does the Zikala official warranty cover?',
    a: 'Our 2-to-5-year master warranty covers mechanical movement defects, balance wheel regulation, dial hands alignment, and water resistance seals. We maintain an in-house service atelier at Dolmen Mall Clifton, Karachi.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery (COD) across all cities in Pakistan, as well as digital transfers via Easypaisa, JazzCash, Meezan Bank wire, and major debit/credit cards.',
  },
];

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
          Concierge Services
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
          Get in Touch with Zikala
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Our horology specialists are at your service for timepiece consultations, custom orders, corporate gifts, and warranty support.
        </p>
      </div>

      {/* Grid: Contact Info + Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Flagship Boutique */}
          <div className="p-6 rounded-2xl bg-[#131313] border border-[#222222] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E1E1E] text-[#D4AF37] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-white">Karachi Flagship Atelier</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Boutique #4, First Floor, Dolmen Mall Clifton, Marine Drive, Block 4, Clifton, Karachi, Pakistan
            </p>
            <p className="text-[11px] text-gray-500">
              Personal appointments available upon request.
            </p>
          </div>

          {/* WhatsApp Direct Concierge */}
          <div className="p-6 rounded-2xl bg-[#0E2014] border border-emerald-800/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-white">Instant WhatsApp Concierge</h3>
            <p className="text-xs text-gray-300">
              For immediate video inspection, stock inquiries, and rapid orders across Pakistan.
            </p>
            <a
              href="https://wa.me/923001122334?text=Hello%20Zikala%20Concierge,%20I%20would%20like%20to%20inquire%20about%20your%20watch%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Chat on WhatsApp <Phone className="w-3 h-3 ml-1.5" />
            </a>
          </div>

          {/* Helpline & Email */}
          <div className="p-6 rounded-2xl bg-[#131313] border border-[#222222] space-y-3">
            <div className="flex items-center space-x-3 text-xs text-gray-300">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span><strong>Helpline:</strong> +92 300 1122334 (Mon – Sun 10am – 10pm)</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-300">
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <span><strong>Email:</strong> concierge@zikala.com</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-300">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span><strong>Response Time:</strong> Within 2 hours during business hours</span>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 bg-[#121212] border border-[#242424] rounded-2xl p-6 sm:p-8 shadow-2xl">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">Inquiry Received</h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                Thank you for reaching out, <strong>{name}</strong>. A dedicated horological concierge will review your message and connect with you via phone or email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="gold-button px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="text-lg font-serif font-bold text-white mb-2">
                Send an Inquiry to the Atelier
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Asad Farooq"
                    className="w-full bg-[#181818] border border-[#2C2C2C] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Pakistani Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full bg-[#181818] border border-[#2C2C2C] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#181818] border border-[#2C2C2C] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Inquiry Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2C2C2C] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Product Inquiry">Product Inquiry / Sizing</option>
                  <option value="Custom Order">Corporate / Bulk Gifting</option>
                  <option value="Warranty & Service">Warranty & Service Atelier</option>
                  <option value="Order Tracking">Order & Delivery Assistance</option>
                  <option value="General Feedback">General Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Message Details *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry, preferred watch models, or questions..."
                  className="w-full bg-[#181818] border border-[#2C2C2C] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full gold-button py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center shadow-lg"
              >
                <Send className="w-3.5 h-3.5 mr-2" /> Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="pt-10 border-t border-[#222222] max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
            Answers & Clarity
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-[#131313] border border-[#222222] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-[#D4AF37] transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-gray-400 leading-relaxed border-t border-[#1C1C1C] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
