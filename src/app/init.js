import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import renderError from './renderErrors.js';
import processHandler from './processHandler.js';
import rssParse from './rssParser.js';
import renderContent from './renderContent.js';

const schema = yup.string().url();

const validate = (data) => {
  try {
    schema.validateSync(data, { abortEarly: false });
    return { error: [] };
  } catch (e) {
    return { error: e.inner };
  }
};

export default () => {
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
  const submitButton = form.querySelector('[type="submit"]');

  const stateWatcher = onChange(state, (path, value) => {
    if (path === 'rssForm.errors' && value.length > 0) {
      renderError(value, form);
    } else if (path === 'rssForm.state') {
      processHandler(value, submitButton);
    } else if (path === 'feeds' || path === 'posts') {
      renderContent(path, value);
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

    stateWatcher.streams.push(url);
    const validationResult = validate(url);
    stateWatcher.rssForm.errors.push(...validationResult.error);
    if (validationResult.error.length > 0) {
      stateWatcher.rssForm.state = 'failed';
      return;
    }

    const uri = encodeURIComponent(url);
    axios
      .get(`https://hexlet-allorigins.herokuapp.com/get?url=${uri}`)
      .then(({ data }) => {
        const id = stateWatcher.feeds.length + 1;
        try {
          const [feed, posts] = rssParse(data.contents, id);
          stateWatcher.feeds.push(feed);
          stateWatcher.posts.push(...posts);
        } catch (e) {
          stateWatcher.rssForm.state = 'failed';
          stateWatcher.rssForm.errors.push({ name: 'ParsingError' });
          return;
        }

        stateWatcher.rssForm.state = 'finished';
        stateWatcher.rssForm.errors = [];
      })
      .catch((error) => {
        stateWatcher.rssForm.errors.push(error);
        stateWatcher.rssForm.state = 'failed';
      });
  });
};
