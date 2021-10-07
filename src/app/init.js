import i18next from 'i18next';
import resources from '../locales';
import app from './app.js';

const initApp = () => {
  const i18nInstance = i18next.createInstance();
  // prettier-ignore
  return (
    i18nInstance
      .init({
        lng: 'ru',
        debug: false,
        resources,
      })
      .then(() => app(i18nInstance))
  );
};

// prettier-ignore
export default () => new Promise((resolve) => {
  if (document.readyState === 'complete' || document.readyState === 'loaded') {
    initApp();
    resolve();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      initApp();
      resolve();
    });
  }
});
