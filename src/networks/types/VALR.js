import tokens from '@/_generated/tokens/tokens-val.json';
import contracts from '@/_generated/contracts/contract-abi-valr.json';
import valr from '@/assets/images/networks/valr.svg';
import { VALR } from '../tlds';

export default {
  name: 'VALR',
  name_long: 'Valorium',
  homePage: 'http://valoriumcoin.com',
  blockExplorerTX: 'http://valoriumcoin.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://etherscan.io/account/[[address]]',
  chainID: 2516,
  tokens: tokens,
  contracts: contracts,
/*   ens: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    registrarTLD: 'eth',
    registrarType: 'permanent',
    supportedTld: ETH
  }, */
  icon: valr,
  currencyName: 'VALR'
};