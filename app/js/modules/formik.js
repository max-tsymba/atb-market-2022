import { convertInputsToData } from './converter';
import { post_request } from './requests';

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

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

const clearInputs = (array, labelByForm) => {
  const labels = [...labelByForm];
  for (let index = 0; index < array.length; index++) {
    const input = array[index];
    input.classList.remove('error');
    if (labels[index] !== undefined) {
      labels[index].textContent = '';
    }
  }
};

const addError = (array, response, labelForm) => {
  for (let index = 0; index < array.length; index++) {
    const input = array[index];

    const key = Object.keys(response.errors)[0];

    if (input.name === Object.keys(response.errors)[0]) {
      input.classList.add('error');
      labelForm[index].textContent = response.errors[key][0];
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

  const isFormFinite = formSelector !== undefined && formSelector !== null;

  if (isFormFinite) {
    const endpoint = formSelector?.action,
      inputsByForm = formSelector.getElementsByTagName('input'),
      loader = formSelector.getElementsByClassName('loader')[0],
      labelByForm = formSelector.getElementsByClassName('label-error'),
      helpertext = formSelector.getElementsByClassName('result-text')[0];

    formSelector.addEventListener('submit', request);

    function request(e) {
      e.preventDefault();
      const data = convertInputsToData(inputsByForm);
      submitBtnSelector.disabled = true;
      loader.classList.add('active');

      clearInputs(inputsByForm, labelByForm);
      helpertext.textContent = '';

      grecaptcha.ready(function () {
        grecaptcha
          .execute('6LeEx4AhAAAAANORK89f2fgR4d4a_2dwq9CM3wEG', {
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
                      const accessToken = text.access_token;
                      const expires_in = text.expires_in;
                      localStorage.setItem('accessToken', accessToken);
                      const decodedToken = parseJwt(accessToken);
                      localStorage.setItem(
                        'expires_in',
                        JSON.stringify(decodedToken.exp),
                      );
                      localStorage.setItem(
                        'id',
                        JSON.stringify(decodedToken.sub),
                      );

                      window.location.href = '/account.html';
                    }
                  });
                } else {
                  responseObj.json.then((text) => {
                    if (!text.hasOwnProperty('errors'))
                      helpertext.textContent = text.message;
                    addError(inputsByForm, text, labelByForm);
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
