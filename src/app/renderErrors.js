export default (errors, form) => {
  const error = errors[errors.length - 1];
  const parent = form.parentElement;
  const feedback = parent.querySelector('.feedback');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  form.elements.url.classList.add('is-invalid');
  form.elements.url.setAttribute('aria-invalid', true);

  feedback.textContent = error;
};
