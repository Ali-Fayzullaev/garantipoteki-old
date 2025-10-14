// src/app/city/[slug]/page.tsx
"use client";

import { useState, use } from "react"; // Добавляем use
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LeadForm from "@/components/LeadForm";

// Конфигурация городов
const CITY_CONFIG = {
  kokshetau: {
    code: "fk8aEdbg",
    name: "Кокшетау",
    title: "GARANT IPOTEKI - Кокшетау",
  },
  kostanay: {
    code: "oawmSexI",
    name: "Костанай",
    title: "GARANT IPOTEKI - Костанай",
  },
  // Добавьте другие города здесь
};

interface CityPageProps {
  params: {
    slug: string;
  };
}

// Карточка офиса
interface OfficeCardProps {
  city: string;
  address: string;
  phone: string;
  color: string;
  mapLink: string;
}

const OfficeCard = ({
  city,
  address,
  phone,
  color,
  mapLink,
}: OfficeCardProps) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl shadow-[#f6dc49]/70 hover:shadow-2xl transition-all duration-500 w-80 h-64 group overflow-hidden border-l-4 border-[#da6d2a] relative">
      <div
        className={`absolute top-0 right-0 w-20 h-20 rounded-full ${
          color === "brandYellow" ? "bg-brandYellow/20" : "bg-brandOrange/20"
        } -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-500`}
      ></div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-4 h-4 rounded-full ${
                color === "brandYellow" ? "bg-brandYellow" : "bg-brandOrange"
              } shadow-lg`}
            ></div>
            <h3 className="text-xl font-bold text-[#da6d2a]">{city}</h3>
          </div>

          <div className="flex items-start gap-3 mb-3">
            <span className="text-brandOrange text-lg mt-1">📍</span>
            <p className="text-gray-700 text-sm leading-relaxed flex-1">
              {address}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-brandOrange font-semibold hover:text-brandYellow transition-colors duration-200 text-sm"
            >
              <span className="text-lg">✅</span>
              <span>Найти на карте</span>
            </a>
          </div>

          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-3 text-brandOrange font-semibold hover:text-brandYellow transition-colors duration-200 text-sm group/phone"
          >
            <span className="text-lg">📞</span>
            <span className="group-hover/phone:translate-x-1 transition-transform duration-300">
              {phone}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

// Карточка менеджера
interface ManagerCardProps {
  name: string;
  position: string;
  experience: string;
  photo: string;
}

const ManagerCard = ({
  name,
  position,
  experience,
  photo,
}: ManagerCardProps) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden border-l-4 border-[#da6d2a] relative w-80 h-80">
      <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-brandYellow/20 -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500"></div>

      <div className="relative z-10 text-center h-full flex flex-col justify-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-brandYellow to-brandOrange p-1 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
          <Image
            src={photo}
            alt={name}
            width={96}
            height={96}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <h3 className="text-xl font-bold text-[#da6d2a] mb-2 group-hover:scale-105 transition-transform duration-300">
          {name}
        </h3>
        <p className="text-brandOrange font-semibold mb-3 text-sm">
          {position}
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
          <span className="text-brandOrange">⏱️</span>
          <span>{experience}</span>
        </div>
      </div>
    </div>
  );
};

export default function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Разворачиваем params с помощью use()
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

  const cityConfig = CITY_CONFIG[slug as keyof typeof CITY_CONFIG];

  if (!cityConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Город не найден
          </h1>
          <p className="text-gray-600">Пожалуйста, проверьте ссылку</p>
        </div>
      </div>
    );
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openPrivacyModal = () => setIsPrivacyModalOpen(true);
  const closePrivacyModal = () => setIsPrivacyModalOpen(false);
  const openThankYouModal = () => setIsThankYouModalOpen(true);
  const closeThankYouModal = () => setIsThankYouModalOpen(false);

  return (
    <div className="font-sans min-h-screen bg-brandWhite text-gray-900 relative overflow-hidden">
      {/* WOW-анимированный мягкий фон с кругами */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-10 pointer-events-none"
      >
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 70% 20%, #f6dc49 0%, transparent 60%)",
              "radial-gradient(circle at 30% 80%, #dc6d28 0%, transparent 60%)",
              "radial-gradient(circle at 70% 20%, #f6dc49 0%, transparent 60%)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundSize: "200% 200%",
            filter: "blur(32px)",
            opacity: 0.18,
          }}
        />
        {/* Декоративные круги */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute left-1/4 top-1/3 w-96 h-96 bg-brandYellow/30 rounded-full blur-3xl opacity-60"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="absolute right-1/4 bottom-0 w-[420px] h-[420px] bg-brandOrange/20 rounded-full blur-3xl opacity-50"
        />
      </motion.div>

      {/* Фиксированная шапка */}
      <header
        className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur border-b border-gray-100 flex items-center justify-between px-8"
        style={{ height: "56px" }}
      >
        <div className="flex items-center h-14">
          <Image
            src="/logo.png"
            alt="GARANT IPOTEKI логотип"
            width={142}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
        <button
          onClick={openModal}
          className="bg-[#f6dc49] text-gray-900 font-semibold rounded-full px-4 md:px-7 py-2 text-sm md:text-base shadow focus:outline-none focus:ring-2 focus:ring-brandOrange focus:ring-offset-2 whitespace-nowrap"
        >
          Оставить заявку
        </button>
      </header>

      {/* Hero-блок */}
      <section className="flex flex-col md:flex-row items-start justify-start min-h-[70vh] py-20 text-center relative gap-10 md:gap-0">
        <div className="absolute inset-0 z-0">
          <Image
            src="/3.jpg"
            alt="Клиент 3"
            fill
            className="object-cover object-top opacity-15"
            priority
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-start z-10 w-full -mt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-0 w-full"
          >
            <h1
              className="text-5xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-brandYellow via-brandOrange to-brandYellow bg-clip-text text-transparent tracking-tight text-center"
              style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
            >
              GARANT IPOTEKI
            </h1>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-2xl md:text-4xl font-semibold mb-4 text-gray-900 text-center w-full"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            Кредиты и ипотека под ключ - {cityConfig.name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-lg md:text-2xl mb-10 text-gray-700 max-w-2xl mx-auto text-center"
          >
            Без первоначального взноса.
            <br />
            Даже с действующими кредитами.
          </motion.p>
          <motion.button
            onClick={openModal}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-[#f6dc49] text-gray-900 font-bold rounded-full px-14 py-5 text-xl shadow-lg shadow-[#dd6c2b]/70 focus:outline-none focus:ring-2 focus:ring-brandOrange focus:ring-offset-2 inline-block mx-auto hover:scale-105 transition-transform duration-300"
          >
            Оставить заявку
          </motion.button>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-sm italic text-gray-600 mt-3 text-center"
          >
            Консультация Бесплатно!
          </motion.p>
        </div>
        <div className="flex-1 flex justify-center items-start w-full">
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-3xl shadow-2xl shadow-[#dd6c2b]/70 relative z-20">
              <video
                src="/video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="rounded-2xl w-full max-w-xs sm:max-w-md md:w-[420px] md:h-[320px] object-cover bg-white"
                style={{ backgroundColor: "white", opacity: 1, zIndex: 30 }}
              />
            </div>
            <p className="text-lg italic text-gray-700 mt-4 text-center">
              Более 1000+ довольных клиентов!
            </p>
          </div>
        </div>
      </section>

      {/* Блок с адресами офисов */}
      <section className="py-20 bg-gradient-to-br from-brandYellow/20 via-brandOrange/20 to-brandYellow/30 relative">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-10 text-gray-900 text-center">
            Наши офисы - {cityConfig.name}
          </h2>
          <div className="flex flex-wrap justify-center gap-10">
            {slug === "kokshetau" && (
              <OfficeCard
                city="Кокшетау"
                address="Н.Назарбаева 29Б, 4 этаж, кабинет 406"
                phone="+7 700 482 4545"
                color="brandYellow"
                mapLink="https://go.2gis.com/xH89z"
              />
            )}
            {slug === "kostanay" && (
              <OfficeCard
                city="Костанай"
                address="БЦ Атриум ​Проспект Аль-Фараби, 74​1, 8 офис; 1 этаж"
                phone="+7 777 043 89 12"
                color="brandYellow"
                mapLink="https://go.2gis.com/oqJeX"
              />
            )}
          </div>
        </div>
      </section>
      {/* Блок 3 — Карусель с менеджерами */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          Наши лучшие эксперты
        </h2>
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full"
              style={
                {
                  "--swiper-navigation-size": "48px",
                  "--swiper-navigation-color": "#f6dc49",
                } as React.CSSProperties
              }
            >
              <SwiperSlide className="flex justify-center">
                <ManagerCard
                  name="Султангазы Айнура"
                  position="Эксперт по Ипотеке"
                  experience="3 года"
                  photo="/managers/sultangazy_ainura.jpg"
                />
              </SwiperSlide>
              <SwiperSlide className="flex justify-center">
                <ManagerCard
                  name="Сақтаған Жантуар"
                  position="Эксперт по Кредитованию"
                  experience="3 года"
                  photo="/managers/saktagan_zhantuar.jpg"
                />
              </SwiperSlide>
              <SwiperSlide className="flex justify-center">
                <ManagerCard
                  name="Серикова Гулсим"
                  position="Эксперт по Ипотеке"
                  experience="4 года"
                  photo="/managers/serikova_gulsym.jpg"
                />
              </SwiperSlide>
              <SwiperSlide className="flex justify-center">
                <ManagerCard
                  name="Кожанова Данагул"
                  position="Эксперт по Ипотеке"
                  experience="4 года"
                  photo="/managers/kozhanova_danagul.jpg"
                />
              </SwiperSlide>
            </Swiper>

            {/* Кастомные стрелки */}
            <div className="swiper-button-prev !absolute !w-12 !h-12 !bg-[#f6dc49] !rounded-full !text-gray-900 !shadow-lg hover:!scale-110 transition-transform duration-300 !left-4 !top-1/2 !-translate-y-1/2 !z-10"></div>
            <div className="swiper-button-next !absolute !w-12 !h-12 !bg-[#f6dc49] !rounded-full !text-gray-900 !shadow-lg hover:!scale-110 transition-transform duration-300 !right-4 !top-1/2 !-translate-y-1/2 !z-10"></div>
          </div>
        </div>
      </section>

      {/* Блок 4 — Галерея */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/ph1.jpg"
                alt="Фото 1"
                width={400}
                height={300}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/ph2.jpg"
                alt="Фото 2"
                width={400}
                height={300}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/ph3.jpg"
                alt="Фото 3"
                width={400}
                height={300}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Блок с формой */}
      <section id="leadform" className="py-16 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          Бесплатная консультация в {cityConfig.name}
        </h2>
        <LeadForm onSuccess={openThankYouModal} cityCode={cityConfig.code} />
      </section>

      {/* Блок 5 — Почему выбирают нас */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
              Почему выбирают нас
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-[#db6d2a] group-hover:scale-105">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-brandYellow to-brandOrange rounded-full flex items-center justify-center text-2xl shadow-lg">
                  💰
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Без первоначального взноса
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Получите кредит без необходимости вносить первоначальный
                    взнос
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-[#db6d2a] group-hover:scale-105">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-brandOrange to-[#da6d2a] rounded-full flex items-center justify-center text-2xl shadow-lg">
                  🏦
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    До 8 млн тенге
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Без подтверждения дохода и справок
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-[#db6d2a] group-hover:scale-105">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  ⭐
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Рейтинг 4.9
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    В 2GIS на основе более тысячи отзывов довольных клиентов
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-[#db6d2a] group-hover:scale-105">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  🔄
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    С действующими кредитами
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Получите новый кредит даже при наличии других займов
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Инфографическая карта Казахстана */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Наши филиалы по всему Казахстану
              </h3>
              <p className="text-xl text-gray-600">
                Мы работаем в 5 городах с 6 офисами
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              {/* Карта Казахстана */}
              <div className="relative w-full h-96 bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#da6d2a]">
                <Image
                  src="/kz.png"
                  alt="Карта Казахстана"
                  width={800}
                  height={400}
                  className="w-11/12 h-11/12 object-contain opacity-80 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  onError={(e) => {
                    console.log("Ошибка загрузки карты Казахстана");
                  }}
                  onLoad={() => {
                    console.log("Карта Казахстана успешно загружена");
                  }}
                />
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#da6d2a] text-center"
                >
                  <div className="text-3xl font-bold text-brandOrange mb-2">
                    5
                  </div>
                  <div className="text-gray-600 font-semibold">Городов</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#da6d2a] text-center"
                >
                  <div className="text-3xl font-bold text-brandOrange mb-2">
                    4.9
                  </div>
                  <div className="text-gray-600 font-semibold">
                    Рейтинг 2GIS
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#da6d2a] text-center"
                >
                  <div className="text-3xl font-bold text-brandOrange mb-2">
                    1000+
                  </div>
                  <div className="text-gray-600 font-semibold">
                    Довольных клиентов
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Блок 6 — Футер */}
      <footer className="py-12 bg-gradient-to-br from-gray-500 via-gray-700 to-black text-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Компания */}
            <div className="space-y-4">
              <div className="font-bold text-2xl text-brandYellow">
                GARANT IPOTEKI
              </div>
              <div className="text-gray-300 text-sm">
                <p>БИН: 240840010906</p>
                <p>г. Астана, 2025</p>
                <p>Головной офис:</p>
                <p>Проспект Б. Момышұлы 2/5</p>
              </div>
            </div>

            {/* Контакты */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-brandYellow">
                Контакты
              </h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📞</span>
                  <span>+7 707 575 97 07</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📧</span>
                  <span>maksatzhusupov@mail.ru</span>
                </div>
              </div>
            </div>

            {/* Социальные сети */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-brandYellow">
                Напишите нам
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://wa.me/77075759707"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/garant_ipoteki.astana/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="tel:+77075759707"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19c-.55 0-.99.45-.99.99 0 9.36 7.6 16.96 16.96 16.96.54 0 .99-.45.99-.99v-3.5c0-.54-.45-.99-.99-.99z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <button
              onClick={openPrivacyModal}
              className="text-gray-400 hover:text-brandYellow transition-colors duration-300 text-sm"
            >
              Политика конфиденциальности
            </button>
          </div>
        </div>
      </footer>

      {/* Модальное окно */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <LeadForm onSuccess={closeModal} cityCode={cityConfig.code} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно политики конфиденциальности */}
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closePrivacyModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Политика конфиденциальности
                </h2>
                <button
                  onClick={closePrivacyModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <p className="text-lg leading-relaxed">
                  <strong>GARANT IPOTEKI</strong> уважает вашу
                  конфиденциальность и обязуется защищать ваши персональные
                  данные.
                </p>

                <div className="bg-yellow-50 border-l-4 border-brandYellow p-4 rounded-r-lg">
                  <p className="text-lg font-semibold text-gray-900">
                    ⚠️ Важное уведомление: При заполнении формы заявки вы
                    соглашаетесь на хранение и обработку ваших персональных
                    данных в соответствии с настоящей политикой
                    конфиденциальности.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-8">
                  1. Сбор персональных данных
                </h3>
                <p>Мы собираем следующие персональные данные:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Имя и контактная информация</li>
                  <li>Номер телефона</li>
                  <li>Информация о выбранных услугах</li>
                  <li>Данные о взаимодействии с нашим сайтом</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mt-8">
                  2. Цель обработки данных
                </h3>
                <p>Ваши персональные данные используются для:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Обработки ваших заявок на кредитные услуги</li>
                  <li>Связи с вами по вопросам предоставления услуг</li>
                  <li>Улучшения качества наших услуг</li>
                  <li>Соблюдения требований законодательства</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mt-8">
                  3. Хранение и защита данных
                </h3>
                <p>
                  Мы принимаем все необходимые меры для защиты ваших
                  персональных данных от несанкционированного доступа,
                  изменения, раскрытия или уничтожения.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mt-8">
                  4. Передача данных третьим лицам
                </h3>
                <p>
                  Мы не передаем ваши персональные данные третьим лицам, за
                  исключением случаев, предусмотренных законодательством
                  Республики Казахстан.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mt-8">
                  5. Ваши права
                </h3>
                <p>Вы имеете право:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Получить доступ к своим персональным данным</li>
                  <li>Требовать исправления неточных данных</li>
                  <li>Требовать удаления ваших данных</li>
                  <li>Отозвать согласие на обработку данных</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mt-8">
                  6. Контактная информация
                </h3>
                <p>
                  По всем вопросам, связанным с обработкой персональных данных,
                  обращайтесь:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    <strong>GARANT IPOTEKI</strong>
                  </p>
                  <p>Телефон: +7 707 575 97 07</p>
                  <p>Email: maksatzhusupov@mail.ru</p>
                  <p>
                    Адрес: Проспект БАУЫРЖАН МОМЫШҰЛЫ, здание 2/5, г. Астана
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-6">
                  <p className="text-sm text-gray-600">
                    <strong>Дата последнего обновления:</strong> 2025 год
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно с благодарностью */}
      <AnimatePresence>
        {isThankYouModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeThankYouModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Спасибо за Вашу заявку!
                </h2>
                <button
                  onClick={closeThankYouModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div className="bg-gradient-to-r from-brandYellow/10 to-brandOrange/10 p-6 rounded-2xl border-l-4 border-[#da6d2a]">
                  <p className="text-lg leading-relaxed font-semibold">
                    Уважаемый клиент,
                    <br />
                    мы получили Ваш номер телефона, и наш лучший специалист уже
                    готов связаться с Вами для подробной консультации.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="text-lg font-semibold text-green-800">
                    ✅ Консультация абсолютно бесплатна.
                    <br />
                    📍 Адреса наших офисов указаны на сайте – будем рады видеть
                    Вас лично.
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <h3 className="text-xl font-bold text-yellow-800 mb-3">
                    ⚠️ Важная рекомендация:
                  </h3>
                  <p className="text-lg leading-relaxed text-yellow-800">
                    Пожалуйста, воздержитесь от подачи заявок в микрофинансовые
                    организации и другие компании, чтобы не ухудшить кредитную
                    историю и не снизить шансы на получение ипотеки или кредита
                    на выгодных условиях.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-brandOrange/10 to-[#da6d2a]/10 p-6 rounded-2xl border-l-4 border-[#da6d2a]">
                  <p className="text-xl font-bold text-gray-900 text-center">
                    🏆 Доверьтесь профессионалам компании "Гарант Ипотеки" — мы
                    сопровождаем Вас на каждом этапе!
                  </p>
                </div>

                <div className="text-center mt-8">
                  <button
                    onClick={closeThankYouModal}
                    className="bg-gradient-to-r from-brandYellow to-brandOrange text-gray-900 font-bold py-3 px-8 rounded-xl hover:scale-105 transition-transform duration-300"
                  >
                    Понятно, спасибо!
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
