import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyRow from "./CurrencyRow";

const BASE_URL = "http://localhost:8080";

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [toAmount, setToAmount] = useState(1);
  const [fromAmount, setFromAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/fxRates/currencies`)
      .then((res) => res.json())
      .then((data) => {
        setCurrencyOptions(data);
        setFromCurrency(data[0]);
        setToCurrency(data[0]);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      let url =
        BASE_URL +
        "/api/fxRates/getConvertedValue?fromCurrency=" +
        (amountInFromCurrency ? fromCurrency : toCurrency) +
        "&toCurrency=" +
        (amountInFromCurrency ? toCurrency : fromCurrency) +
        "&amount=" +
        (amountInFromCurrency ? fromAmount : toAmount);
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (amountInFromCurrency) {
            setToAmount(data.result);
          } else {
            setFromAmount(data.result);
          }
        });
    }
  }, [fromCurrency, toCurrency, fromAmount, toAmount, amountInFromCurrency]);

  function handleFromAmountChange(e) {
    setFromAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setToAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  return (
    <div className="wrapper">
      <h1>Online currency converter</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={(e) => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </div>
  );
}

export default App;
