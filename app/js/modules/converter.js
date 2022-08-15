export const convertInputsToData = (array) => {
  const initialState = [...array];
  let data = {};

  initialState.forEach((input) => {
    let name = input.name,
      value = input.value;

    if (name === 'confirm') value = true;

    data = { ...data, [name]: value };
  });

  return data;
};
