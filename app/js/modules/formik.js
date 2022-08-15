import { convertInputsToData } from './converter';
import { post_request } from './requests';

const formik = (selector, submitButton) => {
  const formSelector = document.querySelector(selector),
    submitBtnSelector = document.querySelector(submitButton);

  // fix
  const wheel = document.querySelector('.wheel-overlay');
  const giftOverlay = document.querySelector('.overlay__gift');
  const overlay_reg = document.querySelector('#overlay-reg');
  const giftBtn = document.querySelector('.gift__close');
  const wheel_btn = document.querySelector('.bigButton');

  if (giftBtn !== null) {
    giftBtn.addEventListener('click', () => {
      giftOverlay.classList.remove('active');
      wheel.classList.remove('active');
      wheel_btn.disabled = false;
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
  }
  // ---

  window.responseText = 'none';

  const isFormFinite = formSelector !== undefined;

  if (isFormFinite) {
    const endpoint = formSelector.action,
      inputsByForm = formSelector.getElementsByTagName('input'),
      loader = formSelector.getElementsByClassName('loader')[0],
      helpertext = formSelector.getElementsByClassName('result-text')[0];

    formSelector.addEventListener('submit', request);

    function request(e) {
      e.preventDefault();
      const formData = new FormData();
      const data = convertInputsToData(inputsByForm);

      helpertext.textContent = '';

      for (let key in data) {
        formData.append(key, data[key]);
      }

      submitBtnSelector.disabled = true;
      loader.classList.add('active');

      post_request(endpoint, formData)
        .then((response) => {
          responseText = response.name;
          wheel.classList.add('active');
          overlay_reg.classList.remove('active');
        })
        .catch((e) => {
          helpertext.textContent = e.response.message;
        })
        .finally(() => {
          submitBtnSelector.disabled = false;
          loader.classList.remove('active');
        });

      // grecaptcha.ready(function () {
      //   grecaptcha
      //     .execute('6Ld13OcaAAAAAG8rKkfe0ykgiS7fp4Z1wjE8uYL1', {
      //       action: 'submit',
      //     })
      //     .then(function (token) {
      //       formData.append('g-recaptcha-response', token);
      //       const response = post_request(endpoint, formData);

      //       console.log(response, loader);
      //     });
      // });
    }
  }
};

export default formik;
