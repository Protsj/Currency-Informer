# NBU Currency Informer & Converter

A lightweight web application that provides real-time official exchange rates from the National Bank of Ukraine (NBU) and allows users to perform currency conversions instantly.

## 🌟 Overview
This project consists of two main functional blocks:
1.  **Informer Panel (Left):** Displays the current date in Ukrainian format and a list of all available foreign currencies with their exchange rates relative to the Ukrainian Hryvnia (UAH).
2.  **Converter Panel (Right):** A bidirectional calculator that allows users to convert:
    * Foreign Currency (USD, EUR, etc.) → Ukrainian Hryvnia (UAH).
    * Ukrainian Hryvnia (UAH) → Foreign Currency.

## 🚀 Key Features
- **Real-time Data:** Fetches the latest exchange rates directly from the [NBU Public API](https://bank.gov.ua/ua/open-data/api-dev).
- **Live Search & Selection:** Uses a `<datalist>` (or custom dropdown) for quick currency selection.
- **Dynamic Calculations:** Conversions happen in real-time as the user types (using `input` and `change` event listeners).
- **Ukrainian Localization:** Automatically formats the current date using `toLocaleDateString('uk-UA')`.
- **User-Friendly UI:** Responsive layout with a scrollable list for easy navigation through dozens of currencies.

## 🛠 Technologies Used
- **HTML5:** Semantic structure and form elements.
- **CSS3:** Custom styling, Flexbox layout, and styled scrollbars for a modern look.
- **JavaScript (ES6+):** - **Fetch API:** To handle asynchronous HTTP requests using `.then()` chains.
    - **DOM Manipulation:** To dynamically render the currency list and update results.
    - **Data Attributes:** Using `data-rate` to store and retrieve exchange rates efficiently.

## 📂 Project Structure
- `index.html` — The main structure of the application.
- `style.css` — Styling for the panels, inputs, and custom UI components.
- `script.js` — The logic for data fetching, UI rendering, and the conversion engine.

## 📖 How to Run
1. Clone or download the project files.
2. Ensure you have an active internet connection (to fetch data from the NBU API).
3. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, etc.).

## 📝 License
This project is open-source and free to use for educational purposes.