import React, { FC, useCallback, useContext, useMemo } from "react";
import { FlatList, Platform, TouchableHighlight, View } from "react-native";
import { Icon } from "react-native-elements";
import { Link } from "react-router-dom";

import { ethers } from "ethers";
import Border from "../components/Border";
import Container from "../components/Container";
import Content from "../components/Content";
import FlexView from "../components/FlexView";
import Heading from "../components/Heading";
import Loading from "../components/Loading";
import Text from "../components/Text";
import Title from "../components/Title";
import TokenAmount from "../components/TokenAmount";
import TokenLogo from "../components/TokenLogo";
import TokenName from "../components/TokenName";
import TokenPrice from "../components/TokenPrice";
import TokenSymbol from "../components/TokenSymbol";
import TokenValue from "../components/TokenValue";
import WebFooter from "../components/web/WebFooter";
import { IS_DESKTOP, Spacing } from "../constants/dimension";
import { EthersContext } from "../context/EthersContext";
import { GlobalContext } from "../context/GlobalContext";
import useColors from "../hooks/useColors";
import useHomeState, { HomeState } from "../hooks/useHomeState";
import useLinker from "../hooks/useLinker";
import useTranslation from "../hooks/useTranslation";
import useStyles from "../hooks/useStyles";
import LPTokenWithValue from "../types/LPTokenWithValue";
import TokenWithValue from "../types/TokenWithValue";
import { formatUSD } from "../utils";
import Screen from "./Screen";
import { PortfolioIcon, PortfolioDarkIcon, ExternalIcon } from '../components/svg/Icons'
import ChangeNetwork from "../components/ChangeNetwork";

interface TokenItemProps {
    token: TokenWithValue;
    disabled?: boolean;
}

interface LPTokenItemProps {
    token: LPTokenWithValue;
    disabled?: boolean;
    tokenType?: string;
}

const HomeScreen = ({navigation}) => {
    const t = useTranslation();
    const state = useHomeState();
    const { borderDark } = useColors();
    const { borderBottom } = useStyles();
    const { loadingTokens, chainId } = useContext(EthersContext);
    const { darkMode } = useContext(GlobalContext);
    const loading = loadingTokens || state.loadingLPTokens || state.loadingPools;
    const totalValue = sum(state.tokens) + sum(state.lpTokens) + sum(state.pools);

    return (
        <Screen>
            <Container>
                <Content style={{ paddingBottom: Spacing.huge }}>
                    <Title text={t("total-value")} style={{ flex: 1, paddingBottom: 15 }} />

                    {
                        chainId !== 56 ?
                            <ChangeNetwork />
                        :
                            <>
                                <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 15, ...borderBottom()}}>
                                    {darkMode ? <PortfolioDarkIcon /> : <PortfolioIcon />}
                                    <Title
                                        text={loading ? t("fetching") : formatUSD(totalValue, 4)}
                                        fontWeight={"light"}
                                        disabled={loading}
                                        style={{ fontSize: IS_DESKTOP ? 25 : 24, marginBottom: 0, marginLeft: 15 }}
                                    />
                                </View>
                                <Home state={state} />
                            </>
                    }
                </Content>
                {Platform.OS === "web" && <WebFooter />}
            </Container>
        </Screen>
    );
};

const Home = ({ state }: { state: HomeState }) => {
    const { borderBottom } = useStyles();

    return (
        <View style={{ marginTop: IS_DESKTOP ? Spacing.large : Spacing.normal }}>
            <MyTokens state={state} />
            <View style={{ height: Spacing.normal, ...borderBottom() }} />
            <MyLPTokens state={state} />
            <View style={{ height: Spacing.large }} />
            <Pools state={state} />
        </View>
    );
};

const MyTokens = ({ state }: { state: HomeState }) => {
    const t = useTranslation();
    const { loadingTokens, tokens } = useContext(EthersContext);
    const goToSwap = useLinker("/swap", "Swap");
    return (
        <View>
            <Heading text={t("tokens")} buttonText={t("manage")} onPressButton={goToSwap} />
            <TokenList loading={loadingTokens} tokens={tokens} TokenItem={TokenItem} />
        </View>
    );
};

const MyLPTokens = ({ state }: { state: HomeState }) => {
    const t = useTranslation();
    const goToRemoveLiquidity = useLinker("/liquidity/remove", "RemoveLiquidity");
    return (
        <View style={{marginTop: 20}}>
            <Heading text={t("liquidity")} buttonText={t("manage")} onPressButton={goToRemoveLiquidity} />
            {/* @ts-ignore */}
            <TokenList loading={state.loadingLPTokens} tokens={state.lpTokens} TokenItem={LPTokenItem} typeToken={'liqudity'} />
        </View>
    );
};

const Pools = ({ state }: { state: HomeState }) => {
    const t = useTranslation();
    const goToFarming = useLinker("/farming", "Farming");
    return (
        <View>
            <Heading text={t("farms")} buttonText={t("manage")} onPressButton={goToFarming} />
            {/* @ts-ignore */}
            <TokenList loading={state.loadingPools} tokens={state.pools} TokenItem={LPTokenItem} typeToken={'farm'} />
        </View>
    );
};

const TokenList = (props: {
    loading: boolean;
    tokens?: TokenWithValue[] | LPTokenWithValue[];
    TokenItem: FC<TokenItemProps | LPTokenItemProps>;
    typeToken?: string;

}) => {
    const renderItem = useCallback(({ item }) => {
        return <props.TokenItem key={item.address} token={item} typeToken={props.typeToken} />;
    }, []);
    const data = useMemo(
        () =>
            (props.tokens || [])
                // @ts-ignore
                .filter(token => !(token.amountDeposited ? token.amountDeposited.isZero() : token.balance.isZero()))
                .sort((t1, t2) => (t2.valueUSD || 0) - (t1.valueUSD || 0)),
        [props.tokens]
    );
    return props.loading ? (
        <Loading />
    ) : data.length === 0 ? (
        <EmptyList />
    ) : (
        <FlatList
            keyExtractor={item => item.address}
            data={data}
            renderItem={renderItem}
        />
    );
};

const EmptyList = () => {
    const t = useTranslation();
    const { border } = useStyles()
    return (
        <View style={{ width: '100%', paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, ...border() }}>
            <Text style={{ textAlign: "center", width: "100%" }}>
                {t("you-dont-have-assets")}
            </Text>
        </View>
    );
};

const TokenItem = (props: TokenItemProps) => {
    const { tokenBg } = useColors();
    return (
        <FlexView style={{
                alignItems: "center",
                marginBottom: 5,
                paddingBottom: 20,
                paddingTop: 20,
                paddingLeft: 10,
                paddingRight: 10,
                background: tokenBg,
                borderRadius: 8
            }}>
            <TokenLogo token={props.token} disabled={props.disabled} />
            <View style={{width: '45%'}}>
                <TokenPrice token={props.token} disabled={props.disabled} style={{ width: '80%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginLeft: Spacing.small, paddingBottom: 5 }} />
                <TokenName token={props.token} disabled={props.disabled} />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end", width: '45%' }}>
                <TokenValue token={props.token} disabled={props.disabled} style={{ textAlign: 'right', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingBottom: 5 }} />
                <FlexView>
                    <TokenAmount token={props.token} disabled={props.disabled} />
                    {IS_DESKTOP && <TokenSymbol token={props.token} disabled={props.disabled} />}
                </FlexView>
            </View>
            <ExternalBtn path={"/swap/?adress=" + props.token.address} />
        </FlexView>
    );
};

const LPTokenItem = (props: LPTokenItemProps) => {
    const { textLight, tokenBg } = useColors();
    const getSymbols = () => {
        let symbols = ''

        if(props.token.tokenA && props.token.tokenB) {
            symbols = `${props.token.tokenA.symbol}-${props.token.tokenB.symbol}`
        }
        else if(props.token.symbol) {
            symbols = props.token.symbol
        }
        
        return symbols
    }

    const getLogos = () => {
        if(props.token.tokenA && props.token.tokenB) {
            return (
                <>
                    <TokenLogo token={props.token.tokenA} small={true} replaceWETH={true} />
                    <TokenLogo token={props.token.tokenB} small={true} replaceWETH={true} style={{ position: 'absolute', top: 15, left: 15 }} />
                </>
            )
        }
        else if(props.token.symbol) {
            return <TokenLogo token={props.token} small={true} replaceWETH={true} style={{ top: 5, left: 10 }} />
        }
    }

    return (
        <FlexView style={{
            background: tokenBg,
            alignItems: "center",
            marginBottom: 5,
            paddingTop: '20px',
            paddingRight: '10px',
            paddingBottom: '20px',
            paddingLeft: '10px',
            borderRadius: 8
            }}
        >
            <View style={{alignSelf: 'flex-start'}}>
                {getLogos()}
            </View>
            <View style={{ marginLeft: Spacing.normal }}>
                <Text style={{color: textLight, paddingBottom: 5}}>Liquidity pair</Text>
                <Text medium={true} caption={true}>
                    {getSymbols()}
                </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
                <FlexView style={{paddingTop: 5}}>
                    <TokenAmount token={props.token} amount={props.token.amountDeposited} disabled={props.disabled} />
                </FlexView>
            </View>
            <ExternalBtn path={
                props.typeToken === 'liqudity' ? `/liquidity/remove/?adress=${props.token.address}` :
                props.typeToken === 'farm' ? `/farming/harvest/?adress=${props.token.address}` : ''
            } 
            />
        </FlexView>
    );
};

const ExternalBtn = ({ path }) => {
    const { textDark, disabled } = useColors();
    return (
        <Link to={path}>
            <ExternalIcon style={{ marginLeft: Spacing.small }} />
        </Link>
    );
};

const sum = tokens => (tokens ? tokens.reduce((previous, current) => previous + (current.valueUSD || 0), 0) : 0);

export default HomeScreen;
