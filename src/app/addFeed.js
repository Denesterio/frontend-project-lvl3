import axios from 'axios';
import rssParse from './rssParser.js';
import 'bootstrap/js/dist/modal';

const NEXT_REQUEST_TIMEOUT = 5000;

const PROXY = 'https://hexlet-allorigins.herokuapp.com/';

const getUrl = (url, path = 'get') => {
  const requestUrl = new URL(PROXY);
  requestUrl.pathname = path;
  requestUrl.searchParams.append('disableCache', true);
  requestUrl.searchParams.append('url', url);
  return requestUrl;
};

const isPostsEqual = (newPosts, oldPosts) => newPosts[0].pubDate === oldPosts[0].pubDate;

export default (sWatcher, url, i18Inst) => {
  axios
    .get(getUrl(url))
    .then(({ data }) => {
      const id = sWatcher.feeds.length + 1;
      try {
        const [feed, posts] = rssParse(new DOMParser(), data.contents, id, url);
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
          const closeModalButton = document.querySelector('[data-role="closeModal"]');
          const readModalButton = document.getElementById('readArticleModalLink');
          const eventCloseModal = new Event('click');
          readModalButton.addEventListener('click', () => {
            closeModalButton.dispatchEvent(eventCloseModal);
          });
        }
      });

      const feed = sWatcher.feeds.find((fd) => fd.id === id);

      setTimeout(function updateList() {
        axios.get(getUrl(feed.stream)).then((response) => {
          try {
            const content = response.data.contents;
            const [, newPosts] = rssParse(new DOMParser(), content, feed.id, feed.stream);
            const currentPosts = sWatcher.posts.filter((p) => p.feedId === feed.id);
            if (!isPostsEqual(newPosts, currentPosts)) {
              const nonChangedPosts = sWatcher.posts.filter((post) => post.feedId !== feed.id);
              sWatcher.posts = [...newPosts, ...nonChangedPosts];
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
