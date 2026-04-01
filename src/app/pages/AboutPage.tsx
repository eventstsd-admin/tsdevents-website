import { motion } from 'motion/react';
import { Award, Target, Heart, Users, Briefcase, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import aboutHeroImage from '../images/Hero Fallback/About us/about us.jpg';

const team = [
  {
    name: 'Rajesh Kumar',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1739298061707-cefee19941b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMGJ1c2luZXNzJTIwbWVldGluZ3xlbnwxfHx8fDE3NzQ5NDIwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Priya Sharma',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1765438864227-288900d09d26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBldmVudCUyMHBsYW5uaW5nJTIwdGVhbXxlbnwxfHx8fDE3NzUwMTcwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Amit Patel',
    role: 'Operations Manager',
    image: 'https://images.unsplash.com/photo-1739298061707-cefee19941b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMGJ1c2luZXNzJTIwbWVldGluZ3xlbnwxfHx8fDE3NzQ5NDIwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Sunita Verma',
    role: 'Client Relations Head',
    image: 'https://images.unsplash.com/photo-1765438864227-288900d09d26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBldmVudCUyMHBsYW5uaW5nJTIwdGVhbXxlbnwxfHx8fDE3NzUwMTcwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const achievements = [
  { icon: Award, number: '50+', label: 'Awards Won' },
  { icon: Users, number: '50K+', label: 'Happy Clients' },
  { icon: Calendar, number: '500+', label: 'Events Organized' },
  { icon: Briefcase, number: '10+', label: 'Years in Business' },
];

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We strive for perfection in every detail of your event',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We pour our hearts into creating memorable experiences',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work closely with you to bring your vision to life',
  },
];

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] text-white flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          <img
            src={aboutHeroImage}
            alt="About Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            About TSD Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Creating memories, one event at a time
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Founded in 2016, TSD Events began with a simple vision: to transform ordinary moments into extraordinary memories. What started as a small team of passionate event planners has grown into one of India's most trusted event management companies.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Over the years, we've had the privilege of organizing over 500 events, from intimate weddings to grand corporate conferences. Our commitment to excellence, attention to detail, and personalized approach have made us the preferred choice for clients across the country.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, we continue to push boundaries, embrace innovation, and create experiences that leave lasting impressions. Every event we undertake is a testament to our dedication to turning dreams into reality.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-amber-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg text-center"
                >
                  <div className="bg-red-700/90 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-xl text-gray-600">Milestones that inspire us</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, idx) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-amber-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">
                    {achievement.number}
                  </h3>
                  <p className="text-gray-600">{achievement.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              The passionate people behind every successful event
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-red-700/90 font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-700/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Work With Us?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Let's create something amazing together. Get in touch today!
            </p>
            <Button
              onClick={() => navigate('/contact')}
              className="bg-white text-red-700/90 hover:bg-gray-100 px-10 py-6 rounded-full text-lg font-semibold shadow-2xl border border-white/20"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}