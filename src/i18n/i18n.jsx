import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './langs/en.json'
import ru from './langs/ru.json'

const resources = {
    en: {
        translation: en
    },
    ru: {
        translation: ru
    }
};

i18n.use(initReactI18next) // Подключаем i18next к React
    .init({
        resources,
        lng: 'en', // Язык по умолчанию
        fallbackLng: 'en', // Язык для использования, если перевод не найден
        interpolation: {
            escapeValue: false, // Не экранируем строки (это не нужно для React)
        }
    });

export default i18n;
