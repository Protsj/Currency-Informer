const today = new Date();
document.getElementById('current-date').innerText = today.toLocaleDateString('uk-UA');

fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
    .then(response => response.json())
    .then(data => {
        const currencyList = document.getElementById('currency-list');
        const dataList = document.getElementById('currency-select');
        currencyList.innerHTML = '';

        data.forEach(currency => {
            const li = document.createElement('li');
            li.className = 'currency-item';
            li.innerHTML = `
                <span class="currency-name">${currency.cc} - ${currency.txt}</span>
                <span class="currency-rate">${currency.rate.toFixed(2)} UAH</span>
            `;
            currencyList.appendChild(li);

            const option = document.createElement('option');
            option.value = currency.cc;
            option.text = currency.txt;
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