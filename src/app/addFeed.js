/* eslint-disable no-param-reassign */
import axios from 'axios';
import without from 'lodash/without';
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
        const [feed, post] = rssParse(data.contents, id, url);
        sWatcher.feeds = [feed, ...sWatcher.feeds];
        sWatcher.posts = [post, ...sWatcher.posts];
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
        const [feedIndex, postIndex] = index.split(':');
        const activePost = sWatcher.posts.find((p) => p.id === Number(feedIndex)).posts[postIndex];
        sWatcher.activePost = activePost;
      });

      setTimeout(function updateList() {
        const feed = sWatcher.feeds[0];
        const currentUri = encodeURIComponent(feed.stream);
        axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${currentUri}`).then((response) => {
          const updatedData = response.data;
          try {
            const [, newPost] = rssParse(updatedData.contents, feed.id);
            const currentPost = sWatcher.posts.find((p) => p.id === feed.id);
            if (!isEqual(currentPost.posts, newPost.posts)) {
              const nonChangedPosts = without(sWatcher.posts, currentPost);
              sWatcher.posts = [newPost, ...nonChangedPosts];
            }
            setTimeout(updateList, 5000, sWatcher);
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
