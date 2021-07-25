/* eslint-disable no-param-reassign */
import axios from 'axios';
import isEqual from 'lodash/isEqual';

import rssParse from './rssParser.js';
import 'bootstrap/js/dist/modal';

export default (sWatcher, url, i18Inst) => {
  const uri = encodeURIComponent(url);
  axios
    .get(`https://hexlet-allorigins.herokuapp.com/get?url=${uri}`)
    .then(({ data }) => {
      const id = sWatcher.feeds.length;
      try {
        const [feed, posts] = rssParse(data.contents, id, url);
        sWatcher.feeds = [feed, ...sWatcher.feeds];
        sWatcher.posts = [...posts, ...sWatcher.posts];
      } catch (error) {
        sWatcher.rssForm.state = 'failed';
        sWatcher.rssForm.errors.push(i18Inst.t('ParsingError'));
        return;
      }

      sWatcher.rssForm.state = 'finished';
      sWatcher.rssForm.errors = [];

      const postsContainer = document.querySelector('.posts');
      postsContainer.addEventListener('click', (evnt) => {
        if (evnt.target.tagName !== 'BUTTON') return;
        const index = evnt.target.dataset.postIndex;
        const activePost = sWatcher.posts.find((p) => p.id === index);
        activePost.isRead = true;
        sWatcher.activePost = activePost;
      });

      setTimeout(function updateList() {
        const feed = sWatcher.feeds[0];
        const currentUri = encodeURIComponent(feed.stream);
        axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${currentUri}`).then((response) => {
          const updatedData = response.data;
          try {
            const [, newPosts] = rssParse(updatedData.contents, feed.id);
            const currentPosts = sWatcher.posts.filter((p) => p.feedId === feed.id);
            if (!isEqual(currentPosts, newPosts)) {
              const nonChangedPosts = sWatcher.posts.filter((post) => post.feedId !== feed.id);
              sWatcher.posts = [newPosts, ...nonChangedPosts];
            }
            // setTimeout(updateList, 5000, sWatcher);
          } catch (error) {
            setTimeout(updateList, 5000, sWatcher);
          }
        });
      }, 5000);
    })
    .catch(() => {
      sWatcher.rssForm.errors.push(i18Inst.t('ConnectionError'));
      sWatcher.rssForm.state = 'failed';
    });
};
