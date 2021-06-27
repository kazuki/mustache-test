import mustache from './mustache.js';

document.addEventListener('DOMContentLoaded', () => {
  const template = document.getElementById('template');
  const data = document.getElementById('data');
  const result = document.getElementById('result');
  const error = document.getElementById('error');
  const cache = [template.value, data.value, null, null];

  const fileTemplate = document.getElementById('fileTemplate');
  const fileData = document.getElementById('fileData');

  const render = () => {
    let [templateCache, dataCache, jsonCache] = cache;
    let renderRequired = false;
    let errorMessage = [];
    if (templateCache !== template.value) {
      templateCache = cache[0] = template.value;
      renderRequired = true;
    }
    if (dataCache !== data.value) {
      dataCache = cache[1] = data.value;
      jsonCache = null;
    }
    if (jsonCache === null) {
      try {
        jsonCache = cache[2] = JSON.parse(dataCache);
        renderRequired = true;
      } catch {
        jsonCache = {};
        errorMessage.push('invalid json');
      }
    }
    if (renderRequired) {
      try {
        result.value = mustache.render(templateCache, jsonCache);
      } catch {
        errorMessage.push('invalid template');
      }
    }
    error.textContent = (
      errorMessage.length === 0
        ? ''
        : ` (${errorMessage.join(', ')})`);
  };

  [template, data].forEach((textarea) => {
    ['input', 'change'].forEach((eventName) => {
      textarea.addEventListener(eventName, render);
    });
  });

  [fileTemplate, fileData].forEach((element) => {
    const parent = element.parentElement;
    const btn = document.createElement('button');
    btn.textContent = "📂";
    btn.addEventListener('click', () => element.click());
    parent.appendChild(btn);
    element.addEventListener('change', () => {
      if (element.files.length === 0) return;
      const f = element.files[0];
      f.text().then((txt) => {
        parent.parentElement.getElementsByTagName('textarea')[0].value = txt;
        render();
      });
    });
  });
});
