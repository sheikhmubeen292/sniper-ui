function isDecimalValue(number: number | string) {
  return number?.toString()?.includes(".");
}

function isScientificNotation(number: number | string) {
  return number?.toString()?.includes("e");
}
const getExactDecimals = (number: number | string, fixed: number = 6) => {
  const isDecimals = isDecimalValue(number);

  if (!isDecimals) return Number(number);

  const isScientific = isScientificNotation(number);

  let standardForm = number;
  if (isScientific) {
    standardForm = Number(number).toLocaleString("fullwide", {
      useGrouping: false,
    });
  }

  if (+standardForm === 0) return +0.0;

  const [first, decimals] = number.toString().split(".");

  const finalDecimals = decimals.slice(0, fixed);
  return Number([first, ".", finalDecimals].join(""));
};

export { getExactDecimals };
