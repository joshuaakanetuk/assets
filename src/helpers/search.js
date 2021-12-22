export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const ENDPOINT = 'https://www.alphavantage.co';

export const searchSymbols = (symbol) => {
  fetch(
    ENDPOINT +
      `/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=` +
      process.env.REACT_APP_API_KEY
  ).then((res) => {
    if (res['Error Message']) return [];
    return res.json();
  });
};

export const searchSymbol = (symbol) => {
  return new Promise((resolve) => {
    fetch(
      ENDPOINT +
      `/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=` +
      process.env.REACT_APP_API_KEY
    ).then((res) => {
      if (res['Error Message']) return [];
      return resolve(res.json());
    });
  });
};
