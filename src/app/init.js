import i18next from 'i18next';
import resources from '../locales';
import app from './app.js';

// prettier-ignore
export default () => new Promise((resolve) => {
  const i18nInstance = i18next.createInstance();
  // prettier-ignore
  i18nInstance
    .init({
      lng: 'ru',
      debug: false,
      resources,
    })
    .then(() => {
      app(i18nInstance);
      resolve();
    });
});
