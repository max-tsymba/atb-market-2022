import { convertInputsToData } from './converter';
import { post_request } from './requests';

const formik = (selector, submitButton) => {
  const formSelector = document.querySelector(selector),
    submitBtnSelector = document.querySelector(submitButton);

  const isFormFinite = formSelector !== undefined;

  if (isFormFinite) {
    const endpoint = formSelector.action,
      inputsByForm = formSelector.getElementsByTagName('input'),
      loader = formSelector.getElementsByClassName('loader')[0];

    formSelector.addEventListener('submit', request);

    function request(e) {
      e.preventDefault();
      const formData = new FormData();
      const data = convertInputsToData(inputsByForm);

      for (let key in data) {
        formData.append(key, data[key]);
      }

      submitBtnSelector.disabled = true;
      loader.classList.add('active');

      grecaptcha.ready(function () {
        grecaptcha
          .execute('6Ld13OcaAAAAAG8rKkfe0ykgiS7fp4Z1wjE8uYL1', {
            action: 'submit',
          })
          .then(function (token) {
            formData.append('g-recaptcha-response', token);
            const response = post_request(endpoint, formData);

            console.log(response, loader);
          });
      });
    }
  }
};

export default formik;
