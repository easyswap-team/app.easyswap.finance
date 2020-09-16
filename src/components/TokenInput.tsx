import React, { FC, useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import { ethers } from "ethers";
import { Spacing } from "../constants/dimension";
import Token from "../types/Token";
import { formatBalance, parseBalance } from "../utils";
import Button from "./Button";
import Column from "./Column";
import Input from "./Input";
import Subtitle from "./Subtitle";

export interface TokenInputProps {
    title?: string;
    token?: Token;
    hidden: boolean;
    amount: string;
    onAmountChanged: (amount: string) => void;
    onBlur?: () => void;
}

// tslint:disable-next-line:max-func-body-length
const TokenInput: FC<TokenInputProps> = props => {
    const onChangeText = useCallback(
        (text: string) => {
            if (props.token) {
                try {
                    parseBalance(text, props.token.decimals);
                    props.onAmountChanged(text);
                } catch (e) {
                    if (text.endsWith(".") && text.indexOf(".") === text.length - 1) {
                        props.onAmountChanged(text);
                    }
                }
            }
        },
        [props.token]
    );
    if (props.hidden) {
        return <Column noTopMargin={true} />;
    }
    const label = props.token?.symbol;
    return (
        <Column noTopMargin={!props.title}>
            {props.title && <Subtitle text={props.title} />}
            <View style={{ marginHorizontal: Spacing.small }}>
                <Input
                    label={label}
                    value={props.amount}
                    onChangeText={onChangeText}
                    placeholder={"0.0"}
                    onBlur={props.onBlur}
                />
                {props.token?.balance?.gt(0) && (
                    <MaxButton token={props.token} updateAmount={props.onAmountChanged} onBlur={props.onBlur} />
                )}
            </View>
        </Column>
    );
};

const MaxButton = (props: { token: Token; updateAmount; onBlur }) => {
    const [pressed, setPressed] = useState(false);
    const onPressMax = useCallback(() => {
        if (props.token) {
            let balance = props.token.balance;
            if (props.token.symbol === "ETH") {
                // Subtract 0.01 ETH for gas fee
                const fee = ethers.BigNumber.from(10).pow(16);
                balance = balance.gt(fee) ? balance.sub(fee) : ethers.constants.Zero;
            }
            props.updateAmount(formatBalance(balance, props.token.decimals));
            setPressed(true);
        }
    }, [props.token, props.updateAmount]);
    useEffect(() => {
        if (pressed) {
            props.onBlur?.();
            setPressed(false);
        }
    }, [pressed]);
    return (
        <View style={{ position: "absolute", right: 0, bottom: 16 }}>
            <Button type={"clear"} size={"small"} title={"MAX"} fontWeight={"bold"} onPress={onPressMax} />
        </View>
    );
};

export default TokenInput;
