import config from '../config';

export const api = {
  getSymbol(symbol) {
    return fetch(`${config.STOCK_API_ENDPOINT}/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${config.STOCK_API_KEY}`, {
      headers: {
        // 'authorization': `bearer ${TokenService.getAuthToken()}`
      },
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
  getPrices() {
    return fetch(`${config.API_ENDPOINT}/prices`, {
      headers: {
        // 'authorization': `bearer ${TokenService.getAuthToken()}`
      },
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
  getHoldings() {
    return fetch(`${config.API_ENDPOINT}/holdings`, {
      headers: {
        // 'authorization': `bearer ${TokenService.getAuthToken()}`
      },
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
  updateHolding(asset) {
    return fetch(`${config.API_ENDPOINT}/holdings`, {
      method: 'PATCH',
      body: JSON.stringify(asset),
      headers: {
        'Content-Type': 'application/json',
        // 'authorization': `bearer ${TokenService.getAuthToken()}`
      },
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
  deleteHolding(asset) {
    return fetch(`${config.API_ENDPOINT}/holdings`, {
      method: 'DELETE',
      body: JSON.stringify(asset.id),
      headers: {
        'Content-Type': 'application/json',
        // 'authorization': `bearer ${TokenService.getAuthToken()}`
      },
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    );
  },
  insertAsset(asset) {
    return fetch(`${config.API_ENDPOINT}/holdings`, {
      method: 'POST',
      body: JSON.stringify(asset),
      headers: {
        'Content-Type': 'application/json',
        // 'authorization': `bearer ${TokenService.getAuthToken()}`
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  }
};
