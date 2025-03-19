'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Users, 
  Brain, 
  Heart, 
  Download,
  Play,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const resourceCategories = [
  {
    title: 'Educational Materials',
    description: 'Comprehensive guides and articles on mental health topics.',
    icon: BookOpen,
    color: 'blue',
    count: '50+ resources'
  },
  {
    title: 'Worksheets & Tools',
    description: 'Interactive worksheets and practical tools for self-help.',
    icon: FileText,
    color: 'green',
    count: '30+ tools'
  },
  {
    title: 'Video Resources',
    description: 'Educational videos and guided meditation sessions.',
    icon: Video,
    color: 'purple',
    count: '40+ videos'
  },
  {
    title: 'Support Groups',
    description: 'Information about our community support programs.',
    icon: Users,
    color: 'red',
    count: '10+ groups'
  }
];

const featuredResources = [
  {
    title: 'Understanding Anxiety',
    description: 'A comprehensive guide to understanding and managing anxiety.',
    type: 'Guide',
    icon: Brain,
    color: 'blue',
    downloadUrl: 'https://www.mcgill.ca/counselling/files/counselling/anxiety_moodjuice_self_help_guide.pdf',
    previewUrl: 'https://elements-resized.envatousercontent.com/elements-cover-images/8e89897d-1d42-4092-8658-feb910f3fb8a?w=433&cf_fit=scale-down&q=85&format=auto&s=5c268869260e3ed5c54fecda0df189dab30481fa51e606675acfdc3022855724'
  },
  {
    title: 'Daily Wellness Journal',
    description: 'A structured journal for tracking your mental health journey.',
    type: 'Tool',
    icon: Heart,
    color: 'red',
    downloadUrl: 'https://cof.org/sites/default/files/documents/files/WellnessJournal.pdf',
    previewUrl: 'https://images.squarespace-cdn.com/content/v1/587e753a15d5db6a801d01c5/1486936443696-XR9K52XA80AJL2AOQTJ3/Journal-Keeping-19.jpg'
  },
  {
    title: 'Mindfulness Meditation',
    description: 'Guided meditation sessions for stress relief.',
    type: 'Video',
    icon: Video,
    color: 'purple',
    downloadUrl: 'https://youtu.be/ZToicYcHIOU',
    previewUrl: 'https://media.istockphoto.com/id/1313456479/photo/man-and-soul-yoga-lotus-pose-meditation-on-nebula-galaxy-background.jpg?s=612x612&w=0&k=20&c=jJ0pVed-sHjDBtomrO7KmR4qtIfH8OaNhjmEsXvJmAI='
  }
];

const ResourceCard = ({ resource, index }: { resource: typeof featuredResources[0], index: number }) => {
  const Icon = resource.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48">
        <Image
          src={resource.previewUrl}
          alt={resource.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          {resource.type === 'Video' ? (
            <Play className="h-12 w-12 text-white" />
          ) : (
            <Download className="h-12 w-12 text-white" />
          )}
        </div>
      </div>
      <div className="p-6">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${resource.color}-100 text-${resource.color}-600 mb-4`}>
          <Icon className="h-4 w-4 mr-2" />
          {resource.type}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
        <p className="text-gray-600 mb-4">{resource.description}</p>
        <a
          href={resource.downloadUrl}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
        >
          {resource.type === 'Video' ? 'Watch Now' : 'Download'}
          <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </motion.div>
  );
};

const CategoryCard = ({ category, index }: { category: typeof resourceCategories[0], index: number }) => {
  const Icon = category.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className={`p-3 rounded-lg bg-${category.color}-100 text-${category.color}-600 inline-block mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
      <p className="text-gray-600 mb-4">{category.description}</p>
      <p className="text-sm text-gray-500">{category.count}</p>
    </motion.div>
  );
};

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
                Mental Health Resources
              </h1>
              <p className="text-xl text-gray-600">
                Access our comprehensive collection of mental health resources, tools, and educational materials.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Browse Resources
              </h2>
              <p className="text-xl text-gray-600">
                Explore our curated collection of mental health resources by category.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {resourceCategories.map((category, index) => (
                <CategoryCard key={category.title} category={category} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Resources */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Featured Resources
                </h2>
                <p className="text-xl text-gray-600">
                  Discover our most popular and helpful resources.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-4 mt-4 md:mt-0"
              >
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="guide">Guides</option>
                  <option value="tool">Tools</option>
                  <option value="video">Videos</option>
                </select>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredResources.map((resource, index) => (
                <ResourceCard key={resource.title} resource={resource} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-primary-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Stay Updated
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Subscribe to our newsletter to receive new resources and mental health tips.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
                  >
                    Subscribe
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
} 