// src/components/LeadForm.tsx - Современная версия
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createDeal, getServices, updateDeal, updateTxt } from '@/api/api';

// Добавляем тип ServiceType
type ServiceType = {
  id: number;
  company_id: number;
  name: string;
  order_number: number;
};

// Вспомогательные функции для форматирования телефона
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

// Функции валидации
function validatePhone(phone: string) {
  return /^\+7\s?\d{3}\s?\d{3}-\d{2}-\d{2}$/.test(phone);
}

function validateName(name: string) {
  return name.trim().length >= 2;
}

interface LeadFormProps {
  onSuccess?: () => void;
  cityCode?: string;
  useWhatsApp?: boolean; // Новый проп для определения использования WhatsApp логики
}

function LeadForm({ onSuccess, cityCode, useWhatsApp = false }: LeadFormProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Добавляем состояние success
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [dealId, setDealId] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceType[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateName(formData.name)) {
      setError("Введите корректное имя (минимум 2 символа)");
      setIsLoading(false);
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError("Введите корректный номер в формате +7 777 123-45-67");
      setIsLoading(false);
      return;
    }

    try {
      if (useWhatsApp) {
        // Новая логика с отправкой в WhatsApp
        const response = await fetch('/api/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'form',
            name: formData.name,
            phone: formData.phone,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Ошибка отправки заявки');
        }

        setIsLoading(false);
        setSuccess(true);
        setStep(3);
        
        setTimeout(() => {
          setStep(4);
          setTimeout(() => {
            setStep(1);
            setFormData({ name: "", phone: "" });
            setServices([]);
            setTimeout(() => {
              if (onSuccess) {
                onSuccess();
              }
            }, 1500);
          }, 2000);
        }, 2000);
      } else {
        // Старая логика для городских страниц
        const deal = await createDeal({
          name: formData.name,
          phone_number: formatPhoneNumber(formData.phone),
        }, cityCode);
        
        setDealId(deal.id);
        const services = await getServices(cityCode);
        setServices(services);

        setIsLoading(false);
        setStep(2);
      }
    } catch (e) {
      setIsLoading(false);
      if (useWhatsApp) {
        setError(e instanceof Error ? e.message : "Произошла ошибка при отправке заявки");
      } else {
        // Для старой логики продолжаем к выбору услуг даже при ошибке
        setStep(2);
      }
    }
  };

  const handleServiceSelect = async (service_id: number, service: string) => {
    if (!dealId) return;
    setIsLoading(true);
    try {
      // Передаем cityCode в updateDeal
      await updateDeal(
        { service_id: service_id, phone_number: formatPhoneNumber(formData.phone) },
        dealId,
        cityCode
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

      // Facebook Pixel
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: service,
          content_category: "form_submission",
        });
      }

      setIsLoading(false);
      setSuccess(true); // Устанавливаем success в true
      setStep(3);
      setTimeout(() => {
        setStep(4);
        setTimeout(() => {
          setStep(1);
          setFormData({
            name: "",
            phone: "",
          });
          setServices([]);
          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            }
          }, 1500);
        }, 2000);
      }, 2000);
    } catch (e) {
      setIsLoading(false);
      setStep(3);
      setTimeout(() => {
        setStep(4);
        setTimeout(() => {
          setStep(1);
          setFormData({
            name: "",
            phone: "",
          });
          setServices([]);
          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            }
          }, 1500);
        }, 2000);
      }, 2000);
    }
  };

  if (step === 1)
    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
      >
        {/* Декоративный градиент */}
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-gradient"></div>
        
        {/* Заголовок */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Получить консультацию
          </h3>
          <p className="text-gray-600">
            Наш эксперт свяжется с вами в течение 5 минут
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ваше имя
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-0 transition-all duration-300 placeholder-gray-400 bg-gray-50 focus:bg-white"
                onFocus={(e) => e.target.style.borderColor = '#DE6A2A'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                placeholder="Введите ваше имя"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setError("");
                }}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Номер телефона
            </label>
            <div className="relative">
              <input
                type="tel"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-0 transition-all duration-300 placeholder-gray-400 bg-gray-50 focus:bg-white"
                onFocus={(e) => e.target.style.borderColor = '#DE6A2A'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                placeholder="+7 777 123-45-67"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    phone: formatPhone(e.target.value),
                  });
                  setError("");
                }}
                maxLength={16}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg"
              >
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full font-semibold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Отправка заявки...
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Получить консультацию
              </span>
            )}
          </motion.button>

          <p className="text-xs text-gray-500 text-center">
            Нажимая кнопку, вы соглашаетесь с 
            <span className="text-secondary-600 underline cursor-pointer"> политикой конфиденциальности</span>
          </p>
        </form>
      </motion.div>
    );
  if (step === 2 && !useWhatsApp)
    return (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
      >
        {/* Декоративный градиент */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600"></div>
        
        {/* Заголовок */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Выберите услугу
          </h3>
          <p className="text-gray-600">
            Что вас интересует больше всего?
          </p>
        </div>

        <div className="space-y-3">
          {services.map((s, index) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary-50 to-secondary-50 hover:from-primary-100 hover:to-secondary-100 text-gray-900 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 border-2 border-secondary-200 hover:border-secondary-400 hover:shadow-lg group"
              onClick={() => handleServiceSelect(s.id, s.name)}
              disabled={isLoading}
            >
              <div className="flex items-center justify-between">
                <span>{s.name}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#DE6A2A' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 bg-primary-50 rounded-2xl p-4"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-secondary-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-secondary-700 font-medium">Обработка вашей заявки...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  if (step === 3 && !success)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
      >
        {/* Анимированный градиент */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 animate-pulse"></div>
        
        <div className="text-center space-y-6">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-20 h-20 mx-auto"
          >
            <div className="w-full h-full border-4 border-amber-500 border-t-transparent rounded-full"></div>
          </motion.div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Подбираем эксперта
            </h3>
            <div className="bg-amber-50 rounded-2xl p-4 border-l-4 border-amber-500">
              <p className="text-amber-800 font-medium">
                Мы подбираем для вас нашего лучшего специалиста по ипотеке
              </p>
            </div>
            <div className="bg-primary-50 rounded-2xl p-4 border-l-4 border-secondary-500">
              <p className="text-secondary-800 font-medium">
                Ожидайте звонка в течение 5 минут!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  if (step === 4)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
      >
        {/* Праздничный градиент */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
        
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="text-6xl"
          >
            🎉
          </motion.div>
          
          <div className="space-y-4">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-gray-900"
            >
              Заявка отправлена!
            </motion.h3>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-green-50 rounded-2xl p-6 border-l-4 border-green-500"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span className="font-semibold">Успешно отправлено</span>
                </div>
                <p className="text-green-700">
                  Наш специалист свяжется с вами в ближайшее время для консультации
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-600 text-sm"
            >
              Спасибо за доверие! 💙
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  return null;
}

export default LeadForm;