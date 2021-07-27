const fillFeedsList = (list, notes) => {
  list.classList.add('text-end', 'list-unstyled');
  notes.forEach(({ title, link, description }) => {
    const li = document.createElement('li');
    li.classList.add('mb-3');

    const h4 = document.createElement('h4');
    li.append(h4);

    const a = document.createElement('a');
    a.classList.add('text-decoration-none');
    a.href = link;
    a.textContent = title;
    a.target = '_blank';
    h4.append(a);

    const p = document.createElement('p');
    p.textContent = description;
    li.append(p);
    list.append(li);
  });
};

const fillPostsList = (list, notes, i18Inst) => {
  notes.forEach(({ title, link, id }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'mb-2', 'd-flex', 'justify-content-between');

    const a = document.createElement('a');
    a.classList.add('fw-bold', 'col-lg', 'text-decoration-none');
    a.setAttribute('data-post-index', `${id}`);
    a.href = link;
    a.target = '_blank';
    a.textContent = title;
    li.append(a);

    const modalButton = document.createElement('button');
    modalButton.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'col-md-auto');
    modalButton.setAttribute('data-bs-target', '#modal');
    modalButton.setAttribute('data-bs-toggle', 'modal');
    modalButton.setAttribute('data-post-index', `${id}`);
    modalButton.textContent = i18Inst.t('show');
    li.append(modalButton);
    list.appendChild(li);
  });
};

const getTitle = (title) => {
  const h3 = document.createElement('h3');
  h3.classList.add('mb-5');
  h3.textContent = title;
  return h3;
};

const renderList = (type, notes, i18Inst) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'list-group-flush', 'row');

  if (type === 'posts') {
    fillPostsList(ul, notes, i18Inst);
  } else {
    fillFeedsList(ul, notes);
  }

  return ul;
};

export { renderList, getTitle };
