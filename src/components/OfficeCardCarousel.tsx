import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

interface OfficeCardCarouselProps {
  city: string;
  address: string;
  phone: string;
  mapLink: string;
  isMain?: boolean;
  index: number;
}

const OfficeCardCarousel: React.FC<OfficeCardCarouselProps> = ({
  city,
  address,
  phone,
  mapLink,
  isMain = false,
  index
}) => {
  const gradientClasses = [
    'from-primary-500/10 to-secondary-500/10 border-primary-500/20',
    'from-secondary-500/10 to-accent-500/10 border-secondary-500/20',
    'from-accent-500/10 to-primary-500/10 border-accent-500/20',
    'from-emerald-500/10 to-cyan-500/10 border-emerald-500/20',
    'from-purple-500/10 to-pink-500/10 border-purple-500/20',
    'from-orange-500/10 to-red-500/10 border-orange-500/20',
    'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
  ];

  const iconColors = [
    'text-primary-600 bg-primary-100',
    'text-secondary-600 bg-secondary-100',
    'text-accent-600 bg-accent-100',
    'text-emerald-600 bg-emerald-100',
    'text-purple-600 bg-purple-100',
    'text-orange-600 bg-orange-100',
    'text-blue-600 bg-blue-100',
  ];

  const gradientClass = gradientClasses[index % gradientClasses.length];
  const iconColor = iconColors[index % iconColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative bg-gradient-to-br",
        gradientClass,
        "backdrop-blur-sm rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 group h-full min-h-[280px]"
      )}
    >

      {/* Декоративный элемент */}
      <div className="absolute -top-1 -right-1 w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-500" />

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="space-y-4">
          {/* Заголовок */}
          <div className="flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full animate-pulse", iconColor.split(' ')[1])} />
            <h3 className="text-xl font-bold text-gray-800">{city}</h3>
          </div>

          {/* Адрес */}
          <div className="flex items-start gap-3">
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", iconColor)}>
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed flex-1">
              {address}
            </p>
          </div>
        </div>

        {/* Действия */}
        <div className="space-y-3 pt-6 border-t border-white/20">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-white/50 hover:bg-white/80 border-white/30"
            asChild
          >
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link"
            >
              <ExternalLink className="w-4 h-4 mr-2 group-hover/link:rotate-12 transition-transform" />
              <span>Открыть на карте</span>
            </a>
          </Button>

          <Button
            variant="default"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <a href={`tel:${phone}`} className="group/phone">
              <Phone className="w-4 h-4 mr-2 group-hover/phone:animate-bounce" />
              <span>{phone}</span>
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OfficeCardCarousel;