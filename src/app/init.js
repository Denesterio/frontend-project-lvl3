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

export default () => {
  if (document.readyState === 'complete' || document.readyState === 'loaded') {
    initApp();
  } else {
    document.addEventListener('DOMContentLoaded', initApp);
  }
};
