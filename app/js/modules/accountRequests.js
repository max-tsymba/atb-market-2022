import { get_request, post_jwt_request, post_request } from './requests';

export const logout = (selector) => {
  const logoutButtonSelector = document.querySelector(selector);

  if (logoutButtonSelector !== undefined) {
    logoutButtonSelector.addEventListener('click', () => {
      localStorage.clear();
      logoutButtonSelector.disabled = true;
      window.location = '/';
    });

    logoutButtonSelector.disabled = false;
  }
};

export const getUserById = () => {
  const pathname = window.location.pathname;

  const fullUrl = `${window.location.protocol}//${window.location.host}`;

  if (pathname === '/account.html') {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const userId = localStorage.getItem('id');
      const phoneSelector = document.querySelector('.account_phone');
      phoneSelector.textContent = '';

      const url = `${fullUrl}/api/v1/users/${userId}`;

      get_request(url)
        .then((data) => {
          if (data.status === 401) {
            const endpoint = `${fullUrl}/api/v1/refresh`;
            window.location = '/';

            grecaptcha.ready(function () {
              grecaptcha
                .execute('6LeEx4AhAAAAANORK89f2fgR4d4a_2dwq9CM3wEG', {
                  action: 'submit',
                })
                .then(function (token) {
                  const data = {};
                  data['g-recaptcha-response'] = token;

                  const jsondata = JSON.stringify(data);

                  post_jwt_request(endpoint, jsondata)
                    .then((data) => {
                      if (data.status === 401) window.location = '/';
                      return data.json();
                    })
                    .then((response) => {
                      if (response.message === 'Token has expired') {
                        localStorage.clear();
                      }
                    });
                });
            });

            return data.json();
          } else return data.json();
        })
        .then((response) => {
          phoneSelector.textContent = `+${response.phone}`;
          getUserCodes(token);
          document.body.style.display = 'block';
        });
    } else {
      window.location = '/';
    }
  }
};

export const getUserCodes = (token) => {
  const fullUrl = `${window.location.protocol}//${window.location.host}`;
  const userId = localStorage.getItem('id');
  const url = `${fullUrl}/api/v1/users/${userId}/codes`;

  get_request(url)
    .then((data) => data.json())
    .then((response) => {
      addElementsToDocument(response);
    });
};

function addElementsToDocument(response) {
  let tablet = document.querySelector('.tablet');

  function addLi(index) {
    let li = document.createElement('li');
    li.setAttribute('class', 'tablet__item');

    addP(li, response[index].created_at);
    addP(li, response[index].code);
    addP(li, response[index].partner.name);
    tablet.insertAdjacentElement('beforeend', li);
  }

  function addP(li, elem) {
    let p = document.createElement('p');

    p.innerText = elem;
    li.insertAdjacentElement('beforeend', p);
  }

  for (let i = 0; i < response.length; i++) {
    addLi(i);
  }
}
