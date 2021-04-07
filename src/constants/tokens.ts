import { ethers } from "ethers";
import Token from "../types/Token";

export const ETH: Token = {
    name: "BNB",
    address: ethers.constants.AddressZero,
    decimals: 18,
    symbol: "BNB",
    logoURI: "./images/tokens/BNB.png",
    balance: ethers.BigNumber.from(0)
};
