import renderError from './renderErrors.js';
import processHandler from './processHandler.js';
import { renderList, getTitle } from './renderContent.js';

export default (path, value, i18Inst, form) => {
  const containers = {
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  if (path === 'rssForm.errors' && value.length > 0) {
    renderError(value, form, i18Inst);
  } else if (path === 'rssForm.state') {
    processHandler(value, i18Inst);
  } else if (path === 'feeds' || path === 'posts') {
    containers[path].innerHTML = '';
    const title = getTitle(i18Inst.t(path));
    const list = renderList(path, value, i18Inst);
    containers[path].append(title);
    containers[path].append(list);
  } else if (path === 'activePost' && value) {
    const modalWindow = document.getElementById('modal');
    const modalTitle = modalWindow.querySelector('.modal-title');
    const modalBody = modalWindow.querySelector('.modal-body');
    const readButton = modalWindow.querySelector('.full_article');
    modalTitle.textContent = value.title;
    modalBody.textContent = value.description;
    readButton.href = value.link;
  } else if (path === 'readPostsLinks') {
    value.forEach((link) => {
      const a = document.querySelector(`a[href="${link}"]`);
      a.classList.remove('fw-bold');
      a.classList.add('fw-normal');
    });
  }
};
