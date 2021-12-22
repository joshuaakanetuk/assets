/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Services
import { api } from '../services/api';

// Context
import { useAppContext } from '../context';
import { Modal } from 'react-overlays';

const StyledModal = styled.form`
  font-family: Inter;
`;

const StyledInvestmentName = styled.h2`
  margin: 0.26em 0 20px 0;
  border: none;

  &[contenteditable] {
    outline: 0px solid transparent;
  }

  &[contenteditable]:focus {
    background-color: rgb(245, 248, 250);
  }

  &[contenteditable="true"]:empty:not(:focus):before {
    content: attr(data-ph);
    color: grey;
  }
`;

const StyledSubtitle = styled.div`
  margin-bottom: 20px;
`;

const StyledAmount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  span {
    font-size: 14px;
  }
`;

const StyledTextInput = styled.input`
  height: 36px;
  background-color: rgb(245, 248, 250);
  border-radius: 4px;
  border-color: #e2e8f0;
  border-style: solid;
  border-width: 1px;
  display: inline;
  font-family: inherit;
  width: 40%;
  text-align: right;

  transition: border-color 200ms ease 0s;

  &:focus {
    background-color: rgb(255, 255, 255);
    border-color: rgb(0, 200, 5);
    outline: 0px;
  }
`;

const StyledSelect = styled.select`
  height: 36px;
  background-color: rgb(245, 248, 250);
  border-radius: 4px;
  border-color: #e2e8f0;
  border-style: solid;
  border-width: 1px;
  display: inline;
  font-family: inherit;
  width: 40%;
  text-align: right;

  transition: border-color 200ms ease 0s;
`;

const StyledDatalist = styled.input`
  background-color: rgb(245, 248, 250);
  border-radius: 4px;
  border-color: #e2e8f0;
  border-style: solid;
  border-width: 1px;
  color: black;
  height: 36px;
  width: 40%;
  font-family: inherit;
  text-align: right;

  &:focus {
    background-color: rgb(255, 255, 255);
    border-color: rgb(0, 200, 5);
    outline: 0px;
  }
`;

const StyledButton = styled.button`
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  background-color: rgba(0, 200, 5, 1);
  border-radius: 4px;
  border: 0px;
  color: white;
  display: inline;
  font-family: inherit;
  font-weight: bold;
  height: 48px;
  padding-bottom: 0px;
  padding-top: 0px;
  width: 100%;

  &:hover {
    background-color: rgba(0, 180, 5, 1);
  }

  &:active {
    background-color: rgba(0, 160, 5, 1);
  }
`;

const StyledRemoveButton = styled(StyledButton)`
  margin-top: 20px;
  background-color: rgba(255, 80, 0, 1);

  &:hover {
    background-color: rgba(255, 60, 0, 1);
  }

  &:active {
    background-color: rgba(255, 40, 0, 1);
  }
`;

export const ModalContent = props => {
  // 'Global' object for current asset
  const { current, createAsset, updateAsset } = useAppContext();
  // Array of symbols when searching for assets.
  const [symbol, setSymbol] = useState(current.symbol ? [current.symbol] : []);
  // Temp state for all logic before sending requests.
  const [state, setState] = useState(current);
  // Is the modal being loaded with an asset beforehand?
  const [isNewAsset, setIsNewAsset] = useState(false);

  useMemo(() => {
    setIsNewAsset(Object.keys(current).length === 0);
  }, []);

  const handleChange = (element, value) => {
    setState({ ...state, [element]: value });
  };

  const handleSubmit = async () => {
    if(isNewAsset) {
      await createAsset(state);
      props.closeModal(false);
    }
    else {
      await updateAsset(state);
      props.closeModal(false);
    }
  };

  const handleSymbolLookup = (value) => {
    api.getSymbol(value).then((data) => console.log(data));
  };

  return (
    <StyledModal
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {!isNewAsset ? (
        <StyledInvestmentName required>{current.name}</StyledInvestmentName>
      ) : (
        <StyledInvestmentName 
          contentEditable 
          required
          data-ph="Click to edit!"
          onInput={(e) => handleChange('name', e.target.textContent) }>
          {current.name}
        </StyledInvestmentName>
      )}
      {
        isNewAsset && (
          <StyledAmount>
            <span>Type</span>
            <StyledSelect
              required
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <option value=' '> </option>
              <option value='cash'>Cash</option>
              <option value='credit'>Credit</option>
              <option value='crypto'>Crypto</option>
              <option value='stock'>Stock</option>
            </StyledSelect>
          </StyledAmount>
        )
      }
      <StyledAmount>
        <span>Amount</span>
        <StyledTextInput
          type='number'
          defaultValue={current.amount}
          onChange={(e) => handleChange('amount', Number(e.target.value))}
        />
      </StyledAmount>
      {/* Or if isNewAsset is true and type is not cash or credit */}
      {symbol.length > 0 && (
        <StyledAmount>
          <span>Symbol</span>
          <StyledDatalist
            required
            placeholder={symbol[0]}
            list="test"
            onChange={(e) => handleSymbolLookup(e.target.value)}
          />
          <datalist id="test">
            {symbol.map((element) => (
              <option key={element} value={element} />
            ))}
          </datalist>
        </StyledAmount>
      )}
      <StyledAmount>
        <span>Platform</span>
        <StyledTextInput
          required
          defaultValue={current.platform}
          onChange={(e) => handleChange('platform', (e.target.value))}
        />
      </StyledAmount>
      <StyledButton
        type='button'
        onClick={() => handleSubmit()}>{isNewAsset ? 'Add' : 'Update'}</StyledButton>
      <StyledRemoveButton
        type='button'
      >Remove</StyledRemoveButton>
    </StyledModal>
  );
};

ModalContent.propTypes = {
  closeModal: PropTypes.func.isRequired
};