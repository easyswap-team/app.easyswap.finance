import React, { useCallback } from "react";
import { View } from "react-native";
import FlexView from "./FlexView";
import TokenLogo from "./TokenLogo";
import TokenPrice from "./TokenPrice";
import TokenName from "./TokenName";
import TokenValue from "./TokenValue";
import TokenAmount from "./TokenAmount";
import TokenSymbol from "./TokenSymbol";
import SelectIcon from "./SelectIcon";
import useColors from "../hooks/useColors";
import { IS_DESKTOP, Spacing } from "../constants/dimension";

const TokenItem = (props: {
    token: TokenWithValue;
    selected: boolean;
    onSelectToken: (token: Token) => void;
    disabled?: boolean;
    selectable?: boolean;
    onClick?: any;
}) => {
    const onPress = useCallback(() => {
        props.onSelectToken(props.token);
    }, [props.onSelectToken, props.token]);
    const { tokenBg } = useColors();
    
    return (
        <FlexView 
            style={{
                background: tokenBg,
                flexDirection: 'row',
                alignItems: 'center',
                padding: 20,
                borderRadius: 8
            }}
            onClick={() => {props.onClick()}}
        >
            <TokenLogo token={props.token} disabled={props.disabled} />
            <View>
                {props.token.priceUSD !== null && (
                    <TokenPrice
                        token={props.token}
                        disabled={props.disabled}
                        style={{ marginLeft: Spacing.small }}
                    />
                )}
                <TokenName token={props.token} disabled={props.disabled} />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
                {props.token.valueUSD !== null && <TokenValue token={props.token} disabled={props.disabled} />}
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
    );
};

export default TokenItem;