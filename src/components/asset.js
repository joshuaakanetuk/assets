// an asset { ... }
import styled from 'styled-components';
import { useAppContext } from '../context';
import PropTypes from 'prop-types';

// utils
import { numberWithCommas } from '../helpers/utils';

const StyledSection = styled.section``;

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

const Section = ({ asset, index, type, setOverlay }) => {

  let {
    getItem,
    prices,
  } = useAppContext();


  return (
    <StyledInvestment
      onClick={() => {
        getItem(index, type);
        setOverlay(true);
      }}
      key={asset.id}>
      <div className="">
        <StyledInvestmentSymbol>
          {asset.symbol}
        </StyledInvestmentSymbol>
        {/* Name of the asset */}
        <div>{asset.name}</div>
        {/* If stock/crypto then price of 1 asset */}
        { ['cash', 'credit'].includes(asset.type) === false && (
          <div>{numberWithCommas((prices.find(item => asset.symbol === item.symbol).price).toFixed(2))}</div>
        )}
      </div>
      <StyledInvestmentData>
        <StyledInvestmentPrice>
          {prices.find(item => asset.symbol === item.symbol) ? 
            '$' + numberWithCommas((Number(prices.find(item => asset.symbol === item.symbol).price) * Number(asset.amount)).toFixed(2)) 
            : asset.type === 'credit'
              ? `-$${numberWithCommas(asset.amount)}`
              : `$${numberWithCommas(asset.amount)}` }
        </StyledInvestmentPrice>
        { ['cash', 'credit'].includes(asset.type) === false && (
          <div className="">{asset.amount} shares</div>
        )}
      </StyledInvestmentData>
    </StyledInvestment>);
};

Section.propTypes = {
  /**
   * Smallest unit of calculator.
   */
  asset: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    amount: PropTypes.number,
    name: PropTypes.string,
    platform: PropTypes.string,
    symbol: PropTypes.string,
  }),
  /**
   * Temp number for position in type array.
   */
  index: PropTypes.number,
  setOverlay: PropTypes.func.isRequired,
  type: PropTypes.arrayOf(PropTypes.any),
};

export default Section;