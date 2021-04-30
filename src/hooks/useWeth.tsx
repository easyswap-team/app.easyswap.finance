import { useCallback } from "react";

import { WETH } from "@sushiswap/sdk";
import { ethers } from "ethers";
import { getContract } from "../utils";

const useWeth = () => {
    const wrapETH = useCallback(async (amount: ethers.BigNumber, signer: ethers.Signer) => {
        const weth = getContract("IWETH", WETH[56].address, signer);
        const gasLimit = await weth.estimateGas.deposit({
            value: amount
        });
        const tx = await weth.deposit({
            value: amount,
            gasLimit
        });

        return tx
    }, []);

    const unwrapETH = useCallback(async (amount: ethers.BigNumber, signer: ethers.Signer) => {
        const weth = getContract("IWETH", WETH[56].address, signer);
        const gasLimit = await weth.estimateGas.withdraw(amount);
        const tx = await weth.withdraw(amount, {
            gasLimit
        });

        return tx
    }, []);

    return {
        wrapETH,
        unwrapETH
    };
};

export default useWeth;
