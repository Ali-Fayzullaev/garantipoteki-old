/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Корпоративные цвета логотипа
        primary: {
          50: '#fefdf7',
          100: '#fefaec',
          200: '#fdf2d0',
          300: '#fce7a9',
          400: '#fad777',
          500: '#F6DB4A', // Основной жёлтый цвет логотипа
          600: '#e8c43d',
          700: '#d4a933',
          800: '#ad872e',
          900: '#8b6f2a',
          950: '#4f3d15',
        },
        secondary: {
          50: '#fef6f2',
          100: '#feeae1',
          200: '#fed2c2',
          300: '#fcb297',
          400: '#f8855f',
          500: '#DE6A2A', // Основной оранжевый цвет логотипа
          600: '#d25d24',
          700: '#af4b1f',
          800: '#8c3f1e',
          900: '#72361e',
          950: '#3d1a0d',
        },
        accent: {
          50: '#ffffff', // Белый цвет логотипа
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#eeeeee',
          400: '#e0e0e0',
          500: '#bdbdbd',
          600: '#9e9e9e',
          700: '#757575',
          800: '#424242',
          900: '#212121',
          950: '#0f0f0f',
        },
        // Сохраняем корпоративные цвета для прямого использования
        brandYellow: '#F6DB4A',
        brandOrange: '#DE6A2A',
        brandWhite: '#ffffff',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 