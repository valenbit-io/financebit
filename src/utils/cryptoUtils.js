export const calculateSmartTarget = (price) => {
  const rawTarget = price * 1.5; 
  let decimals = 2;
  if (price < 1) decimals = 4;
  if (price < 0.01) decimals = 8;
  return parseFloat(rawTarget.toFixed(decimals));
};
