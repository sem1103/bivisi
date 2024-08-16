import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Автоопределение языка

import enSidebarMenu from './langs/en/sidebarMenu.json';
import enTopHeader from './langs/en/topHeader.json'
import enHomePage from './langs/en/homePage.json'


import ruSidebarMenu from './langs/ru/sidebarMenu.json'
import ruTopHeader from './langs/ru/topHeader.json'
import ruHomePage from './langs/ru/homePage.json'



const resources = {
    en: {
        sidebarMenu: enSidebarMenu,
        topHeader : enTopHeader,
        homePage : enHomePage
    },
    ru: {
        sidebarMenu: ruSidebarMenu,
        topHeader : ruTopHeader,
        homePage : ruHomePage

    }
};

i18n.use(LanguageDetector).use(initReactI18next) // Подключаем i18next к React
    .init({
        resources,
        fallbackLng: 'en', // Язык для использования, если перевод не найден
        ns: ['sidebarMenu', 'topHeader', 'homePage'],

    });

export default i18n;
