import React, { FC, useCallback } from "react";
import { FlatList, View, ViewStyle } from "react-native";

import { Spacing } from "../constants/dimension";
import useColors from "../hooks/useColors";
import { LPTokensState } from "../hooks/useLPTokensState";
import LPToken from "../types/LPToken";
import { formatBalance } from "../utils";
import CloseIcon from "./CloseIcon";
import Expandable from "./Expandable";
import FlexView from "./FlexView";
import { ITEM_SEPARATOR_HEIGHT } from "./ItemSeparator";
import Loading from "./Loading";
import Selectable from "./Selectable";
import SelectIcon from "./SelectIcon";
import Text from "./Text";
import TokenLogo from "./TokenLogo";

export type LPTokenSelectFilter = "balance" | "amountDeposited" | "";

export interface LPTokenSelectProps {
    state: LPTokensState;
    title: string;
    emptyText: string;
    Item: FC<LPTokenItemProps>;
    style?: ViewStyle;
}

export interface LPTokenItemProps {
    token: LPToken;
    selected: boolean;
    onSelectToken: (token: LPToken) => void;
}

const LPTokenSelect: FC<LPTokenSelectProps> = props => {
    const onUnselectToken = () => props.state.setSelectedLPToken();
    return (
        <View style={props.style}>
            <Expandable
                title={props.title}
                expanded={!props.state.selectedLPToken}
                onExpand={() => props.state.setSelectedLPToken()}>
                <LPTokenList state={props.state} emptyText={props.emptyText} Item={props.Item} />
            </Expandable>
            {props.state.selectedLPToken && (
                <props.Item token={props.state.selectedLPToken} selected={true} onSelectToken={onUnselectToken} setTokenChanged={props.setTokenChanged} />
            )}
        </View>
    );
};

// tslint:disable-next-line:max-func-body-length
const LPTokenList = ({
    state,
    emptyText,
    Item
}: {
    state: LPTokensState;
    emptyText: string;
    Item: FC<LPTokenItemProps>;
}) => {
    const renderItem = useCallback(
        ({ item }) => {
            return <Item key={item.symbol} token={item} selected={false} onSelectToken={state.setSelectedLPToken} />;
        },
        [state.setSelectedLPToken]
    );
    const data = state.lpTokens.sort((prev, next) => next.id - prev.id)
    return state.loading ? (
        <Loading />
    ) : data.length === 0 ? (
        <EmptyList text={emptyText} />
    ) : (
        <FlatList keyExtractor={item => item.symbol} data={data} renderItem={renderItem} />
    );
};

const EmptyList = ({ text }: { text: string }) => {
    return (
        <View style={{ margin: Spacing.normal }}>
            <Text disabled={true} style={{ textAlign: "center", width: "100%" }}>
                {text}
            </Text>
        </View>
    );
};

export const LPTokenItem: FC<LPTokenItemProps> = props => {
    const { textMedium, textLight, tokenBg } = useColors();
    const balance = formatBalance(props.token.balance, props.token.decimals, 6);
    const onPress = useCallback(() => {
        if(props.setTokenChanged) {
            props.setTokenChanged(true)
        }
        props.onSelectToken(props.token);
    }, [props.onSelectToken, props.token]);

    return (
        <Selectable
            selected={props.selected}
            onPress={onPress}
            containerStyle={{ marginBottom: ITEM_SEPARATOR_HEIGHT }}>
            <FlexView style={{
                    alignItems: "center",
                    paddingBottom: 20,
                    paddingTop: 20,
                    paddingLeft: 10,
                    paddingRight: 10,
                    background: tokenBg,
                    borderRadius: 8
                }}
            >
                <View style={{alignSelf: 'flex-start'}}>
                    <TokenLogo token={props.token.tokenA} small={true} replaceWETH={true} />
                    <TokenLogo token={props.token.tokenB} small={true} replaceWETH={true} style={{ position: 'absolute', top: 15, left: 15 }} />
                </View>
                <View style={{ marginLeft: Spacing.normal }}>
                    <Text style={{color: textLight, paddingBottom: 5}}>Liquidity pair</Text>
                    <Text medium={true} caption={true}>
                        {props.token.tokenA.symbol}-{props.token.tokenB.symbol}
                    </Text>
                </View>
                <View style={{ flex: 1, marginLeft: Spacing.tiny }}>
                    <Text style={{color: textLight, paddingBottom: 5, textAlign: "right"}}>Amount</Text>
                    <Text caption={true} light={true} style={{ textAlign: "right", color: textMedium }}>
                        {balance}
                    </Text>
                </View>
                {props.selected ? <CloseIcon /> : <SelectIcon />}
            </FlexView>
        </Selectable>
    );
};

export default LPTokenSelect;
