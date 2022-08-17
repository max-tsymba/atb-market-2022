const get_headers = () => {
  return new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });
};

const get_headers_with_jwt = () => {
  return new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  });
};

const get_formik = (method, body) => {
  return {
    credentials: 'same-origin',
    method,
    body,
    headers: get_headers(),
  };
};

const get_jwt_formik = (method, body) => {
  return {
    credentials: 'same-origin',
    method,
    body,
    headers: get_headers_with_jwt(),
  };
};

const get_data = () => {
  return {
    credentials: 'same-origin',
    method: 'GET',
    headers: get_headers_with_jwt(),
  };
};

export async function post_request(endpoint, data) {
  const response = await fetch(endpoint, get_formik('POST', data));

  return response;
}

export async function get_request(ednpoint) {
  const response = await fetch(ednpoint, get_data());

  return response;
}

export async function post_jwt_request(endpoint, data) {
  const response = await fetch(endpoint, get_jwt_formik('POST', data));

  return response;
}
