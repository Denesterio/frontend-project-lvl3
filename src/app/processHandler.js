// const createSpinner = () => {
//   const spinnerSpan = document.createElement('span');
//   spinnerSpan.classList.add('spinner-border', 'text-secondary', 'm-2');
//   spinnerSpan.setAttribute('role', 'status');
//   spinnerSpan.innerHTML = '<span class="visually-hidden">Загрузка...</span>';
//   return spinnerSpan;
// };

export default (processState, i18Inst) => {
  const input = document.forms.rssForm.querySelector('input');
  const button = document.forms.rssForm.querySelector('button');
  if (processState === 'sending') {
    input.classList.remove('is-invalid');
    input.setAttribute('readonly', 'true');
    button.disabled = true;
  } else {
    button.disabled = false;
    // button.innerHTML = 'Добавить';
    input.removeAttribute('readonly');
    input.focus();
    if (processState === 'finished') {
      input.value = '';
      input.setAttribute('aria-invalid', false);
      const feedback = document.querySelector('.feedback');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18Inst.t('success');
    }
  }
};
