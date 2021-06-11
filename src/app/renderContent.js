const fillFeedsList = (list, notes) => {
  list.classList.add('text-end', 'list-unstyled');
  notes.forEach(({ title, link, description }) => {
    const li = document.createElement('li');
    li.classList.add('mb-3');
    li.innerHTML = `<h4><a class="text-decoration-none" href="${link}">${title}</a></h4><p>${description}</p>`;
    list.appendChild(li);
  });
};

const fillPostsList = (list, notes) => {
  notes.forEach((note) => {
    note.posts.forEach(({ title, link, description }) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'mb-2');
      li.innerHTML = `<h6 data-bs-toggle="tooltip" data-bs-placement="bottom" title="${description}"><a class="text-decoration-none" href="${link}">${title}</a></h6>`;
      list.appendChild(li);
    });
  });
};

const getTitle = (type, i18Inst) => {
  const h3 = document.createElement('h3');
  h3.classList.add('mb-5');
  h3.textContent = i18Inst.t(type);
  return h3;
};

const renderList = (type, notes) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'list-group-flush');

  if (type === 'posts') {
    fillPostsList(ul, notes);
  } else {
    fillFeedsList(ul, notes);
  }

  return ul;
};

export { renderList, getTitle };
