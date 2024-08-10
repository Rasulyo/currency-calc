import { useState, useRef } from 'react';
import { Result } from '../Result/index';
import { Clock } from '../Clock/index';
import {
  Wrapper,
  HeaderLogo,
  Legend,
  Label,
  InputName,
  InputWindow,
  RatesDate,
  Button,
  CalculateIcon,
  ErrorInfo,
  ErrorSubInfo,
} from './styled';
import { Loading } from './Loading/index';
import { useCurrencyData } from '../hooks/useCurrencyData';
import header_logo from '../images/header_logo.png';
import exchange_icon from '../images/exchange_icon.png';
import { CurrencyData, ResultData } from '../types/types.js';
import { getExchangeRatesDate } from 'utils/getExchangeRatesDate';
import { calculateResult } from 'utils/calculateResult';

interface FormProps {
  title: string;
}

const Form: React.FC<FormProps> = ({ title }) => {
  const apiData: CurrencyData = useCurrencyData();
  const initialResult: ResultData = {
    sourceAmount: 0,
    targetAmount: '0',
    currency: '',
  };
  const [result, setResult] = useState<ResultData>(initialResult);
  const [firstSelectedCurrency, setFirstSelectedCurrency] = useState('USD');
  const [selectedCurrency, setSelectedCurrency] = useState('KGS');
  const [amount, setAmount] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (amount !== '' && apiData.status === 'downloaded') {
      const result = calculateResult(
        firstSelectedCurrency,
        selectedCurrency,
        amount,
        apiData
      ) as ResultData;
      const { sourceAmount, targetAmount, currency } = result;
      setResult({ sourceAmount, targetAmount, currency });
    }
    inputRef?.current?.focus();
    // setAmount(''); //clear if need after clicking calculate
  };

  return (
    <Wrapper data-testid='form' onSubmit={onSubmit}>
      <Clock />
      <HeaderLogo src={header_logo} alt='header_logo' />
      <Legend data-testid='title'>{title}</Legend>
      {apiData.status === 'loading' ? (
        <Loading />
      ) : apiData.status === 'error' ? (
        <>
          <ErrorInfo data-testid='error'>
            No currencies available at the moment.
          </ErrorInfo>
          <ErrorSubInfo>Sorry, please try again later.</ErrorSubInfo>
        </>
      ) : (
        <>
          <Label>
            <InputName>
              {' '}
              <InputWindow
                as='select'
                value={firstSelectedCurrency}
                onChange={({ target }) =>
                  setFirstSelectedCurrency(target.value)
                }
                name='currency'
                required
                data-testid='select'
              >
                {apiData.rates &&
                  Object.keys(apiData.rates).map((currency) => (
                    <option
                      data-testid='option'
                      key={currency}
                      value={currency}
                    >
                      {currency}
                    </option>
                  ))}
              </InputWindow>
            </InputName>
            <InputWindow
              value={amount}
              onChange={({ target }) => setAmount(target.value)}
              ref={inputRef}
              type='number'
              placeholder='Enter the amount to exchange'
              step='0.01'
              max='10000000000'
              min='0.01'
              required
              data-testid='input'
            />
          </Label>
          <Label>
            <InputName>Choose currency:</InputName>
            <InputWindow
              as='select'
              value={selectedCurrency}
              onChange={({ target }) => setSelectedCurrency(target.value)}
              name='currency'
              required
              data-testid='select'
            >
              {apiData.rates &&
                Object.keys(apiData.rates).map((currency) => (
                  <option data-testid='option' key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
            </InputWindow>
          </Label>
          <RatesDate data-testid='rates-date'>
            Exchange rates current as of:{' '}
            <strong>{getExchangeRatesDate(apiData)}</strong>
          </RatesDate>
          <Button data-testid='calculate-btn'>
            <CalculateIcon src={exchange_icon} alt='exchange_icon' />
            Calculate
          </Button>
          <Result result={result} />
        </>
      )}
    </Wrapper>
  );
};

export default Form;
