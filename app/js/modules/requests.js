const get_headers = () => {
  return new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
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

export async function post_request(endpoint, data) {
  const response = await fetch(endpoint, get_formik('POST', data));

  return response;
}
