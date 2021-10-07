// prettier-ignore
export default () => new Promise((resolve) => {
  if (document.readyState === 'complete' || document.readyState === 'loaded') {
    resolve();
  } else {
    document.addEventListener('DOMContentLoaded', resolve);
  }
});
