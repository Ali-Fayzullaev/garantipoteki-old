// src/components/LeadForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
}

function LeadForm({ onSuccess, cityCode }: LeadFormProps) {
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
      // Передаем cityCode в API функции
      const deal = await createDeal({
        name: formData.name,
        phone_number: formatPhoneNumber(formData.phone),
      }, cityCode);
      
      setDealId(deal.id);
      const services = await getServices(cityCode);
      setServices(services);

      setIsLoading(false);
      setStep(2);
    } catch (e) {
      setIsLoading(false);
      setStep(2);
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4 border-t-4 border-[#da6d2a]"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Оставить заявку
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold text-gray-900 text-lg mb-2">
              Имя
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brandOrange focus:border-transparent transition-all duration-300"
              placeholder="Ваше имя"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setError("");
              }}
            />
          </div>
          <div>
            <label className="font-semibold text-gray-900 text-lg mb-2">
              Телефон
            </label>
            <input
              type="tel"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brandOrange focus:border-transparent transition-all duration-300"
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
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#f6dc49] text-gray-900 font-bold py-3 rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Отправка...
              </div>
            ) : (
              "Продолжить"
            )}
          </button>
        </form>
      </motion.div>
    );
  if (step === 2)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4 border-t-4 border-[#da6d2a]"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Выберите услугу
        </h3>
        <div className="space-y-3">
          {services.map((s) => (
            <button
              key={s.id}
              className="w-full bg-gradient-to-r from-brandYellow to-brandOrange text-gray-900 font-bold py-4 rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 border-2 border-transparent hover:border-[#da6d2a] shadow-lg hover:shadow-xl"
              onClick={() => handleServiceSelect(s.id, s.name)}
            >
              {s.name}
            </button>
          ))}
        </div>
        {isLoading && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            Обработка...
          </div>
        )}
      </motion.div>
    );
  if (step === 3 && !success)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center gap-4 border-t-4 border-[#da6d2a]"
      >
        <div className="w-16 h-16 border-4 border-brandYellow border-dashed rounded-full animate-spin mb-4"></div>
        <div className="text-gray-900 font-semibold text-lg text-center">
          Мы подбираем для вас нашего лучшего менеджера.
          <br />
          Ожидайте звонка!
        </div>
      </motion.div>
    );
  if (step === 4)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center gap-4 border-t-4 border-[#da6d2a]"
      >
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Заявка отправлена!
        </h3>
        <p className="text-gray-600 text-center">
          Мы свяжемся с вами в ближайшее время
        </p>
      </motion.div>
    );
  return null;
}

export default LeadForm;