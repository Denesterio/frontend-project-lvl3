import i18next from 'i18next';
import resources from '../locales';
import app from './app.js';

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      debug: false,
      resources,
    })
    .then(() => {
      app(i18nInstance);
    });
};
