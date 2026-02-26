import { motion } from 'motion/react';
import { Shield, Users, Target, Heart } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-black text-white mb-6 tracking-tight">OUR STORY</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Founded in Queens, NY, SpideyStore began with a simple mission: to provide every fan with the gear they need to feel like a hero.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-6">WITH GREAT POWER...</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Comes great responsibility. That's why we source only the highest quality materials for our suits and accessories. Every item in our inventory is tested for durability, comfort, and web-slinging compatibility.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              We believe that being a hero isn't just about the suit—it's about the heart. Our community is built on the values of courage, kindness, and never giving up.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-video rounded-[3rem] overflow-hidden border border-white/10"
          >
            <img src="https://picsum.photos/seed/about/1200/800" alt="About Us" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: "Quality", desc: "Stark-level tech in every product." },
            { icon: Users, title: "Community", desc: "Join 1M+ fans in the Spider-Verse." },
            { icon: Target, title: "Mission", desc: "Empowering heroes everywhere." },
            { icon: Heart, title: "Passion", desc: "Made by fans, for fans." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl text-center"
            >
              <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
