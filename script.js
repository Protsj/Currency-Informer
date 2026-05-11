const BASE_HISTORY_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange';
const englishCurrencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });

document.getElementById('current-date').innerText = new Date().toLocaleDateString('uk-UA');

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
        console.error(`Error loading rate for ${date}:`, error);
        throw error;
    }
}

async function loadCurrencyHistory(currencyCode, currencyName) {
    document.getElementById('history-title').innerText = `Weekly Rate: ${currencyCode}`;
    const historyOutput = document.getElementById('history-output');
    historyOutput.innerHTML = '<p class="placeholder-text">Loading history...</p>';
    const dates = getDatesArray(7);

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
        rateHeader.innerText = `${currencyCode} Rate`; 
        
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
            rateCell.innerHTML = `<strong>${item.rate.toFixed(2)}</strong> UAH`;
            
            row.appendChild(dateCell);
            row.appendChild(rateCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        historyOutput.appendChild(table);

    } catch (error) {
        historyOutput.innerHTML = '<p class="placeholder-text" style="color: red;">Error loading data. Please try again.</p>';
    }
}

function getDatesArray(daysCount) {
    const dates = [];
    const currentDate = new Date();
    
    for (let i = 0; i < daysCount; i++) {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - i);
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        dates.push(`${year}${month}${day}`);
    }
    return dates;
}