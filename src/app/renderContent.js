const renderContent = (type, notes) => {
  const container = document.querySelector(`.${type}`);
  container.classList.add('p-4');
  container.innerHTML = '';

  const h3 = document.createElement('h3');
  h3.textContent = type === 'posts' ? 'Посты:' : 'Потоки:';
  h3.classList.add('mb-5');
  container.appendChild(h3);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'list-group-flush');
  container.appendChild(ul);
  notes.forEach(({ title, link, description }) => {
    const li = document.createElement('li');
    if (type === 'feeds') {
      ul.classList.add('text-end', 'list-unstyled');
      li.classList.add('mb-3');
      li.innerHTML = `<h4><a class="text-decoration-none" href="${link}">${title}</a></h4><p>${description}</p>`;
    } else {
      li.classList.add('list-group-item', 'mb-2');
      li.innerHTML = `<h6 data-bs-toggle="tooltip" data-bs-placement="bottom" title="${description}"><a class="text-decoration-none" href="${link}">${title}</a></h6>`;
    }
    ul.appendChild(li);
  });
};

export default renderContent;
