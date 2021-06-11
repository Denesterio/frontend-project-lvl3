import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import resources from '../locales';
import renderError from './renderErrors.js';
import processHandler from './processHandler.js';
import rssParse from './rssParser.js';
import { renderList, getTitle } from './renderContent.js';

const schema = yup.string().url();

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
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
    streams: [],
  };

  const form = document.querySelector('.rss_form');
  const containers = {
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const stateWatcher = onChange(state, (path, value) => {
    if (path === 'rssForm.errors' && value.length > 0) {
      renderError(value, form, i18nInstance);
    } else if (path === 'rssForm.state') {
      processHandler(value, i18nInstance);
    } else if (path === 'feeds' || path === 'posts') {
      containers[path].innerHTML = '';
      const title = getTitle(path, i18nInstance);
      const list = renderList(path, value);
      containers[path].append(title);
      containers[path].append(list);
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    stateWatcher.rssForm.state = 'sending';

    const formData = new FormData(event.target);
    const url = formData.get('rssUrl');
    const duplicate = stateWatcher.streams.find((stream) => stream === url);
    if (duplicate) {
      stateWatcher.rssForm.errors.push({ name: 'DuplicateError' });
      stateWatcher.rssForm.state = 'failed';
      return;
    }

    try {
      schema.validateSync(url);
    } catch (error) {
      stateWatcher.rssForm.errors.push(error);
      stateWatcher.rssForm.state = 'failed';
      return;
    }

    stateWatcher.streams.push(url);
    const uri = encodeURIComponent(url);
    axios
      .get(`https://hexlet-allorigins.herokuapp.com/get?url=${uri}`)
      .then(({ data }) => {
        const id = stateWatcher.feeds.length + 1;
        try {
          const [feed, post] = rssParse(data.contents, id);
          stateWatcher.feeds = [feed, ...stateWatcher.feeds];
          stateWatcher.posts = [post, ...stateWatcher.posts];
        } catch (error) {
          stateWatcher.rssForm.state = 'failed';
          stateWatcher.rssForm.errors.push({ name: 'ParsingError' });
          return;
        }

        stateWatcher.rssForm.state = 'finished';
        stateWatcher.rssForm.errors = [];
      })
      .catch(() => {
        stateWatcher.rssForm.errors.push({ name: 'ConnectionError' });
        stateWatcher.rssForm.state = 'failed';
      });
  });
};
