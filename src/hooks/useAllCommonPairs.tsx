import { useCallback } from "react";
import { WETH } from "../utils";
import { ChainId, Currency, ETHER, Fetcher, Pair, Token} from "@sushiswap/sdk";
import { ethers } from "ethers";


const USDT = new Token(ChainId.MAINNET, "0x688ce8a97d5f1193261DB2271f542193D1dFd866", 18, "USDT", "Tether USD");
const SUSHI = new Token(ChainId.MAINNET, "0x8A7454Ad58E3D60bf2eF4B3f1b04F6981269394e", 18, "SUSHI", "SushiToken");
const BTCB = new Token(ChainId.MAINNET, "0xBC23fCAD2c5E279c65Fc1DA5B181305bb2d1bAB7", 18, "BTCB", "BTCB Token");
const BBETH = new Token(ChainId.MAINNET, "0xA936573f548fDd74B06F2E2A613Af274bDFa8169", 18, "BBETH", "BBETH Token");
const BUSD = new Token(ChainId.MAINNET, "0x3382f1eb52d3caa32e281eac539C48Bb0a3D6290", 18, "BUSD", "BUSD Token");

const BASES_TO_CHECK_TRADES_AGAINST = [WETH[ChainId.MAINNET], USDT, SUSHI, BTCB, BBETH, BUSD];
const CUSTOM_BASES = {
    [BUSD.address]: [USDT, WETH[ChainId.MAINNET], BTCB, SUSHI, BUSD, BBETH]
};

function wrappedCurrency(currency: Currency | undefined): Token | undefined {
    return currency === ETHER ? WETH[ChainId.MAINNET] : currency instanceof Token ? currency : undefined;
}

// Source: https://github.com/Uniswap/uniswap-interface/blob/master/src/hooks/Trades.ts
const useAllCommonPairs = () => {
    const loadAllCommonPairs = useCallback(
        // tslint:disable-next-line:max-func-body-length
        async (currencyA?: Currency, currencyB?: Currency, provider?: ethers.providers.BaseProvider) => {
            const bases: Token[] = BASES_TO_CHECK_TRADES_AGAINST;
            const [tokenA, tokenB] = [wrappedCurrency(currencyA), wrappedCurrency(currencyB)];
            const basePairs: [Token, Token][] = bases
                .flatMap((base): [Token, Token][] => bases.map(otherBase => [base, otherBase]))
                .filter(([t0, t1]) => t0.address !== t1.address);

            const allPairCombinations =
                tokenA && tokenB
                    ? [
                          // the direct pair
                          [tokenA, tokenB],
                          // token A against all bases
                          ...bases.map((base): [Token, Token] => [tokenA, base]),
                          // token B against all bases
                          ...bases.map((base): [Token, Token] => [tokenB, base]),
                          // each base against all bases
                          ...basePairs
                      ]
                          .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
                          .filter(([t0, t1]) => t0.address !== t1.address)
                          .filter(([a, b]) => {
                              const customBases = CUSTOM_BASES;
                              if (!customBases) return true;

                              const customBasesA: Token[] | undefined = customBases[a.address];
                              const customBasesB: Token[] | undefined = customBases[b.address];

                              if (!customBasesA && !customBasesB) return true;

                              if (customBasesA && !customBasesA.find(base => tokenB.equals(base))) return false;
                              return !(customBasesB && !customBasesB.find(base => tokenA.equals(base)));
                          })
                    : [];

            const pairs = await Promise.all(
                allPairCombinations.map(async pair => {
                    try {
                        return await Fetcher.fetchPairData(pair[0], pair[1], provider);
                    } catch (e) {
                        return null;
                    }
                })
            );
            return pairs.filter(pair => pair !== null) as Pair[];
        },
        []
    );

    return { loadAllCommonPairs };
};

export default useAllCommonPairs;
