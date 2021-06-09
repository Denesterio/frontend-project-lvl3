export default (processState, button) => {
  if (processState === 'sending') {
    const input = button.closest('.rss_form').querySelector('input');
    input.classList.remove('is-invalid');

    const spinnerDiv = document.createElement('div');
    spinnerDiv.classList.add('spinner-border', 'text-secondary', 'm-2');
    spinnerDiv.setAttribute('role', 'status');
    spinnerDiv.innerHTML = '<span class="visually-hidden">Загрузка...</span>';
    button.replaceWith(spinnerDiv);
  } else if (processState === 'finished') {
    const feedback = document.querySelector('.feedback');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = 'Лента успешно загружена';

    const spinner = document.forms.rssForm.querySelector('.spinner-border');
    spinner.replaceWith(button);
  } else {
    const spinner = document.forms.rssForm.querySelector('.spinner-border');
    spinner.replaceWith(button);
  }
};
