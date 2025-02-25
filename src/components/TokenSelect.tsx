import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FlatList, View, ViewStyle } from "react-native";

import { IS_DESKTOP, Spacing } from "../constants/dimension";
import { EthersContext } from "../context/EthersContext";
import useDelayedEffect from "../hooks/useDelayedEffect";
import useTranslation from "../hooks/useTranslation";
import useStyles from "../hooks/useStyles";
import useColors from "../hooks/useColors";
import Token from "../types/Token";
import TokenWithValue from "../types/TokenWithValue";
import CloseIcon from "./CloseIcon";
import Expandable from "./Expandable";
import FlexView from "./FlexView";
import { ITEM_SEPARATOR_HEIGHT } from "./ItemSeparator";
import Loading from "./Loading";
import Selectable from "./Selectable";
import SelectIcon from "./SelectIcon";
import Text from "./Text";
import TokenAmount from "./TokenAmount";
import TokenLogo from "./TokenLogo";
import TokenName from "./TokenName";
import TokenPrice from "./TokenPrice";
import TokenSearch from "./TokenSearch";
import TokenSymbol from "./TokenSymbol";
import TokenValue from "./TokenValue";

export interface TokenSelectProps {
    title: string;
    symbol: string;
    onChangeSymbol: (symbol: string) => void;
    disabled?: (token: Token) => boolean;
    hidden?: (token: Token) => boolean;
    style?: ViewStyle;
    type?: string;
    fromSymbol?: string;
}

const TokenSelect: FC<TokenSelectProps> = props => {
    const { tokens, addCustomToken } = useContext(EthersContext);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const token = useMemo(() => tokens.find(t => t.symbol === props.symbol), [tokens, props.symbol]);
    const onSelectToken = t => props.onChangeSymbol(t.symbol);
    const onUnselectToken = () => props.onChangeSymbol("");
    const { border } = useStyles();
    const t = useTranslation();
    const onAddToken = async (t: Token) => {
        await addCustomToken(t);
        setSearch("");
        setQuery("");
        props.onChangeSymbol(t.symbol);
    };
    const hidden = (t: Token) => {
        if (query.length > 0) {
            return !t.symbol.toLowerCase().includes(query) && !t.name.toLowerCase().includes(query);
        }
        return props.hidden?.(t) || false;
    };
    useEffect(() => setSearch(""), [props.symbol]);
    useDelayedEffect(() => setQuery(search.trim().toLowerCase()), 300, [search]);
    
    const tokensContent = () => (
        <>
            <TokenSearch text={search} onChangeText={setSearch} tokens={tokens} onAddToken={onAddToken} />
            <TokenList state={props.state} disabled={props.disabled} hidden={hidden} onSelectToken={onSelectToken} />
        </>
    )

    return (
        <View style={props.style}>
            <Expandable title={props.title} expanded={!props.symbol} onExpand={() => props.onChangeSymbol("")}>
                {
                    
                    props.type === 'token-to-buy' ? 
                        props.fromSymbol ?
                            tokensContent()
                        :
                            <View style={{ paddingVertical: 30, ...border() }}>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>{t("select-sell-token")}</Text>
                            </View>
                    :
                        tokensContent()
                }
            </Expandable>
            {token && <TokenItem token={token} selected={true} onSelectToken={onUnselectToken} selectable={true} />}
        </View>
    );
};

const TokenList = (props: {
    onSelectToken: (token: Token) => void;
    disabled?: (token: Token) => boolean;
    hidden?: (token: Token) => boolean;
    state?: any;
}) => {
    const { loadingTokens, tokens } = useContext(EthersContext);
    const renderItem = useCallback(
        ({ item }) => {
            return (
                <TokenItem
                    key={item.address}
                    token={item}
                    selected={false}
                    onSelectToken={props.onSelectToken}
                    disabled={props.disabled?.(item)}
                />
            );
        },
        [props.onSelectToken, props.disabled]
    );
    const data = useMemo(() => {
        const filtredTokens = tokens.filter(token => {
            if(props.hidden) {
                if(props.hidden(token) || token.symbol === props.state.fromToken?.symbol || token.symbol === props.state.toToken?.symbol) {
                    return false
                }
                else {
                    return true
                }
            }
        }).sort(compareTokens)
        return filtredTokens
    }, [tokens, props.hidden]
);
    return loadingTokens ? (
        <Loading />
    ) : data.length === 0 ? (
        <EmptyList />
    ) : (
        <FlatList keyExtractor={item => item.address} data={data} renderItem={renderItem} />
    );
};

const EmptyList = () => {
    const t = useTranslation();
    return (
        <View style={{ margin: Spacing.normal }}>
            <Text disabled={true} style={{ textAlign: "center", width: "100%" }}>
                {t("you-dont-have-assets")}
            </Text>
        </View>
    );
};

// tslint:disable-next-line:max-func-body-length
const TokenItem = (props: {
    token: TokenWithValue;
    selected: boolean;
    onSelectToken: (token: Token) => void;
    disabled?: boolean;
    selectable?: boolean;
}) => {
    const { tokenBg } = useColors();
    const onPress = useCallback(() => {
        props.onSelectToken(props.token);
    }, [props.onSelectToken, props.token]);
    return (
        <Selectable
            selected={props.selected}
            onPress={onPress}
            disabled={props.disabled || props.selectable}
            containerStyle={{
                marginBottom: 5
            }}>
            <FlexView style={{
                    alignItems: "center",
                    paddingBottom: 20,
                    paddingTop: 20,
                    paddingLeft: 10,
                    paddingRight: 10,
                    background: tokenBg,
                    borderRadius: 8
                }}>
                <TokenLogo token={props.token} disabled={props.disabled} />
                <View>
                    {props.token.priceUSD !== null && (
                        <TokenPrice
                            token={props.token}
                            disabled={props.disabled}
                            style={{ marginLeft: Spacing.small, paddingBottom: 5 }}
                        />
                    )}
                    <TokenName token={props.token} disabled={props.disabled} />
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    {props.token.valueUSD !== null && <TokenValue token={props.token} disabled={props.disabled} style={{ paddingBottom: 5 }} />}
                    <FlexView>
                        <TokenAmount
                            token={props.token}
                            disabled={props.disabled}
                            style={{ flex: 1, textAlign: "right" }}
                        />
                        {IS_DESKTOP && <TokenSymbol token={props.token} disabled={props.disabled} />}
                    </FlexView>
                </View>
                {props.selected ? <CloseIcon /> : <SelectIcon />}
            </FlexView>
        </Selectable>
    );
};

const compareTokens = (t1: TokenWithValue, t2: TokenWithValue) => {
    if (t2.balance.isZero() && t1.balance.isZero()) return (t2?.priceUSD || 0) - (t1?.priceUSD || 0);
    const value2 = t2?.valueUSD || 0;
    const value1 = t1?.valueUSD || 1;
    if (value2 === value1) {
        return (
            (t2.balance.isZero() ? 0 : 10000000000) -
            (t1.balance.isZero() ? 0 : 10000000000) +
            t1.symbol.localeCompare(t2.symbol)
        );
    }
    return value2 - value1;
};

export default TokenSelect;
