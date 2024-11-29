$(document).ready(function(){
  $('select').formSelect();
  $('.dropdown-trigger').dropdown();
  $('.sidenav').sidenav();
});

const app_id = '67289c51e7604df99351969a646573fb';
const selectRatesFrom = document.getElementById('selectRatesFrom');
const selectRatesTo = document.getElementById('selectRatesTo');
const amount = document.getElementById('amount');
const btn = document.getElementById('btn');
const result = document.getElementById('result');
const collection = document.getElementById('collection');
const search = document.getElementById('search');
const btnSearch = document.getElementById('btnSearch');

function getExchangeRates() {
  return axios.get(`https://openexchangerates.org/api/latest.json?app_id=${app_id}`);
}

function getCurrencySymbols() {
  return axios.get(`https://openexchangerates.org/api/currencies.json?app_id=${app_id}`);
}

Promise.all([getExchangeRates(), getCurrencySymbols()])
  .then(function (results) {
    const rates = results[0].data.rates;
    const symbols = results[1].data;
    const currenciesNames = Object.values(symbols);
    assignValuesAndKeys(rates, symbols, selectRatesFrom);
    assignValuesAndKeys(rates, symbols, selectRatesTo);
    M.FormSelect.init(selectRatesFrom);
    M.FormSelect.init(selectRatesTo);
    createList(currenciesNames);

    search.addEventListener('input', (e) => {
      e.preventDefault();
      const searchValue = search.value;
      const results = currenciesNames.filter((element) => element.toLowerCase().includes(searchValue.toLowerCase()));
      createList(results);
    });
  })
  .catch(function (error) {
    console.log(error);
  });

function assignValuesAndKeys(rates, symbols, selectDiv) {
    const keys = Object.keys(rates);
    keys.forEach(key => {
        const option = document.createElement('option');
        option.value = rates[key];
        option.dataset.key = key;
        option.textContent = `${key} - ${symbols[key]}`; // ARS - Peso Argentino
        selectDiv.appendChild(option);           
    });
}

function convertCurrency() {
    const fromRate = parseFloat(selectRatesFrom.value);
    const toRate = parseFloat(selectRatesTo.value);
    const amountValue = parseFloat(amount.value);
    const convertedAmount = (amountValue / fromRate) * toRate;
    const selectedOption = selectRatesTo.options[selectRatesTo.selectedIndex];
    const key = selectedOption.dataset.key;
    result.textContent = `Resultado: ${convertedAmount.toFixed(2)} ${key}`;
}

function createList(data) {
  collection.innerHTML = "";
  data.forEach(name => {
  const li = document.createElement('li');
  li.classList.add("collection-item");
  li.textContent = name;
  collection.appendChild(li);
  });
}
btn.addEventListener("click", convertCurrency);
const navbar = document.getElementById('navbar');
const hero = document.getElementById('hero');

window.addEventListener('scroll', function() {
    if (window.scrollY > hero.offsetHeight) {
        navbar.classList.add('fixed');
    } else {
        navbar.classList.remove('fixed');
    }
});