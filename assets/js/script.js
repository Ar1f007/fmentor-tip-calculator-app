'use strict';

// Input Btns
const billAmountInput = document.querySelector('#bill-amount');
const numOfPplInput = document.querySelector('#people-count');

const tipsInput = document.querySelectorAll('.tips > *');
const tips = document.querySelector('.tips');
const customTip = document.querySelector('#tip-custom');

const errorBill = document.querySelector('#error-msg-bill-amount');
const errorPpl = document.querySelector('#error-msg-ppl-count');

const tipAmountPerPersonOutput = document.querySelector('#tip-per-person');
const totalAmountPerPersonOutput = document.querySelector('#total-per-person');
const resetBtn = document.querySelector('#reset');

let billAmount = 0;
let totalNumOfPpl = 0;
let tipValue = 0;

// Function for delaying the calculation
const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

// Remove error message
//--------------------------------------------
const removeError = (inputField, errorField, delay) => {
  setTimeout(() => {
    errorField.textContent = '';
    inputField.style.border = 'none';
  }, delay);
};

// Display error message
//--------------------------------------------
const showError = (inputField, errorField, msg) => {
  errorField.textContent = msg;
  inputField.style.border = '2px solid #d79072';
  removeError(inputField, errorField, 1500);
};

/**
 * Gets bill amount, total number people value
 * add new class to the reset button
 * checks the input and throws error accordingly
 * Call the calculate function for tip calculation
 */
//------------------------------------------------------------------
const updateValueHandler = () => {
  billAmount = parseFloat(billAmountInput.value);
  totalNumOfPpl = parseInt(numOfPplInput.value);

  if (billAmount <= 0 || totalNumOfPpl <= 0) {
    if (billAmount <= 0) {
      showError(billAmountInput, errorBill, `Invalid amount`);
    }

    if (totalNumOfPpl <= 0) {
      showError(numOfPplInput, errorPpl, `can't be zero`);
    }
    return;
  }

  calculateTip();

  resetBtn.classList.add('reset-btn--active');
};

// reload/reset the calculator
//--------------------------------------------
const reloadHandler = () => {
  // setTimeout(() => window.location.reload(true));
  billAmountInput.value = '';
  numOfPplInput.value = '';
  resetBtn.classList.remove('reset-btn--active');
  tipAmountPerPersonOutput.textContent = '$0.00';
  totalAmountPerPersonOutput.textContent = '$0.00';

  billAmount = 0;
  totalNumOfPpl = 0;
  tipValue = 0;
};

// Get the custom tip value provided by the user
//----------------------------------------------
const getCustomTipInput = () => {
  if (tipValue < 0) {
    showError(customTip, errorPpl, `Invalid value`);
    return;
  }
  tipValue = parseInt(customTip.value);
  calculateTip();
};

// Selects which tip button is clicked
//--------------------------------------------
const getSelectedTipHandler = (e) => {
  if (e.target.closest('li').classList.contains('tip--custom')) {
    customTip.addEventListener('input', debounce(getCustomTipInput, 250));
  } else {
    tipValue = parseInt(e.target.textContent);
    calculateTip();
  }
};

// Calculates tip and display it to the output section
//-----------------------------------------------------
const calculateTip = () => {
  const tipAmount = (billAmount * tipValue) / 100 / totalNumOfPpl;
  const totalAmount = billAmount / totalNumOfPpl + tipAmount;

  if (tipAmount && totalAmount) {
    tipAmountPerPersonOutput.textContent = tipAmount.toFixed(2);
    totalAmountPerPersonOutput.textContent = totalAmount.toFixed(2);
  }
};

// Event Listeners
billAmountInput.addEventListener('input', debounce(updateValueHandler, 250));
numOfPplInput.addEventListener('input', debounce(updateValueHandler, 250));
resetBtn.addEventListener('click', reloadHandler);

tips.addEventListener('click', (e) => {
  getSelectedTipHandler(e);
});

tips.addEventListener('keypress', (e) => {
  if (e.keyCode !== 13) return;
  console.log(e.target);
  getSelectedTipHandler(e);
});
