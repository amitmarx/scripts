function calcIncome(grantPrice, stockPrice, amountOfStocks) {
  const taxRate = 0.35;
  const taxBenefitRate = 0.25;
  const taxWithRegularRate = grantPrice * taxRate * amountOfStocks;
  const taxWithBenefitRate = (stockPrice - grantPrice) * taxBenefitRate * amountOfStocks;
  const totalTax = taxWithRegularRate + taxWithBenefitRate;

  const totalRevenue = amountOfStocks * stockPrice;

  const expectedIncome = totalRevenue - totalTax;
  return {
    'Revenue': totalRevenue,
    'Tax Without Benefit': taxWithRegularRate,
    'Tax With Benefit': taxWithBenefitRate,
    'Total Tax': totalTax,
    'Expected Income': expectedIncome
  };
}
