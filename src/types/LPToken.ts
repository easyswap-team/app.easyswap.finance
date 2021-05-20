import { ethers } from "ethers";
import Token from "./Token";

export default interface LPToken extends Token {
    id?: number;
    tokenA: Token;
    tokenB: Token;
    totalSupply: ethers.BigNumber;
    amountDeposited?: ethers.BigNumber;
    pendingEsm?: ethers.BigNumber;
    pendingEsg?: ethers.BigNumber;
    esmRewardPerYearPerToken?: ethers.BigNumber;
    apy?: number;
    totalValueUSD?: number;
    multiplier?: number;
}
