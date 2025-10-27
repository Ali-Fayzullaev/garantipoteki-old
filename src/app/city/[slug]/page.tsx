// src/app/city/[slug]/page.tsx
"use client";

import { useState, use } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createDeal, getServices, updateDeal, updateTxt } from "@/api/api";
import LeadForm from "@/components/LeadForm";
import OfficesCarousel from "@/components/OfficesCarousel";

type ServiceType = {
  id: number;
  company_id: number;
  name: string;
  order_number: number;
};

function formatPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (!digits.startsWith("7")) digits = "7" + digits;
  let formatted = "+7 ";
  if (digits.length > 1) formatted += digits.slice(1, 4);
  if (digits.length > 4) formatted += " " + digits.slice(4, 7);
  if (digits.length > 7) formatted += "-" + digits.slice(7, 9);
  if (digits.length > 9) formatted += "-" + digits.slice(9, 11);
  return formatted;
}

function formatPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

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
  const borderColor =
    color === "brandYellow" ? "border-brandYellow" : "border-brandOrange";
  return (
    <div
      className={`bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl shadow-[#f6dc49]/70 hover:shadow-2xl transition-all duration-500 w-80 h-64 group overflow-hidden border-l-4 border-[#da6d2a] relative`}
    >
      {/* Декоративный элемент */}
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
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden relative w-80 h-96"
    >
      {/* Градиентный фон при ховере */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

      <div className="relative z-10 text-center h-full flex flex-col justify-between">
        <div className="space-y-6">
          {/* Фото с современным обрамлением */}
          <div className="w-28 h-28 mx-auto relative">
            <div className="absolute inset-0 bg-brand-gradient rounded-full p-1 group-hover:scale-110 transition-transform duration-300">
              <div className="bg-white rounded-full p-1">
                <Image
                  src={photo}
                  alt={name}
                  width={112}
                  height={112}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            {/* Статус индикатор */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Информация */}
          <div className="space-y-3">
            <h3 className="text-xl mt-10 font-bold text-gray-900 group-hover:text-secondary-600 transition-colors duration-300">
              {name}
            </h3>
            <div className="inline-flex items-center gap-2 bg-primary-50 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                />
              </svg>
              {position}
            </div>
          </div>
        </div>

        {/* Опыт работы */}
        <div className="bg-gray-50 group-hover:bg-white rounded-2xl p-4 transition-colors duration-300 border group-hover:border-secondary-200">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <svg
              className="w-5 h-5 text-secondary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">Опыт: {experience}</span>
          </div>
        </div>
      </div>
    </motion.div>
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
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: форма, 2: выбор услуги, 3: успех
  const [dealId, setDealId] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceType[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const deal = await createDeal({
        name: formData.name,
        phone_number: formatPhoneNumber(formData.phone),
      });
      setDealId(deal.id);
      const services = await getServices();
      setServices(services);

      setIsLoading(false);
      setStep(2);
    } catch (e) {
      setIsLoading(false);
      // Показываем ошибку или продолжаем
      setStep(2);
    }
  };

  const handleServiceSelect = async (service_id: number, service: string) => {
    if (!dealId) {
      setStep(1);
      return;
    }
    setIsLoading(true);
    try {
      await updateDeal(
        {
          service_id: service_id,
          phone_number: formatPhoneNumber(formData.phone),
        },
        dealId
      );

      try {
        await updateTxt({
          name: formData.name,
          phone: formData.phone,
          service: service,
        });
      } catch (error) {
        console.error(error);
      }

      // Отслеживание события Facebook Pixel
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: service,
          content_category: "form_submission",
        });
      }

      setIsLoading(false);
      setStep(3);
      setTimeout(() => {
        setIsModalOpen(false);
        setStep(1);
        setFormData({ name: "", phone: "" });
        // Показываем модальное окно с благодарностью через 1.5 секунды
        setTimeout(() => {
          setIsThankYouModalOpen(true);
        }, 1500);
      }, 2000);
    } catch (e) {
      setIsLoading(false);
      // Показываем ошибку или продолжаем
      setStep(3);
      setTimeout(() => {
        setIsModalOpen(false);
        setStep(1);
        setFormData({ name: "", phone: "" });
        setTimeout(() => {
          setIsThankYouModalOpen(true);
        }, 1500);
      }, 2000);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setStep(1);
    setFormData({ name: "", phone: "" });
  };

  const openPrivacyModal = () => setIsPrivacyModalOpen(true);
  const closePrivacyModal = () => setIsPrivacyModalOpen(false);

  const openThankYouModal = () => setIsThankYouModalOpen(true);
  const closeThankYouModal = () => setIsThankYouModalOpen(false);

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 text-gray-900 relative overflow-hidden">
      {/* Современный анимированный фон с градиентами */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 -z-10 pointer-events-none"
      >
        {/* Основной градиентный фон */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 via-white to-secondary-50/60"></div>

        {/* Плавающие геометрические элементы */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0],
          }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-primary-400/25 to-secondary-400/25 rounded-lg blur-xl rotate-45"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl"
        />

        {/* Сетка точек для современного вида */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </motion.div>

      {/* --- Современная фиксированная шапка --- */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg shadow-black/[0.03]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <Image
              src="/logo.png"
              alt="GARANT IPOTEKI логотип"
              width={160}
              height={44}
              className="h-11 w-auto object-contain"
              priority
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={openModal}
            className="btn-primary group font-semibold rounded-xl px-6 py-3 text-sm shadow-brand hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Оставить заявку
            </span>
          </motion.button>
        </div>
      </header>

      {/* Hero-секция с современным дизайном */}
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Левая колонка - контент */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-brand-light text-brand-dark px-4 py-2 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-brand-gradient rounded-full animate-pulse"></div>
                Лидер рынка ипотечного кредитования в {cityConfig.name}
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl lg:text-7xl font-bold tracking-tight"
              >
                <span className="text-brand-gradient">GARANT</span>
                <br />
                <span className="text-gray-900">IPOTEKI</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg"
              >
                Кредиты и ипотека под ключ в {cityConfig.name}.
                <span className="font-semibold text-gray-900">
                  Без первоначального взноса
                </span>{" "}
                и даже с действующими кредитами.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={openModal}
                  className="btn-primary group px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl"
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(222, 106, 42, 0.25)",
                  }}
                >
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Получить консультацию
                  </span>
                </button>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full border-2 border-white"></div>
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full border-2 border-white"></div>
                    <div className="w-10 h-10 bg-brand-gradient rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">
                      1000+ клиентов
                    </div>
                    <div className="text-gray-500">доверяют нам</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  />
                </svg>
                Консультация бесплатно
              </motion.div>
            </motion.div>

            {/* Правая колонка - видео */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                {/* Декоративный элемент */}
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-3xl blur-3xl"></div>
                <div
                  className="absolute -bottom-4 -right-4 w-72 h-72 opacity-20 rounded-3xl blur-3xl"
                  style={{
                    background: "linear-gradient(to right, #F6DB4A, #DE6A2A)",
                  }}
                ></div>

                {/* Видео контейнер */}
                <div className="relative bg-white rounded-3xl p-2 shadow-2xl shadow-black/10">
                  <video
                    src="/video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-80 lg:h-96 object-cover rounded-2xl"
                    onLoadedData={(e) => {
                      // Принудительно запускаем воспроизведение при загрузке данных
                      e.currentTarget.play().catch(() => {
                        console.log(
                          "Автовоспроизведение заблокировано браузером"
                        );
                      });
                    }}
                    onCanPlay={(e) => {
                      // Дополнительная гарантия воспроизведения
                      e.currentTarget.play().catch(() => {
                        console.log(
                          "Автовоспроизведение заблокировано браузером"
                        );
                      });
                    }}
                  />

                  {/* Условно отображаем плей кнопку только если видео не воспроизводится */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-secondary-600 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 5v10l8-5-8-5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Статистика карточки */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl shadow-black/10"
                >
                  <div className="text-2xl font-bold text-secondary-600">
                    4.9⭐
                  </div>
                  <div className="text-sm text-gray-600">Рейтинг в 2GIS</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Блок с адресами офисов */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              Наши офисы
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Найдите нас в {cityConfig.name}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Приходите к нам за персональной консультацией
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-10">
            {slug === "kokshetau" && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <OfficeCard
                  city="Кокшетау"
                  address="Н.Назарбаева 29Б, 4 этаж, кабинет 406"
                  phone="+7 700 482 4545"
                  color="brandYellow"
                  mapLink="https://go.2gis.com/xH89z"
                />
              </motion.div>
            )}
            {slug === "kostanay" && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <OfficeCard
                  city="Костанай"
                  address="БЦ Атриум ​Проспект Аль-Фараби, 74​1, 8 офис; 1 этаж"
                  phone="+7 777 043 89 12"
                  color="brandYellow"
                  mapLink="https://go.2gis.com/oqJeX"
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>
      {/* Современная секция экспертов */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Наша команда
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Лучшие эксперты по кредитованию
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Профессионалы с многолетним опытом помогут вам получить кредит на
              лучших условиях
            </p>
          </motion.div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full"
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

            {/* Современные кнопки навигации */}
            <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 group">
              <svg
                className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 group">
              <svg
                className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Современная галерея с CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Наша работа в фотографиях
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Посмотрите, как мы помогаем клиентам осуществить мечту о
              собственном жилье
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/ph1.jpg"
                alt="Успешные клиенты с ключами от нового дома"
                width={400}
                height={300}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(to top, rgba(222, 106, 42, 0.7), rgba(222, 106, 42, 0.2), transparent)",
                }}
              ></div>
              <div className="absolute bottom-6 left-6 right-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                <h3 className="text-white font-bold text-lg mb-2">
                  Счастливые клиенты
                </h3>
                <p className="text-white/90 text-sm">
                  Получили ключи от новой квартиры
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/ph2.jpg"
                alt="Команда профессионалов за работой"
                width={400}
                height={300}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 via-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute bottom-6 left-6 right-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                <h3 className="text-white font-bold text-lg mb-2">
                  Наша команда
                </h3>
                <p className="text-white/90 text-sm">
                  Профессионалы с многолетним опытом
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src="/ph3.jpg"
                alt="Современный офис с удобной атмосферой"
                width={400}
                height={300}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(to top, rgba(246, 219, 74, 0.7), rgba(246, 219, 74, 0.2), transparent)",
                }}
              ></div>
              <div className="absolute bottom-6 left-6 right-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                <h3 className="text-white font-bold text-lg mb-2">
                  Комфортный офис
                </h3>
                <p className="text-white/90 text-sm">
                  Приятная атмосфера для консультаций
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA блок */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden bg-brand-gradient"
          >
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: "linear-gradient(to right, #DE6A2A, #F6DB4A)",
              }}
            ></div>
            <div className="relative">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Готовы стать нашим следующим успешным клиентом?
              </h3>
              <p className="text-xl mb-8 text-orange-100">
                Получите бесплатную консультацию в {cityConfig.name} и узнайте
                свои возможности уже сегодня
              </p>
              <button
                onClick={openModal}
                className="bg-white  text-black/80 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Получить консультацию
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Блок 5 — Лид-форма */}
      <section id="leadform" className="py-16 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          Бесплатная консультация в {cityConfig.name}
        </h2>
        <LeadForm onSuccess={openThankYouModal} cityCode={cityConfig.code} />
      </section>

      {/* Секция преимуществ с современным дизайном */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                />
              </svg>
              Наши преимущества
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Мы предлагаем лучшие условия кредитования в {cityConfig.name}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative"
            >
              <div className="h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-b-4 border-blue-500 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  💰
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Без первоначального взноса
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Получите ипотечный кредит без необходимости вносить
                  первоначальный взнос
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative"
            >
              <div className="h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-b-4 border-emerald-500 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  🏦
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  До 8 млн тенге
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Максимальная сумма кредита без подтверждения дохода и справок
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative"
            >
              <div className="h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-b-4 border-amber-500 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  ⭐
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Рейтинг 4.9
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Высокий рейтинг в 2GIS на основе более тысячи отзывов клиентов
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group relative"
            >
              <div className="h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-b-4 border-brandOrange group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-brandOrange to-[#da6d2a] rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  🔄
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  С действующими кредитами
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Получите новый кредит даже при наличии других займов
                </p>
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
      {/* Современный футер */}
      <footer className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Компания */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-brand-gradient">
                  GARANT IPOTEKI
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                  Ведущая компания по ипотечному кредитованию в Казахстане.
                  Помогаем осуществить мечту о собственном жилье.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-2xl p-6 space-y-3">
                <h4 className="font-semibold mb-3" style={{ color: "#F6DB4A" }}>
                  Реквизиты компании
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                  <div>БИН: 240840010906</div>
                  <div>г. Астана, 2025</div>
                </div>
                <div className="text-gray-300 text-sm">
                  <p className="font-medium">Головной офис:</p>
                  <p>Проспект Б. Момышұлы 2/5</p>
                </div>
              </div>
            </div>

            {/* Контакты */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold" style={{ color: "#F6DB4A" }}>
                Контакты
              </h3>
              <div className="space-y-4">
                <a
                  href="tel:+77075759707"
                  className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 bg-secondary-600 rounded-xl flex items-center justify-center group-hover:bg-secondary-700 transition-colors duration-300">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">+7 707 575 97 07</div>
                    <div className="text-sm text-gray-400">Основной номер</div>
                  </div>
                </a>

                <a
                  href="mailto:maksatzhusupov@mail.ru"
                  className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-700 transition-colors duration-300">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold break-all">
                      maksatzhusupov@mail.ru
                    </div>
                    <div className="text-sm text-gray-400">Email для связи</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Социальные сети */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold" style={{ color: "#F6DB4A" }}>
                Мы в соцсетях
              </h3>
              <div className="space-y-4">
                <a
                  href="https://wa.me/77075759707"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-300 hover:text-green-400 transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-700 transition-all duration-300 group-hover:scale-110">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                  </div>
                  <span className="font-medium">WhatsApp</span>
                </a>

                <a
                  href="https://www.instagram.com/garant_ipoteki.astana/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-300 hover:text-pink-400 transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300 group-hover:scale-110">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <span className="font-medium">Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Разделитель и нижняя часть */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © 2025 GARANT IPOTEKI. Все права защищены.
              </div>
              <button
                onClick={openPrivacyModal}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm underline-offset-4 hover:underline"
              >
                Политика конфиденциальности
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Модальное окно - используем LeadForm */}
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

                <div className="bg-yellow-50 border-l-4 border-brandYellow p-4 rounded-r-lg mt-6">
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
