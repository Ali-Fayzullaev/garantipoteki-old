// src/components/ScheduleForm.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Функции валидации
function validatePhone(phone: string) {
  return /^\+7\s?\d{3}\s?\d{3}-\d{2}-\d{2}$/.test(phone);
}

function validateName(name: string) {
  return name.trim().length >= 2;
}

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

interface ScheduleFormProps {
  onSuccess?: () => void;
}

function ScheduleForm({ onSuccess }: ScheduleFormProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    phone: "",
    date: "",
    time: ""
  });

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
    if (!formData.date) {
      setError("Выберите дату для видеосозвона");
      setIsLoading(false);
      return;
    }
    if (!formData.time) {
      setError("Выберите время для видеосозвона");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'schedule',
          name: formData.name,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка отправки заявки');
      }

      setIsLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        setFormData({ name: "", phone: "", date: "", time: "" });
        setSuccess(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 3000);
    } catch (e) {
      setIsLoading(false);
      setError(e instanceof Error ? e.message : "Произошла ошибка при отправке заявки");
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
        
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="text-6xl"
          >
            🎥
          </motion.div>
          
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-gray-900">
              Заявка на видеосозвон отправлена!
            </h3>
            
            <div className="bg-green-50 rounded-2xl p-6 border-l-4 border-green-500">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span className="font-semibold">Успешно отправлено</span>
                </div>
                <p className="text-green-700">
                  Мы подтвердим время созвона и пришлем ссылку на видеосозвон
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Записаться на видеосозвон
        </h3>
        <p className="text-gray-600">
          Удобный формат консультации из дома
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
              onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
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
              onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Дата
            </label>
            <input
              type="date"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white"
              onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              value={formData.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                setError("");
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Время
            </label>
            <select
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white"
              onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              value={formData.time}
              onChange={(e) => {
                setFormData({ ...formData, time: e.target.value });
                setError("");
              }}
            >
              <option value="">Выберите время</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
            </select>
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
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Отправка заявки...
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Записаться на видеосозвон
            </span>
          )}
        </motion.button>

        <p className="text-xs text-gray-500 text-center">
          Нажимая кнопку, вы соглашаетесь с 
          <span className="text-purple-600 underline cursor-pointer"> политикой конфиденциальности</span>
        </p>
      </form>
    </motion.div>
  );
}

export default ScheduleForm;