'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare,
  ArrowRight,
  Shield,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const contactMethods = [
  {
    title: 'Phone Support',
    description: 'Call us for immediate assistance',
    icon: Phone,
    value: '+1 (555) 123-4567',
    color: 'blue',
    action: 'Call Now',
    href: 'tel:+15551234567'
  },
  {
    title: 'Email',
    description: 'Send us a message',
    icon: Mail,
    value: 'support@ryd.org',
    color: 'red',
    action: 'Email Us',
    href: 'mailto:support@ryd.org'
  },
  {
    title: 'Office Hours',
    description: 'Visit us in person',
    icon: Clock,
    value: 'Mon-Fri: 9am - 6pm',
    color: 'green',
    action: 'Get Directions',
    href: '#location'
  },
  {
    title: 'Online Chat',
    description: 'Chat with our support team',
    icon: MessageSquare,
    value: 'Available 24/7',
    color: 'purple',
    action: 'Start Chat',
    href: '/chat'
  }
];

const features = [
  {
    title: '24/7 Support',
    description: 'Round-the-clock assistance for those in need',
    icon: Shield
  },
  {
    title: 'Confidential',
    description: 'Your privacy and security are our top priority',
    icon: CheckCircle2
  },
  {
    title: 'Professional Team',
    description: 'Experienced mental health professionals',
    icon: CheckCircle2
  }
];

const ContactMethodCard = ({ method, index }: { method: typeof contactMethods[0], index: number }) => {
  const Icon = method.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className={`p-3 rounded-xl bg-${method.color}-100 text-${method.color}-600 inline-block mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
      <p className="text-gray-600 mb-4">{method.description}</p>
      <p className="text-lg font-medium text-gray-900 mb-4">{method.value}</p>
      <a
        href={method.href}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
      >
        {method.action}
        <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
      </a>
    </motion.div>
  );
};

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex items-start space-x-3"
    >
      <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    </motion.div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600">
                We're here to help. Choose the most convenient way to reach us.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactMethods.map((method, index) => (
                <ContactMethodCard key={method.title} method={method} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Support Request</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </form>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Why Choose Us
                </h2>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <FeatureCard key={feature.title} feature={feature} index={index} />
                  ))}
                </div>
                <div className="bg-primary-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Office Location
                  </h3>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-primary-600 mt-1" />
                    <div>
                      <p className="text-gray-600">
                        123 Mental Health Street<br />
                        Suite 100<br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section id="location" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Visit Us
              </h2>
              <p className="text-xl text-gray-600">
                Find us at our office location in San Francisco.
              </p>
            </motion.div>

            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f445b%3A0xb10ed6d9b5050fa5!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1647041234567!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
} 