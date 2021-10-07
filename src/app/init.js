import i18next from 'i18next';
import resources from '../locales';
import app from './app.js';

export default () => {
  const i18nInstance = i18next.createInstance();
  // prettier-ignore
  return (
    i18nInstance
      .init({
        lng: 'ru',
        debug: false,
        resources,
      })
      .then(() => new Promise((resolve) => {
        app(i18nInstance);
        resolve();
      }))
  );
};
