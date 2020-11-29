const alphanumeric = /^[a-z-]+$/;

export default {
  isAlphanumeric: (input) => {
    return alphanumeric.test(input);
  },
};
