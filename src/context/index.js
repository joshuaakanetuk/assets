/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { createContext, useContext, useMemo, useState, useEffect } from 'react';

// Services
import { api } from '../services/api';

const AppContext = createContext();
export default function AppContextProvider({ children }) {
  const [current, setCurrent] = useState({});
  const [currentId, setCurrentId] = useState({});
  const [prices, setPrices] = useState({});

  const [hodling, setHodling] = useState({
    cash_total: 0,
    cash: [],
    crypto_total: 0,
    crypto: [],
    current: {},
    stock_total: 0,
    stocks: [],
    total: 0,
  });
  

  // const current = {
  //   id,
  //   type,
  //   amount,
  //   ...
  // }

  useEffect(() => {
    api.getPrices()
      .then((data) => {
        setPrices(data);
      });

    api.getHoldings()
      .then((holdings) => {
        setHodling({ ...hodling, 
          cash: holdings.filter(elem => elem.type === 'cash' || elem.type === 'credit'),
          crypto: holdings.filter(elem => elem.type === 'crypto'),
          stocks: holdings.filter(elem => elem.type === 'stock') });
      });

  }, []);

  const calculatedValue = useMemo(
    () => {

      let stock_total = 0;
      let crypto_total = 0;
      let cash_total = 0;

      hodling.stocks.forEach((stock) => {
        let item = prices.find((el) => el.symbol === stock.symbol);
        stock_total += item !== undefined && Number(item.price) * Number(stock.amount);
      });

      hodling.crypto.forEach((crypto) => {
        let item = prices.find((el) => el.symbol === crypto.symbol);
        crypto_total += (item !== undefined) && Number(item.price) * Number(crypto.amount);

      });
    
      cash_total = hodling.cash.reduce(
        (p, k) => (k.account === 'credit' ? p - Number(k.amount) : p + Number(k.amount)),
        0
      );
    
     
      return cash_total + stock_total + crypto_total;

    },[hodling.cash, hodling.stocks, hodling.crypto, prices]);

  function getItem(id, type) {
    console.log(type);
    setCurrent(type[id]);
  }

  function clearCurrent() {
    setCurrent({});
  }

  // Create, Update, and Delete for Assets
  const createAsset = (asset) => {
    let type = asset.type;
    if(asset.type === 'stock') {
      type = 'stocks';
    }
    api.insertAsset(asset)
      .then(data => {
        setHodling({...hodling, [type]: [...hodling[asset.type], data] });
        return Promise.resolve(0);
      })
      .catch((err) => {
        return err;
      });
  };

  const updateAsset = (asset) => {
    let type = asset.type;
    if(asset.type === 'stock') {
      type = 'stocks';
    }

    api.updateHolding(asset)
      .then(data => {
        let filteredArray = hodling[type].filter((elem) => elem.id !== data.id);
        setHodling({...hodling, [type]: [...filteredArray, data] });
        return Promise.resolve(0);
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  const deleteAsset = (asset) => {
    api.deleteHolding(asset)
      .then(data => {
        let filteredArray = hodling[type].filter((elem) => elem.id !== data.id);
        setHodling({...hodling, [type]: filteredArray });
        return Promise.resolve(0);
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  return (
    <AppContext.Provider
      value={{
        clearCurrent,
        STOCKS: hodling.stocks,
        CASH: hodling.cash,
        CRYPTO: hodling.crypto,
        getItem,
        current,
        total: calculatedValue,
        createAsset,
        updateAsset,
        deleteAsset,
        prices,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const AppState = useContext(AppContext);
  if (AppContext === undefined) {
    throw new Error('Must useAppContext() inside <AppContextProvider/>');
  }
  return AppState;
};
