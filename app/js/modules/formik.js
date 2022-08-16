import { convertInputsToData } from './converter';
import { post_request } from './requests';

const wheelNone = () => {
  const wheel = document.querySelector('.wheel-overlay');
  const giftOverlay = document.querySelector('.overlay__gift');
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
};

const clearInputs = (array) => {
  for (let index = 0; index < array.length; index++) {
    const input = array[index];
    input.classList.remove('error');
  }
};

const addError = (array, response) => {
  for (let index = 0; index < array.length; index++) {
    const input = array[index];

    if (input.name === Object.keys(response.errors)[0]) {
      input.classList.add('error');
    }
  }
};

const formik = (selector, submitButton) => {
  const formSelector = document.querySelector(selector),
    submitBtnSelector = document.querySelector(submitButton),
    wheel = document.querySelector('.wheel-overlay'),
    overlay_reg = document.querySelector('#overlay-reg');

  wheelNone();
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
      const data = convertInputsToData(inputsByForm);
      submitBtnSelector.disabled = true;
      loader.classList.add('active');

      clearInputs(inputsByForm);
      helpertext.textContent = '';

      grecaptcha.ready(function () {
        grecaptcha
          .execute('6Ld13OcaAAAAAG8rKkfe0ykgiS7fp4Z1wjE8uYL1', {
            action: 'submit',
          })
          .then(function (token) {
            data['g-recaptcha-response'] = token;

            const jsondata = JSON.stringify(data);

            post_request(endpoint, jsondata)
              .then((response) => {
                return { status: response.ok, json: response.json() };
              })
              .then((responseObj) => {
                if (responseObj.status) {
                  responseObj.json.then((text) => {
                    if (text.partner) {
                      window.responseText = text.partner;
                      wheel.classList.add('active');
                      overlay_reg.classList.remove('active');
                    } else {
                      window.location.href = '/account.html';
                    }
                  });
                } else {
                  responseObj.json.then((text) => {
                    helpertext.textContent = text.message;
                    addError(inputsByForm, text);
                  });
                }
              })
              .finally(() => {
                submitBtnSelector.disabled = false;
                loader.classList.remove('active');
              });
          });
      });
    }
  }
};

export default formik;
