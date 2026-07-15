$(function () {

  const priceSlider = $('#property-price');
  const downSlider = $('#down-payment');
  const rateSlider = $('#interest-rate');
  const durationSlider = $('#loan-duration');

  // Only run this code if calculator exists on this page
  if (priceSlider.length === 0) return;

  function formatMoney(num) {
    return '$' + Math.round(num).toLocaleString();
  }

  function calculateMortgage() {
    const price = parseFloat(priceSlider.val());
    const down = parseFloat(downSlider.val());
    const annualRate = parseFloat(rateSlider.val());
    const years = parseFloat(durationSlider.val());

    // Update displayed slider values
    $('#property-price-value').text(formatMoney(price));
    $('#down-payment-value').text(formatMoney(down));
    $('#interest-rate-value').text(annualRate.toFixed(1) + '%');
   $('#loan-duration-value').text(years + ' Years');

    // Down payment can't exceed property price
    let principal = price - down;
    if (principal < 0) principal = 0;

    const monthlyRate = (annualRate / 100) / 12;
    const totalMonths = years * 12;

    let monthlyPayment = 0;

    if (monthlyRate === 0) {
      // No interest edge case
      monthlyPayment = principal / totalMonths;
    } else {
      // Standard amortization formula
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
    }

    if (!isFinite(monthlyPayment) || monthlyPayment < 0) {
      monthlyPayment = 0;
    }

    $('#monthly-payment-result').text(formatMoney(monthlyPayment) + '/mo');
  }

  // Recalculate whenever any slider moves
  $('#property-price, #down-payment, #interest-rate, #loan-duration').on('input', calculateMortgage);

  // Make sure down payment slider max never exceeds property price
  priceSlider.on('input', function () {
    const price = parseFloat($(this).val());
    downSlider.attr('max', price);
    if (parseFloat(downSlider.val()) > price) {
      downSlider.val(price);
    }
  });

  // Run once on page load to show initial values
  calculateMortgage();

});