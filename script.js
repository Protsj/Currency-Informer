const BASE_HISTORY_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange';
const englishCurrencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });

const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const fetchHistoryBtn = document.getElementById('fetch-history-btn');

const endD = new Date()
const startD = new Date();
startD.setDate(endD.getDate() - 6);

const todayStr = getInputDate(endD);
const startStr = getInputDate(startD);

let activeCurrencyCode = null;
let activeCurrencyName = null;

endDateInput.value = todayStr;
startDateInput.value = startStr;

endDateInput.max = todayStr;
startDateInput.max = todayStr;

document.getElementById('current-date').innerText = new Date().toLocaleDateString('uk-UA');

function getApiDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`; 
}

function getInputDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; 
}

function getDatesBetween(startDateStr, endDateStr) {
    const dates = [];
    let currentDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const MAX_DAYS = 31; 
    let daysCount = 0;

    while (currentDate <= endDate && daysCount < MAX_DAYS) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        
        dates.push(`${year}${month}${day}`);
        
        currentDate.setDate(currentDate.getDate() + 1);
        daysCount++;
    }
    return dates;
}

fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
    .then(response => response.json())
    .then(data => {
        const currencyList = document.getElementById('currency-list');
        const dataList = document.getElementById('currency-select');
        currencyList.innerHTML = '';

        data.forEach(currency => {
            let englishName = currency.cc;
            try {
                englishName = englishCurrencyNames.of(currency.cc);
            } catch (e) {
            }
            const li = document.createElement('li');
            li.className = 'currency-item';
            li.style.cursor = 'pointer';
            li.innerHTML = `
                <span class="currency-name">${currency.cc} - ${englishName}</span>
                <span class="currency-rate">${currency.rate.toFixed(2)} UAH</span>
            `;
            li.addEventListener('click', () => {
                loadCurrencyHistory(currency.cc, englishName);
            });
            currencyList.appendChild(li);

            const option = document.createElement('option');
            option.value = currency.cc;
            option.text = englishName;
            option.setAttribute('data-rate', currency.rate);
            dataList.appendChild(option);
        });
        initConverters();
    })
    .catch(err => {
        console.error('Error loading data:', err);
        const currencyList = document.getElementById('currency-list');
        if (currencyList) {
            currencyList.innerHTML = '<li class="currency-item" style="color: red;">Error loading data.</li>';
        }
    });

function initConverters() {
    function getRateFromDatalist(currencyCode) {
        const options = document.querySelectorAll('#currency-select option');
        for (let option of options) {
            if (option.value === currencyCode) {
                return parseFloat(option.getAttribute('data-rate'));
            }
        }
        return null;
    }

    const inputForeignAmount = document.getElementById('amount-foreign');
    const inputForeignCurrency = document.getElementById('currency-input');
    const resultUah = document.getElementById('amount-uah');

    const inputUahAmount = document.getElementById('amount-uah-input');
    const inputUahCurrency = document.getElementById('currency-input-target');
    const resultForeign = document.getElementById('amount-foreign-result');

    function calculateToUah() {
        const amount = parseFloat(inputForeignAmount.value);
        const rate = getRateFromDatalist(inputForeignCurrency.value);
        if (!isNaN(amount) && rate !== null) {
            resultUah.value = (amount * rate).toFixed(2);
        } else {
            resultUah.value = '';
        }
    }

    function calculateToForeign() {
        const amount = parseFloat(inputUahAmount.value);
        const rate = getRateFromDatalist(inputUahCurrency.value);

        if (!isNaN(amount) && rate !== null && rate > 0) {
            resultForeign.value = (amount / rate).toFixed(2);
        } else {
            resultForeign.value = '';
        }
    }

    inputForeignAmount.addEventListener('input', calculateToUah);
    inputForeignCurrency.addEventListener('input', calculateToUah);
    inputForeignCurrency.addEventListener('change', calculateToUah);

    inputUahAmount.addEventListener('input', calculateToForeign);
    inputUahCurrency.addEventListener('input', calculateToForeign);
    inputUahCurrency.addEventListener('change', calculateToForeign);
}

async function fetchRates(valcode, date) {
    try {
        const url = `${BASE_HISTORY_URL}?valcode=${valcode}&date=${date}&json`;
        const response = await fetch(url);
        const data = await response.json();
        return data[0]; 
    } catch (error) {
        console.error(`Error fetching rate for ${date}:`, error);
        return null;
    }
}

async function loadCurrencyHistory(currencyCode, currencyName) {
    activeCurrencyCode = currencyCode;
    activeCurrencyName = currencyName;

    fetchHistoryBtn.disabled = false;

    document.getElementById('history-title').innerText = `Exchange rate history: ${currencyName}`;
    const historyOutput = document.getElementById('history-output');
    
    const startVal = startDateInput.value;
    const endVal = endDateInput.value;
    
    if (new Date(startVal) > new Date(endVal)) {
        historyOutput.innerHTML = '<p class="placeholder-text" style="color: red;">Start date cannot be greater than end date!</p>';
        return;
    }

    historyOutput.innerHTML = '<p class="placeholder-text">Loading history...</p>';

    const dates = getDatesBetween(startVal, endVal);

    if (dates.length === 31) {
        alert("Warning: for stability, only data for the last 31 days of the selected range is displayed.");
    }

    try {
        const promises = dates.map(date => fetchRates(currencyCode, date));
        let results = await Promise.all(promises);

        results = results.filter(item => item !== null && item !== undefined);

        results.sort((a, b) => {
            const dateA = a.exchangedate.split('.').reverse().join('-');
            const dateB = b.exchangedate.split('.').reverse().join('-');
            return new Date(dateB) - new Date(dateA); 
        });

        historyOutput.innerHTML = '';
        
        const table = document.createElement('table');
        table.className = 'history-table'; 

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const dateHeader = document.createElement('th');
        dateHeader.innerText = 'Date';
        
        const rateHeader = document.createElement('th');
        rateHeader.innerText = `Exchange rate ${currencyCode}`; 
        
        headerRow.appendChild(dateHeader);
        headerRow.appendChild(rateHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        results.forEach(item => {
            const row = document.createElement('tr');
            
            const dateCell = document.createElement('td');
            dateCell.innerText = item.exchangedate;
            
            const rateCell = document.createElement('td');
            rateCell.innerHTML = `<strong>${item.rate.toFixed(4)}</strong> UAH`; 
            
            row.appendChild(dateCell);
            row.appendChild(rateCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        historyOutput.appendChild(table);

    } catch (error) {
        historyOutput.innerHTML = '<p class="placeholder-text" style="color: red;">Error loading data. Try again later.</p>';
    }
}

fetchHistoryBtn.addEventListener('click', () => {
    if (activeCurrencyCode && activeCurrencyName) {
        loadCurrencyHistory(activeCurrencyCode, activeCurrencyName);
    }
});