'use client';

import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, Heart, DollarSign, TrendingUp } from 'lucide-react';

const stats = [
  {
    id: 1,
    name: 'People Helped',
    value: 2500,
    icon: Users,
    prefix: '',
    suffix: '+',
  },
  {
    id: 2,
    name: 'Volunteers',
    value: 150,
    icon: Heart,
    prefix: '',
    suffix: '+',
  },
  {
    id: 3,
    name: 'Donations',
    value: 500000,
    icon: DollarSign,
    prefix: '$',
    suffix: '',
  },
  {
    id: 4,
    name: 'Success Rate',
    value: 95,
    icon: TrendingUp,
    prefix: '',
    suffix: '%',
  },
];

const Counter = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;
      const interval = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl font-bold text-gray-900">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const Statistics = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Our Impact</h2>
          <p className="section-description">
            See how we're making a difference in people's lives
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: stat.id * 0.1 }}
              className="card p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <h3 className="mt-2 text-lg font-medium text-gray-900">{stat.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics; 