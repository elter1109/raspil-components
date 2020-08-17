const checkValidity = (value, rules) => {
  const { isNumber, max, min } = rules;

  let isNoValid, isMax, isMin;
  if (!rules) {
    return true;
  } else {
    if (isNumber) {
      const notNun = Number.isNaN(value);
      isMin = !(value >= min);
      isMax = !(value <= max);
      isNoValid = isMax || isMin || notNun;
    }
  }

  return {
    isNoValid,
    errorMessage:
      isNoValid && isMax
        ? `Значение не более ${max}`
        : isNoValid && isMin
        ? `Значение не менее ${min}`
        : null,
  };
};
export default checkValidity;
