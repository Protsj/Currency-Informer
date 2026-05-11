# Currency Informer & Converter

A web application that provides real-time currency exchange rates using the National Bank of Ukraine (NBU) API. The tool allows users to track currency trends, convert amounts, and view historical data for custom periods.

## Features

### 1. Real-time Exchange Rates
- Automatically fetches the latest official exchange rates from NBU.
- Displays a comprehensive list of currencies with their current value in UAH.
- **Dynamic Translation:** Currency names are automatically translated into English using the `Intl.DisplayNames` API.

### 2. Interactive Currency Converter
- Dual-way conversion:
    - Foreign Currency to UAH.
    - UAH to Foreign Currency.
- Instant calculation as you type.

### 3. Historical Data Analysis
- **Custom Date Range:** Select a specific start and end date to view how the rate has changed over time.
- **Automated Validation:** The system prevents selecting future dates to ensure data consistency.
- **Smart Sorting:** Historical records are automatically sorted from the most recent to the oldest.
- **Data Synchronization:** The application synchronizes today's historical record with the "live" rate to avoid discrepancies caused by NBU's early publication of next-day rates.

### 4. Modern User Interface
- **Clean Design:** Responsive layout with sidebar navigation and a detailed data panel.
- **Visual Feedback:** Highlights the currently selected currency and provides hover effects for better navigation.
- **Mobile Friendly:** Optimized for various screen sizes.

## Technical Details

- **Language:** JavaScript (ES6+), HTML5, CSS3.
- **API:** [NBU Public API](https://bank.gov.ua/ua/open-data/api-dev).
- **Date Handling:** Custom logic to manage local time zones and prevent UTC-related date shifts.

## How to Use

1. **View Rates:** Browse the list on the left to see current prices.
2. **Convert:** Enter an amount in either the "Amount" or "Result" field in the converter section.
3. **Check History:** - Click on any currency in the list.
    - Use the date pickers to define a range (up to 31 days).
    - Click **"Show"** to update the table.

## Installation

Simply clone the repository and open `index.html` in your preferred web browser. No external dependencies or installation required.

```bash
git clone [https://github.com/your-username/currency-informer.git](https://github.com/your-username/currency-informer.git)