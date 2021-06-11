const createButton = () => {
  const button = document.createElement('button');
  button.setAttribute('type', 'submit');
  button.classList.add('btn', 'btn-outline-secondary', 'btn-lg', 'px-sm-4', 'fw-bold');
  button.textContent = 'Добавить';
  return button;
};

export default (processState, i18Inst) => {
  const input = document.forms.rssForm.querySelector('input');
  const button = document.forms.rssForm.querySelector('button') || createButton();
  if (processState === 'sending') {
    input.classList.remove('is-invalid');
    const spinnerDiv = document.createElement('div');
    spinnerDiv.classList.add('spinner-border', 'text-secondary', 'm-2');
    spinnerDiv.setAttribute('role', 'status');
    spinnerDiv.innerHTML = '<span class="visually-hidden">Загрузка...</span>';
    button.replaceWith(spinnerDiv);
  } else {
    const spinner = document.forms.rssForm.querySelector('.spinner-border');
    spinner.replaceWith(button);
    input.focus();
    if (processState === 'finished') {
      input.value = '';
      const feedback = document.querySelector('.feedback');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18Inst.t('success');
    }
  }
};
