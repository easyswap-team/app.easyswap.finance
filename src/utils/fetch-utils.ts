import React, {useContext} from "react"
import { Pair } from "@sushiswap/sdk";
import { ethers } from "ethers";
import { ORDER_BOOK, SETTLEMENT } from "../constants/contracts";
import Fraction from "../constants/Fraction";
import { ETH } from "../constants/tokens";
import { EthersContext } from "../context/EthersContext";
import { Order, OrderStatus } from "../hooks/useSettlement";
import LPToken from "../types/LPToken";
import Token from "../types/Token";
import TokenWithValue from "../types/TokenWithValue";
import {
    convertToken,
    formatBalance,
    getContract,
    isETH,
    isWETH,
    parseBalance,
    parseCurrencyAmount,
    pow10
} from "./index";
import { default as network } from '../../web/network.json';

const SUSHISWAP_FACTORY = "0xb0B5cd873B5639Ce3cDf86e5979a2cF5F194bd05"
const MASTER_CHEF = "0xF6bFF5215A844e5b3eC79B0645ba467BD14416A4";
const LP_TOKEN_SCANNER = "0xcF1829b4446bd8bf544597C7206a7BCE020A35a2";
const blocksPerDay = 6500;

export const fetchTokens = async (account: string, customTokens?: Token[]) => {
    let tokensResponse = await fetch(network[56].tokens)
    let tokensJSON = await tokensResponse.json()
    const tokens = [...tokensJSON, ...(customTokens || [])];

    const balances = await fetchTokenBalances(
        account,
        tokens.map(token => token.address)
    );

    return [
        {
            ...ETH,
            balance: await ALCHEMY_PROVIDER.getBalance(account)
        },
        ...tokens.map((token, i) => ({
            ...token,
            balance: ethers.BigNumber.from(balances[i] || 0)
        }))
    ];
};

export const fetchTokenWithValue = async (
    token: Token,
    weth: Token,
    wethPriceUSD: Fraction,
    getPair: (fromToken: Token, toToken: Token, provider: ethers.providers.BaseProvider) => Promise<Pair>,
    provider: ethers.providers.BaseProvider
) => {
    let fetched: TokenWithValue;
    if (isETH(token) || isWETH(token)) {
        fetched = {
            ...token,
            priceUSD: Number(wethPriceUSD.toString()),
            valueUSD: Number(formatBalance(wethPriceUSD.apply(token.balance)))
        } as TokenWithValue;
    } else {
        try {
            const pair = await getPair(token, weth, provider);
            const priceETH = Fraction.convert(pair.priceOf(convertToken(token)));
            const priceUSD = priceETH.apply(wethPriceUSD.numerator).div(pow10(18 - token.decimals));
            fetched = {
                ...token,
                priceUSD: Number(formatBalance(priceUSD)),
                valueUSD: Number(formatBalance(priceUSD.mul(token.balance).div(pow10(token.decimals))))
            } as TokenWithValue;
        } catch (e) {
            fetched = { ...token, priceUSD: null, valueUSD: null } as TokenWithValue;
        }
    }
    return fetched;
};

// tslint:disable-next-line:max-func-body-length
export const fetchPools = async (account: string, tokens: Token[], provider: ethers.providers.JsonRpcProvider) => {
    let farmPoolsResponse = await fetch(network[56].farmPools)
    let farmPools = await farmPoolsResponse.json()

    const balances = await fetchTokenBalances(
        account,
        farmPools.map(pool => pool.address)
    );

    // tslint:disable-next-line:max-func-body-length
    const fetchPool = async (pool, i): Promise<LPToken | null> => {
        try {
            let result

            if(pool.type === 'Liquidity pair') {
                result = await Promise.all([
                    fetchPairTokens(pool.address, tokens, provider)
                ]);

                const poolData = {
                    ...pool,
                    tokenA: result[0].tokenA,
                    tokenB: result[0].tokenB,
                    balance: ethers.BigNumber.from(balances[i] || 0),
                }

                return poolData;
            }
            else if(pool.type === 'ESM Token') {
                const poolData = {
                    ...pool,
                    balance: ethers.BigNumber.from(balances[i] || 0),
                }

                return poolData;
            }
        } catch (e) {
            return null;
        }
    };
    
    return (await Promise.all(farmPools.map(fetchPool))).filter(pool => !!pool) as LPToken[];
};

export const fetchMyPools = async (account: string, tokens: Token[], provider: ethers.providers.JsonRpcProvider) => {
    let farmPoolsResponse = await fetch(network[56].farmPools)
    let farmPools = await farmPoolsResponse.json()
    
    const fetchMyPool = async (pool): Promise<LPToken | null> => {
        try {
            const myStake = await fetchMyStake(pool.id, account, provider);
            if (myStake.amountDeposited.isZero()) return null;
            
            let result

            if(pool.type === 'Liquidity pair') {
                result = await Promise.all([
                    fetchPairTokens(pool.address, tokens, provider)
                ]);

                return {
                    ...pool,
                    tokenA: result[0].tokenA,
                    tokenB: result[0].tokenB,
                    balance: ethers.constants.Zero,
                    amountDeposited: myStake.amountDeposited,
                    pendingEsm: myStake.pendingEsm,
                    pendingEsg: myStake.pendingEsg,
                    totalSupply: await getContract("ERC20", pool.address, provider).totalSupply()
                };
            }
            else if(pool.type === 'ESM Token') {
                return {
                    ...pool,
                    balance: ethers.constants.Zero,
                    amountDeposited: myStake.amountDeposited,
                    pendingEsm: myStake.pendingEsm,
                    pendingEsg: myStake.pendingEsg,
                    totalSupply: await getContract("ERC20", pool.address, provider).totalSupply()
                };
            }
        } catch (e) {
            return null;
        }
    };
    return (await Promise.all(farmPools.map(fetchMyPool))).filter(pool => !!pool) as LPToken[];
};

const fetchMyStake = async (poolId: number, account: string, provider: ethers.providers.JsonRpcProvider) => {
    const masterChef = getContract("MasterChef", MASTER_CHEF, provider);
    const { amount: amountDeposited } = await masterChef.userInfo(poolId, account);
    const pendingEsm = await masterChef.pendingEsm(poolId, account);
    const pendingEsg = await masterChef.pendingEsg(poolId, account);
    return { amountDeposited, pendingEsm, pendingEsg};
};

const fetchPairTokens = async (pair: string, tokens: Token[], provider: ethers.providers.JsonRpcProvider) => {
    const contract = getContract("IUniswapV2Pair", pair, provider);
    const tokenA = await findOrFetchToken(await contract.token0(), provider, tokens);
    const tokenB = await findOrFetchToken(await contract.token1(), provider, tokens);
    return { tokenA, tokenB };
};

export const fetchMyLPTokens = async (account: string, tokens: Token[], provider: ethers.providers.JsonRpcProvider) => {
    return await fetchLPTokens(SUSHISWAP_FACTORY, account, tokens, provider);
};

export const fetchMyUniswapLPTokens = async (
    account: string,
    tokens: Token[],
    provider: ethers.providers.JsonRpcProvider
) => {
    return await fetchLPTokens(UNISWAP_FACTORY, account, tokens, provider);
};

const LP_TOKENS_LIMIT = 100;

// tslint:disable-next-line:max-func-body-length
const fetchLPTokens = async (
    factory: string,
    account: string,
    tokens: Token[],
    provider: ethers.providers.JsonRpcProvider
) => {
    const factoryContract = getContract("IUniswapV2Factory", factory, provider);
    const length = await factoryContract.allPairsLength();
    const scanner = getContract("LPTokenScanner", LP_TOKEN_SCANNER, provider);
    const pages: number[] = [];
    for (let i = 0; i < length; i += LP_TOKENS_LIMIT) pages.push(i);
    const pairs = (
        await Promise.all(
            pages.map(page =>
                scanner.findPairs(account, factory, page, Math.min(page + LP_TOKENS_LIMIT, length.toNumber()))
            )
        )
    ).flat();
    const balances = await fetchTokenBalances(
        account,
        pairs.map(pair => pair.token)
    );
    return await Promise.all(
        pairs.map(async (pair, index) => {
            const erc20 = getContract("ERC20", pair.token, provider);
            const result = await Promise.all([
                erc20.decimals(),
                erc20.totalSupply(),
                fetchPairTokens(pair.token, tokens, provider)
            ]);
            return {
                address: pair.token,
                decimals: Number(result[0]),
                name: result[2].tokenA.symbol + "-" + result[2].tokenB.symbol + " LP Token",
                symbol: result[2].tokenA.symbol + "-" + result[2].tokenB.symbol,
                balance: ethers.BigNumber.from(balances[index]),
                totalSupply: result[1],
                tokenA: result[2].tokenA,
                tokenB: result[2].tokenB
            } as LPToken;
        })
    );
};

export const findOrFetchToken = async (
    address: string,
    provider: ethers.providers.JsonRpcProvider,
    tokens?: Token[]
) => {
    if (tokens) {
        const token = tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
        if (token) {
            return token;
        }
    }
    let meta = await ALCHEMY_PROVIDER.send("alchemy_getTokenMetadata", [address]);
    if (!meta.name || meta.symbol || meta.decimals || meta.logoURI) {
        meta = await fetchTokenMeta(address, provider);
    }
    return {
        address,
        name: meta.name,
        symbol: meta.symbol,
        decimals: meta.decimals,
        logoURI: meta.logo,
        balance: ethers.constants.Zero
    } as Token;
};

const fetchTokenMeta = async (address: string, provider: ethers.providers.JsonRpcProvider) => {
    const erc20 = getContract("ERC20", address, provider);
    const data = await Promise.all(
        ["name", "symbol", "decimals"].map(field => {
            try {
                return erc20.callStatic[field]();
            } catch (e) {
                return "";
            }
        })
    );
    return {
        name: data[0],
        symbol: data[1],
        decimals: data[2],
        logoURI: ""
    };
};

export const fetchLPTokenWithValue = async (
    lpToken: LPToken,
    weth: Token,
    wethPriceUSD: Fraction,
    getPair: (fromToken: Token, toToken: Token, provider: ethers.providers.BaseProvider) => Promise<Pair>,
    provider: ethers.providers.BaseProvider
) => {
    if(lpToken.type === 'Liquidity pair') {
        const pair = await getPair(lpToken.tokenA, lpToken.tokenB, provider);
        const values = await Promise.all([
            await fetchTotalValue(lpToken.tokenA, pair, weth, wethPriceUSD, getPair, provider),
            await fetchTotalValue(lpToken.tokenB, pair, weth, wethPriceUSD, getPair, provider)
        ]);
        const priceUSD = values[0]
            .add(values[1])
            .mul(pow10(18))
            .div(lpToken.totalSupply);
        return {
            ...lpToken,
            priceUSD: Number(formatBalance(priceUSD)),
            valueUSD: Number(
                formatBalance(priceUSD.mul(lpToken.amountDeposited || lpToken.balance).div(pow10(lpToken.decimals)))
            )
        };
    }
    else {
        return {
            ...lpToken,
            priceUSD: Number(formatBalance(lpToken.balance)),
            valueUSD: Number(
                formatBalance(lpToken.balance.mul(lpToken.amountDeposited || lpToken.balance).div(pow10(lpToken.decimals)))
            )
        };
    }
};

const fetchTotalValue = async (token: Token, lpPair: Pair, weth: Token, wethPriceUSD: Fraction, getPair, provider) => {
    const tokenWithValue = await fetchTokenWithValue(token, weth, wethPriceUSD, getPair, provider);
    const tokenReserve = parseCurrencyAmount(lpPair.reserveOf(convertToken(token)), token.decimals);
    const tokenPrice = parseBalance(String(tokenWithValue.priceUSD || 0));
    return tokenReserve.mul(tokenPrice).div(pow10(token.decimals));
};

const fetchTokenBalances = async (account: string, addresses: string[]) => {
    const balances = await ALCHEMY_PROVIDER.send("alchemy_getTokenBalances", [account, addresses]);
    return balances.tokenBalances.map(balance => balance.tokenBalance);
};

const LIMIT_ORDERS_LIMIT = 20;

export const fetchMyLimitOrders = async (
    provider: ethers.providers.JsonRpcProvider,
    signer: ethers.Signer,
    tokens?: Token[],
    canceledHashes?: string[]
) => {
    const orderBook = getContract("OrderBook", ORDER_BOOK, KOVAN_PROVIDER);
    const settlement = await getContract("Settlement", SETTLEMENT, provider);
    const maker = await signer.getAddress();
    const length = await orderBook.numberOfHashesOfMaker(maker);
    const pages: number[] = [];
    for (let i = 0; i * LIMIT_ORDERS_LIMIT < length; i++) pages.push(i);
    const hashes = (await Promise.all(pages.map(page => orderBook.hashesOfMaker(maker, page, LIMIT_ORDERS_LIMIT))))
        .flat()
        .filter(hash => hash !== ethers.constants.HashZero);
    const myOrders = await Promise.all(
        hashes.map(async hash => {
            const args = await orderBook.orderOfHash(hash);
            return new Order(
                signer,
                await findOrFetchToken(args.fromToken, provider, tokens),
                await findOrFetchToken(args.toToken, provider, tokens),
                args.amountIn,
                args.amountOutMin,
                args.recipient,
                args.deadline,
                args.v,
                args.r,
                args.s,
                await settlement.filledAmountInOfHash(hash),
                canceledHashes && canceledHashes.includes(hash)
            );
        })
    );
    return myOrders.sort(compareOrders) as Order[];
};

const compareOrders = (o0, o1) => {
    const status = (s: OrderStatus) => (s === "Open" ? 0 : s === "Filled" ? 1 : 2);
    const compared = status(o0.status()) - status(o1.status());
    return compared === 0 ? o1.deadline.toNumber() - o0.deadline.toNumber() : compared;
};
