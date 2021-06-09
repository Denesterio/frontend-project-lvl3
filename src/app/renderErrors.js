export default (errors, form) => {
  const error = errors[errors.length - 1];
  const parent = form.parentElement;
  const feedback = parent.querySelector('.feedback');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  form.rssUrl.classList.add('is-invalid');
  form.rssUrl.focus();

  switch (error.name) {
    case 'ValidationError':
      feedback.textContent = 'Введите корректный адрес';
      break;
    case 'ParsingError':
      feedback.textContent = 'Адрес не содержит валидный rss';
      break;
    case 'DuplicateError':
      feedback.textContent = 'Такой rss поток уже добавлен';
      break;
    default:
      feedback.textContent = 'Не удалось подключиться к источнику, проверьте правильность адреса, подключение к сети или попробуйте снова';
  }
};
