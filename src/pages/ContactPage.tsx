import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you at web-speed.');
  };

  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">GET IN TOUCH</h1>
          <p className="text-gray-400">Have a question? Need help with your gear? We're here for you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: "Email Us", value: "support@spideystore.com" },
              { icon: Phone, title: "Call Us", value: "+1 (555) SPIDEY-1" },
              { icon: MapPin, title: "Visit Us", value: "20 Ingram St, Queens, NY" }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-zinc-900/50 border border-white/10 rounded-3xl flex items-center gap-6">
                <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{item.title}</h3>
                  <p className="text-white font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="p-10 bg-zinc-900 border border-white/10 rounded-[2.5rem] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Name</label>
                  <input type="text" required className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white focus:border-red-600 outline-none transition-colors" placeholder="Peter Parker" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <input type="email" required className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white focus:border-red-600 outline-none transition-colors" placeholder="peter@dailybugle.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                <input type="text" required className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white focus:border-red-600 outline-none transition-colors" placeholder="Question about Web-Shooters" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                <textarea required rows={5} className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white focus:border-red-600 outline-none transition-colors resize-none" placeholder="Hey, I was wondering if..." />
              </div>
              <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-700 transition-all">
                Send Message <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
