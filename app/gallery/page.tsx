'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Search, Filter, Maximize2, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const categories = [
  { id: 'all', name: 'All Images' },
  { id: 'events', name: 'Events' },
  { id: 'programs', name: 'Programs' },
  { id: 'community', name: 'Community' },
];

const images = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  src: `/gallery/G${i + 1}.jpeg`,
  alt: `Gallery Image ${i + 1}`,
  category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
  description: `Description for image ${i + 1}`,
}));

const GalleryImage = ({ image, onClick }: { image: typeof images[0], onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
    className="relative group cursor-pointer overflow-hidden rounded-xl"
    onClick={onClick}
  >
    <div className="aspect-square relative">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-sm font-medium mb-2">{image.description}</p>
          <div className="flex items-center space-x-2">
            <span className="text-white/80 text-xs bg-white/10 px-2 py-1 rounded-full">
              {categories.find(cat => cat.id === image.category)?.name}
            </span>
          </div>
        </div>
        <div className="absolute top-4 right-4 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
            <Maximize2 className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const Lightbox = ({ image, onClose, onNext, onPrevious }: {
  image: typeof images[0],
  onClose: () => void,
  onNext: () => void,
  onPrevious: () => void,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={onClose}
  >
    <button
      className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm p-2 rounded-full"
      onClick={onClose}
    >
      <X className="h-6 w-6" />
    </button>
    
    <button
      className="absolute left-4 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm p-2 rounded-full"
      onClick={(e) => {
        e.stopPropagation();
        onPrevious();
      }}
    >
      <ChevronLeft className="h-6 w-6" />
    </button>
    
    <button
      className="absolute right-4 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm p-2 rounded-full"
      onClick={(e) => {
        e.stopPropagation();
        onNext();
      }}
    >
      <ChevronRight className="h-6 w-6" />
    </button>

    <div className="relative w-full max-w-5xl aspect-square">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-contain"
        priority
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-xl font-semibold mb-2">{image.description}</h3>
            <span className="text-white/80 text-sm bg-white/10 px-3 py-1 rounded-full">
              {categories.find(cat => cat.id === image.category)?.name}
            </span>
          </div>
          <button className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors">
            <Download className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState(images);

  useEffect(() => {
    let filtered = images;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(img => 
        img.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredImages(filtered);
  }, [selectedCategory, searchQuery]);

  const handleNext = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrevious = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const previousIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[previousIndex]);
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
                Our Gallery
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Explore moments of hope, healing, and transformation through our collection of images.
              </p>
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredImages.map((image) => (
                  <GalleryImage
                    key={image.id}
                    image={image}
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <Lightbox
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
} 