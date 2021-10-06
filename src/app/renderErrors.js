export default (errors, form) => {
  const error = errors[errors.length - 1];
  const parent = form.parentElement;
  const feedback = parent.querySelector('.feedback');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  form.rssUrl.classList.add('is-invalid');
  // eslint-disable-next-line no-param-reassign
  form.rssUrl.setAttribute('aria-invalid', true);

  feedback.textContent = error;
};
