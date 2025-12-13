// Файл: garantipoteki-old/src/app/api/submit-form/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Ваши данные из Green API
const API_URL = "https://7700.api.greenapi.com";
const ID_INSTANCE = "7700282474";
const API_TOKEN_INSTANCE = "6ac6e2edd6a94d9990bf32b96135d382d954bd87a719413c88";

// Группы WhatsApp для каждого города
const CITY_WHATSAPP_GROUPS: { [key: string]: string } = {
  'kokshetau': '120363421223135306@g.us', // Кокшетау
  'kostanay': '120363422579189322@g.us', // Костанай
  'petropavlovsk': '120363408117537825@g.us', // Петропавловск
  'default': '120363402124315588@g.us' // Основная группа (Астана)
};

// Функция для получения ID группы по коду города
function getCityGroupId(cityCode?: string): string {
  if (!cityCode) return CITY_WHATSAPP_GROUPS.default;
  return CITY_WHATSAPP_GROUPS[cityCode] || CITY_WHATSAPP_GROUPS.default;
}

// Функция для отправки в WhatsApp
async function sendToWhatsApp(message: string, groupId: string) {
  try {
    console.log(`Отправляем сообщение в группу: ${groupId}`);
    console.log(`Сообщение: ${message}`);
    
    const response = await fetch(`${API_URL}/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN_INSTANCE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: groupId,
        message: message
      }),
    });

    const responseText = await response.text();
    console.log(`Ответ от Green API (статус ${response.status}):`, responseText);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`, responseText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log('Сообщение отправлено успешно:', result);
    return result;
  } catch (error) {
    console.error('Error sending to WhatsApp:', error);
    throw error;
  }
}

// Функция для форматирования номера телефона
function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11 && cleaned.startsWith('8')) {
    return `+7 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+7 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  } else if (cleaned.length === 10) {
    return `+7 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
}

// Функция для получения названия города
function getCityName(cityCode?: string): string {
  const cityNames: { [key: string]: string } = {
    'kokshetau': 'Кокшетау',
    'kostanay': 'Костанай',
    'petropavlovsk': 'Петропавловск'
  };
  
  if (!cityCode) return 'Астана';
  return cityNames[cityCode] || 'Астана';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, phone, date, time, cityCode, service } = body;

    console.log('Получена заявка:', { type, name, phone, cityCode, service });

    // Валидация обязательных полей
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: 'Имя и телефон обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Валидация номера телефона
    const phoneRegex = /^[\+]?[7-8]?[0-9\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { success: false, message: 'Введите корректный номер телефона' },
        { status: 400 }
      );
    }

    // Валидация даты для видеосозвона
    if (type === 'schedule') {
      if (!date || !time) {
        return NextResponse.json(
          { success: false, message: 'Для записи на видеосозвон необходимо указать дату и время' },
          { status: 400 }
        );
      }
    }

    // Форматируем данные
    const formattedPhone = formatPhoneNumber(phone);
    const cityName = getCityName(cityCode);
    const groupId = getCityGroupId(cityCode);

    // Формируем сообщение для WhatsApp
    let message = '';
    if (type === 'form') {
      message = `📞 Новая заявка на обратный звонок!

👤 Имя: ${name}
📱 Телефон: ${formattedPhone}
🏙️ Город: ${cityName}`;
      
      if (service) {
        message += `\n🎯 Услуга: ${service}`;
      }
      
      message += `\n\n📅 Дата: ${new Date().toLocaleDateString('ru-RU')}
⏰ Время: ${new Date().toLocaleTimeString('ru-RU')}`;
    } else if (type === 'schedule') {
      message = `🎥 Новая заявка на видеосозвон!

👤 Имя: ${name}
📱 Телефон: ${formattedPhone}
🏙️ Город: ${cityName}
📅 Дата созвона: ${date}
⏰ Время созвона: ${time}`;
      
      if (service) {
        message += `\n🎯 Услуга: ${service}`;
      }
      
      message += `\n\n📅 Дата подачи: ${new Date().toLocaleDateString('ru-RU')}
⏰ Время подачи: ${new Date().toLocaleTimeString('ru-RU')}`;
    }

    // Отправляем в WhatsApp
    await sendToWhatsApp(message, groupId);

    // Логируем в консоль
    console.log('Form submitted successfully:', {
      type,
      name,
      phone: formattedPhone,
      cityCode,
      cityName,
      groupId,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: type === 'form' 
        ? 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.' 
        : 'Заявка на видеосозвон успешно отправлена! Мы подтвердим время созвона.'
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { success: false, message: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.' },
      { status: 500 }
    );
  }
}

// GET endpoint для тестирования
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  const groupId = url.searchParams.get('groupId');
  const cityCode = url.searchParams.get('cityCode');

  if (action === 'test' && groupId) {
    const testMessage = `🧪 Тест сообщения
📅 ${new Date().toLocaleDateString('ru-RU')}
⏰ ${new Date().toLocaleTimeString('ru-RU')}`;
    
    try {
      const result = await sendToWhatsApp(testMessage, groupId);
      return NextResponse.json({ success: true, result });
    } catch (error) {
      return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  if (action === 'testCity' && cityCode) {
    const groupId = getCityGroupId(cityCode);
    const cityName = getCityName(cityCode);
    const testMessage = `🧪 Тест для города ${cityName}
📅 ${new Date().toLocaleDateString('ru-RU')}
⏰ ${new Date().toLocaleTimeString('ru-RU')}`;
    
    try {
      const result = await sendToWhatsApp(testMessage, groupId);
      return NextResponse.json({ success: true, cityCode, cityName, groupId, result });
    } catch (error) {
      return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  return NextResponse.json({ 
    message: 'API для тестирования WhatsApp',
    availableActions: [
      'GET /api/submit-form?action=test&groupId=XXX - тест конкретной группы',
      'GET /api/submit-form?action=testCity&cityCode=petropavlovsk - тест группы города',
    ],
    cityGroups: CITY_WHATSAPP_GROUPS
  });
}