import * as yup from 'yup';
import onChange from 'on-change';
import view from './view.js';
import addFeed from './addFeed.js';

// prettier-ignore
export default (i18nInstance) => new Promise((resolve) => {
  yup.setLocale({
    mixed: {
      default: i18nInstance.t('ValidationError'),
      required: i18nInstance.t('requiredError'),
      notOneOf: i18nInstance.t('notOneOfError'),
    },
    string: {
      url: i18nInstance.t('urlError'),
    },
  });

  const state = {
    rssForm: {
      // 'filling' - ожидание, заполнение
      // 'sending' - процесс запроса
      // 'finished' - удачный запрос
      // 'failed' - неудачный запрос
      state: 'filling',
      errors: [],
    },
    feeds: [],
    posts: [],
    activePost: null,
    readPostsLinks: [],
  };

  const form = document.querySelector('.rss_form');
  const stateWatcher = onChange(state, (path, value) => {
    view(path, value, i18nInstance, form);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    stateWatcher.rssForm.state = 'sending';
    const formData = new FormData(event.target);
    const url = formData.get('url').trim();
    const streams = stateWatcher.feeds.map((feed) => feed.stream);
    const schema = yup.string().required().url().notOneOf(streams);
    schema
      .validate(url, {
        abortEarly: false,
        strict: true,
      })
      .then(() => {
        addFeed(stateWatcher, url, i18nInstance);
      })
      .catch((error) => {
        stateWatcher.rssForm.errors = error.errors;
        stateWatcher.rssForm.state = 'failed';
      });
  });

  resolve();
});
