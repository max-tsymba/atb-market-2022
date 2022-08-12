/*====================================IMPORT MODULES====================================*/
import { burgerOpener, modalOpener } from './modules/libs';
/*======================================================================================*/

/*======================================DOM LOADED======================================*/
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.href.includes('account')) {
    let user_id = readCookie('user_id');

    function readCookie(name) {
      let matches = document.cookie.match(
        new RegExp(
          '(?:^|; )' +
            name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
            '=([^;]*)',
        ),
      );
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    let xhr = new XMLHttpRequest(),
      data = new FormData();

    data.append('user_id', user_id);

    xhr.open('POST', `/api/getInfo/${user_id}`);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('redirect', 'follow');
    xhr.setRequestHeader('referrerPolicy', 'no-referrer');
    xhr.setRequestHeader('mode', 'cors');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        let responseArr = xhr.response.rows;
        let responseArray = responseArr.flat();
        let objectArray = [
          'date',
          'code',
          'partner_name',
          'prize_id',
          'prize_sum',
        ];
        let parObject = {
          АТБ: {
            name: 'АТБ',
            index: 1,
          },
          Фокстрот: {
            name: 'Фокстрот',
            index: 4,
          },
          'Dnipro M': {
            name: 'Dnipro M',
            index: 3,
          },
          'Gold ua': {
            name: 'Gold ua',
            index: 4,
          },
          Люксоптика: {
            name: 'Люксоптика',
            index: 5,
          },
          'Mida Shop': {
            name: 'Mida Shop',
            index: 6,
          },
          'English Home': {
            name: 'English Home',
            index: 7,
          },
        };

        function addElementsToDocument() {
          let tablet = document.querySelector('.tablet');
          let phone = document.querySelector('.account_phone');

          function addLi(index) {
            let li = document.createElement('li');
            li.setAttribute('class', 'tablet__item');

            for (let i = 0; i < 5; i++) {
              addP(li, responseArray[index][objectArray[i]]);
            }
            tablet.insertAdjacentElement('beforeend', li);
          }

          function addP(li, elem) {
            let p = document.createElement('p');

            let isNotFind = true;

            for (let key in parObject) {
              if (elem === key) {
                p.innerText = parObject[key].name;
                isNotFind = false;
              }
            }

            if (isNotFind) p.innerText = elem;
            li.insertAdjacentElement('beforeend', p);
          }

          phone.innerText = xhr.response.phone;

          for (let i = 0; i < responseArray.length; i++) {
            addLi(i);
          }
        }

        addElementsToDocument();
      }
    };

    xhr.send(data);
  }

  burgerOpener('burger', 'close', '.overlay-menu', '.menu__item-link');
  modalOpener();

  const logout = document.querySelector('.logout');
  if (logout !== null) {
    logout.addEventListener('click', () => {
      function createCookie(name, value, days) {
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
          var expires = '; expires=' + date.toGMTString();
        } else var expires = '';
        document.cookie = name + '=' + value + expires + '; path=/';
      }

      function eraseCookie(name) {
        createCookie(name, '', -1);
      }

      eraseCookie('user_id');
      window.location = '/';
    });
  }
});
/*======================================================================================*/

window.onload = () => {
  AOS.init();
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

  window.responseText = 'none';

  if (document.getElementsByTagName('form')[0] != undefined) {
    $('.phone').mask('380999999999', { placeholder: '380_________' });

    function sendForm(index) {
      //Send form
      let formBlock = document.getElementsByTagName('form')[index];

      if (formBlock != undefined) {
        let formBlock_CodeInput = formBlock.querySelector("input[name='code']");
        formBlock.addEventListener('submit', async (event) => {
          event.preventDefault();

          //Values
          let xhr = new XMLHttpRequest(),
            data = new FormData(event.target),
            url = formBlock.getAttribute('action'),
            method = formBlock.getAttribute('method'),
            result_Block = formBlock.querySelector('.result-text'),
            submit_button = formBlock.querySelector(
              "input[type='submit'], button[type='submit']",
            ),
            loader = formBlock.getElementsByClassName('loader')[0];

          //Disable submit-button
          submit_button.disabled = true;
          //Show loader
          loader.classList.add('active');

          grecaptcha.ready(function () {
            grecaptcha
              .execute('6Ld13OcaAAAAAG8rKkfe0ykgiS7fp4Z1wjE8uYL1', {
                action: 'submit',
              })
              .then(function (token) {
                //Add token
                data.append('g-recaptcha-response', token);

                xhr.open(method, url);
                xhr.responseType = 'json';
                xhr.setRequestHeader('Cache-Control', 'no-cache');
                xhr.setRequestHeader('redirect', 'follow');
                xhr.setRequestHeader('referrerPolicy', 'no-referrer');
                xhr.setRequestHeader('mode', 'cors');
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

                xhr.onload = function () {
                  submit_button.disabled = false;
                  loader.classList.remove('active');

                  if (this.status >= 200 && this.status < 300) {
                    if (index === 1) {
                      window.location.href = '/account.html';
                    } else {
                      responseText = xhr.response;
                      wheel.classList.add('active');
                      overlay_reg.classList.remove('active');
                    }
                  } else {
                    result_Block.style.color = '#F13A13';
                    //Clear input
                  }
                  result_Block.textContent =
                    this.status >= 500
                      ? 'Час очікування відповіді сервера минув'
                      : xhr.response.error;
                };

                xhr.send(data);
              });
          });
        });
      }
    }

    sendForm(0);
    sendForm(1);
  }
};
