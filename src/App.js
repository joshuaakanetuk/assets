/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Modal from 'react-modal';
import { ModalContent } from './components/modal';
import Section from './components/asset';
import noScroll from 'no-scroll';

// Context

import { useAppContext } from './context';

// Helper Functions

import { searchSymbol } from './helpers/search';
import { numberWithCommas } from './helpers/utils';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const StyledNet = styled.h1`
  text-align: left;
  font-size: 36px;
`;

const StyledApp = styled.div`
  font-family: "Inter";
  padding: 0 40px 20px 40px;
  max-width: 768px;
  margin: 0 auto;
`;

const StyledHeader = styled.div`
  font-size: 28px;
  text-align: left;
`;

// Unordered List

const StyledUnorderedList = styled.ul`
  padding: 0;
`;

// List Items

const StyledInvestment = styled.li`
  list-style: none;
  border-bottom: 0.5px solid #e2e8f0;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &:last-child {
    border-bottom: 0;
  }
`;

const StyledInvestmentSymbol = styled.div`
  text-align: left;
  font-weight: bold;
`;

const StyledInvestmentData = styled.div`
  text-align: right;
`;

const StyledInvestmentPrice = styled.div`
  font-weight: bold;
`;

const StyledFooter = styled.footer`
  margin: 20px 0;
  font-size: 12px;
  text-align: center;
`;

const App = function () {
  const [overlay, setOverlay] = useState(false);

  let {
    STOCKS,
    CASH,
    CRYPTO,
    getItem,
    total,
    prices,
    clearCurrent,
  } = useAppContext();

  useEffect(() => {
    if (overlay) {
      noScroll.on();
    }

    return () => {
      noScroll.off();
    };
  });


  return (
    <StyledApp className="App">
      <Modal
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        style={customStyles}
        isOpen={overlay}
        onRequestClose={() => {
          clearCurrent();
          setOverlay(false);
        }}
        contentLabel="Modal"
      >
        <div>
          <ModalContent
            closeModal={setOverlay}
          />
        </div>
      </Modal>

      <StyledNet>{`$${numberWithCommas(total.toFixed(2))}`}</StyledNet>

      {/* CASH */}
      <section className="type">
        <StyledHeader>Cash</StyledHeader>
        <StyledUnorderedList>
          {CASH.map((element, id) => (
            <Section
              type={CASH}
              key={element.id}
              asset={element}
              index={id}
              setOverlay={setOverlay} />
          ))}
        </StyledUnorderedList>
      </section>

      {/* STOCKS */}
      <section className="type">
        <StyledHeader>Stocks</StyledHeader>
        <StyledUnorderedList>
          {STOCKS.map((element, id) => (
            <Section
              type={STOCKS}
              key={element.id}
              asset={element}
              index={id}
              setOverlay={setOverlay} />
          ))}
        </StyledUnorderedList>
      </section>

      {/* CRYPTO */}
      <section className="type">
        <StyledHeader>Crypto</StyledHeader>
        <StyledUnorderedList>
          {CRYPTO.map((element, id) => (
            <Section
              type={CRYPTO}
              key={element.id}
              asset={element}
              index={id}
              setOverlay={setOverlay} />
          ))}
        </StyledUnorderedList>
        <button onClick={() => {
          setOverlay(true);
        }}>Add Something</button>
      </section>
      <StyledFooter>
        Copyright© 2021<br />Joshua Akan-Etuk
      </StyledFooter>
    </StyledApp>
  );
};

export default App;
