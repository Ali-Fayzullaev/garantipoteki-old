import React from 'react';
import { motion } from 'framer-motion';
import EmblaCarousel from './ui/EmblaCarousel';
import OfficeCardCarousel from './OfficeCardCarousel';

const OfficesCarousel: React.FC = () => {
  const officesData = [
    {
      city: "Астана",
      address: "Бауыржан Момышулы 2/5, БЦ «ОРДА», 2 блок, 2 этаж",
      phone: "+7707 575 9707",
      mapLink: "https://go.2gis.com/pRU01",
      isMain: true,
    },
    {
      city: "Астана",
      address: "Сыганак 54а БЦ «А» 107 офис",
      phone: "+7707 575 9707",
      mapLink: "https://go.2gis.com/jfIyd",
    },
    {
      city: "Астана",
      address: "Бөгенбай Батыра 56а Бизнес центр «Фаворит» 7 этаж, 703 офис",
      phone: "+7707 575 9707",
      mapLink: "https://go.2gis.com/zUFAq",
    },
    {
      city: "Костанай",
      address: "БЦ Атриум ​Проспект Аль-Фараби, 74​1, 8 офис; 1 этаж",
      phone: "+7 777 043 89 12",
      mapLink: "https://go.2gis.com/oqJeX",
    },
    {
      city: "Рудный",
      address: "Космонавтов 8, вход со стороны ЦОНа",
      phone: "+7 777 043 89 12",
      mapLink: "https://go.2gis.com/moFj0",
    },
    {
      city: "Петропавловск",
      address: "Сутюшева 60, БЦ «Квартал», 3 этаж, кабинет 3.14",
      phone: "+7 708 153 7750",
      mapLink: "https://go.2gis.com/xSuoa",
    },
    {
      city: "Кокшетау",
      address: "Н.Назарбаева 29Б, 4 этаж, кабинет 406",
      phone: "+7 700 482 4545",
      mapLink: "https://go.2gis.com/xH89z",
    },
  ];

  const slides = officesData.map((office, index) => (
    <OfficeCardCarousel
      key={`${office.city}-${index}`}
      city={office.city}
      address={office.address}
      phone={office.phone}
      mapLink={office.mapLink}
      isMain={office.isMain}
      index={index}
    />
  ));

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-primary-50/30 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-accent-200/20 to-primary-200/20 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full border border-primary-200 mb-6">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-700">5 городов • 7 офисов</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Наши <span className="bg-gradient-to-r  from-primary-600 to-secondary-600 bg-clip-text text-gray-900">офисы</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Профессиональная команда в удобных локациях по всему Казахстану. 
            Приходите к нам для персональной консультации.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <EmblaCarousel 
            slides={slides}
            options={{ loop: true }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default OfficesCarousel;