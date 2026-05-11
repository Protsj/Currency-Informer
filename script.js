fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            document.getElementById('current-date').innerText = data[0].exchangedate;
        }

        const currencyList = document.getElementById('currency-list');
        const dataList = document.getElementById('currency-select');
        currencyList.innerHTML = '';

        data.forEach(currency => {
            const li = document.createElement('li');
            li.className = 'currency-item';
            li.innerHTML = `
                <span class="currency-name">${currency.cc} - ${currency.txt}</span>
                <span class="currency-rate">${currency.rate.toFixed(2)} грн</span>
            `;
            currencyList.appendChild(li);

            const option = document.createElement('option');
            option.value = currency.cc;
            option.text = currency.txt;
            dataList.appendChild(option);
        });
    })
    .catch(err => {
        console.error('Помилка завантаження даних:', err);
        const currencyList = document.getElementById('currency-list');
        if (currencyList) {
            currencyList.innerHTML = '<li class="currency-item" style="color: red;">Помилка завантаження даних.</li>';
        }
    });