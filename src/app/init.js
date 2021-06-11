import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import resources from '../locales';
import rssParse from './rssParser.js';
import view from './view.js';

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
    updateList: {
      // 'waiting', 'finished, 'failed', 'sending'
      state: 'waiting',
    },
  };

  const form = document.querySelector('.rss_form');
  const stateWatcher = onChange(state, (path, value) => {
    view(path, value, i18nInstance, form);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    stateWatcher.rssForm.state = 'sending';

    const formData = new FormData(event.target);
    const url = formData.get('rssUrl');
    const duplicate = stateWatcher.feeds.find((feed) => feed.stream === url);
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
          const [feed, post] = rssParse(data.contents, id, url);
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

    setTimeout(function updateList() {
      const feed = stateWatcher.feeds[0];
      const currentUri = encodeURIComponent(feed.stream);
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${currentUri}`).then(({ data }) => {
        try {
          const [, newPost] = rssParse(data.contents, feed.id);
          const currentPost = stateWatcher.posts.find((p) => p.id === feed.id);
          if (!_.isEqual(currentPost.posts, newPost.posts)) {
            const nonChanged = _.without(stateWatcher.posts, currentPost);
            stateWatcher.posts = [newPost, ...nonChanged];
          }
          setTimeout(updateList, 5000, stateWatcher);
        } catch (error) {
          stateWatcher.updateList.state = 'failed';
          setTimeout(updateList, 5000, stateWatcher);
        }
      });
    }, 5000);
  });
};
