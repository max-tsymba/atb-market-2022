const createInputMask = (selector) => {
  $(selector).mask('380999999999', { placeholder: '380_________' });
};

export default createInputMask;
