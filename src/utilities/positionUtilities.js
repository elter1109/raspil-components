function isKromka(side, value) {
  if (side === value) {
    return 1;
  } else {
    return 0;
  }
}

export function calcKromkaQuantity({
  length,
  width,
  quantity,
  straightKromka,
}) {
  const { top, bottom, left, right } = straightKromka;
  const calcQuantity2mm = (
    ((isKromka(top, '2mm') * length +
      isKromka(bottom, '2mm') * length +
      isKromka(right, '2mm') * width +
      isKromka(left, '2mm') * width) *
      quantity) /
    1000
  ).toFixed(1);
  const calcQuantity04mm = (
    ((isKromka(top, '04mm') * length +
      isKromka(bottom, '04mm') * length +
      isKromka(right, '04mm') * width +
      isKromka(left, '04mm') * width) *
      quantity) /
    1000
  ).toFixed(1);
  const calcQuantity1mm = (
    ((isKromka(top, '1mm') * length +
      isKromka(bottom, '1mm') * length +
      isKromka(right, '1mm') * width +
      isKromka(left, '1mm') * width) *
      quantity) /
    1000
  ).toFixed(1);
  return {
    kromka2mm: Number(calcQuantity2mm),
    kromka04mm: Number(calcQuantity04mm),
    kromka1mm: Number(calcQuantity1mm),
  };
}
export function calcPlateQuantity({ length, width, quantity }) {
  const newValue = ((length / 1000) * (width / 1000) * quantity).toFixed(1);
  return Number(newValue);
}
export function calcSum(quantity, price) {
  const total = ~~(quantity * price);
  return total;
}
export function calcTotalSum(
  packing,
  plateSum,
  kromka2Sum,
  kromka04Sum,
  kromka1Sum,
  area
) {
  const sumPacking = ~~(area * 35);
  const sumNoPacking = plateSum + kromka2Sum + kromka04Sum + kromka1Sum;
  const newTotalSum = packing ? ~~(sumNoPacking + sumPacking) : sumNoPacking;
  return {
    totalSum: newTotalSum,
  };
}

export const updateStateProperty = (oldState, updatedProperties, newValue) => {
 
  if (updatedProperties)
    return {
      [updatedProperties]: {
        ...oldState[updatedProperties],
        ...newValue,
      },
    };
  if (!updatedProperties)
    return {
      ...oldState,
      ...newValue,
    };
};
