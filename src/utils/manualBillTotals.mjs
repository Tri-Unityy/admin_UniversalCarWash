export function sumPositiveAmounts(items) {
  return (items || []).reduce((sum, item) => {
    const amount = parseFloat(item?.amount);
    return sum + (amount > 0 ? amount : 0);
  }, 0);
}

export function calculateManualBillTotals({ subTotal, discount, deductions, additions }) {
  const discountValue = (Number(discount) * subTotal) / 100;
  const deductionsTotal = sumPositiveAmounts(deductions);
  const additionsTotal = sumPositiveAmounts(additions);
  const total = subTotal - discountValue - deductionsTotal + additionsTotal;

  return { discountValue, deductionsTotal, additionsTotal, total };
}
