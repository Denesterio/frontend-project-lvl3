/* eslint-disable no-param-reassign */
import axios from 'axios';
import rssParse from './rssParser.js';
import 'bootstrap/js/dist/modal';

const NEXT_REQUEST_TIMEOUT = 5000;
export default (sWatcher, url, i18Inst) => {
  const uri = encodeURIComponent(url);
  axios
    .get(`https://hexlet-allorigins.herokuapp.com/get?url=${uri}`)
    .then(({ data }) => {
      const id = sWatcher.feeds.length + 1;
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
        if (evnt.target.tagName !== 'BUTTON' && evnt.target.tagName !== 'A') return;
        const index = evnt.target.dataset.postIndex;
        const activePost = sWatcher.posts.find((p) => p.id === index);
        sWatcher.readPostsLinks.push(activePost.link);
        if (evnt.target.tagName === 'BUTTON') {
          sWatcher.activePost = activePost;
        }
      });

      const isPostsEqual = (newPosts, oldPosts) => newPosts[0].pubDate === oldPosts[0].pubDate;
      const feed = sWatcher.feeds.find((fd) => fd.id === id);

      setTimeout(function updateList() {
        const currentUri = encodeURIComponent(feed.stream);
        axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${currentUri}`).then((response) => {
          const updatedData = response.data;
          try {
            const [, newPosts] = rssParse(updatedData.contents, feed.id, feed.stream);
            const currentPosts = sWatcher.posts.filter((p) => p.feedId === feed.id);
            if (!isPostsEqual(newPosts, currentPosts)) {
              const nonChangedPosts = sWatcher.posts.filter((post) => post.feedId !== feed.id);
              sWatcher.posts = [newPosts, ...nonChangedPosts];
            }
            setTimeout(updateList, NEXT_REQUEST_TIMEOUT, sWatcher);
          } catch (error) {
            setTimeout(updateList, NEXT_REQUEST_TIMEOUT, sWatcher);
          }
        });
      }, NEXT_REQUEST_TIMEOUT);
    })
    .catch(() => {
      sWatcher.rssForm.errors.push(i18Inst.t('ConnectionError'));
      sWatcher.rssForm.state = 'failed';
    });
};
