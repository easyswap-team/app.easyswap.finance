import React, { FC, useContext } from "react";
import { Button as NativeButton, ButtonProps as NativeButtonProps } from "react-native-elements";

import { Spacing } from "../constants/dimension";
import useColors from "../hooks/useColors";
import { GlobalContext } from "../context/GlobalContext";

484848

export interface ButtonProps extends NativeButtonProps {
    color?: string;
    size?: "small" | "normal" | "large";
    fontWeight?: "light" | "regular" | "bold";
}

// tslint:disable-next-line:max-func-body-length
const Button: FC<ButtonProps> = props => {
    const { accent, textMedium, placeholder, backgroundLight } = useColors();
    const { darkMode } = useContext(GlobalContext);
    const type = props.type || "solid";
    const size = props.size || "normal";
    const height = props.size === "small" ? 36 : size === "normal" ? 45 : 54;
    const fontSize = props.size === "small" ? 13 : size === "normal" ? 15 : 18;
    const fontFamily = props.fontWeight || "regular";
    const color = type === "solid" ? "white" : props.color || textMedium;
    const disabledBg = darkMode ? '#484848' : '#bbb'
    return (
        <NativeButton
            {...props}
            disabled={props.loading || props.disabled}
            onPress={props.loading ? undefined : props.onPress}
            type={type}
            loadingProps={{ color: textMedium }}
            buttonStyle={[
                {
                    height,
                    paddingHorizontal: Spacing.small,
                    backgroundColor: "transparent",
                    borderColor: color
                },
                props.buttonStyle
            ]}
            titleStyle={[{ fontSize, fontFamily, color }, props.titleStyle]}
            disabledTitleStyle={[{ fontSize, fontFamily, color: '#fff' }, props.titleStyle]}
            style={[{ backgroundColor: type === "solid" ? props.color || accent : "transparent", borderRadius: 8 }, props.style]}
            disabledStyle={[
                { backgroundColor: type === "solid" ? disabledBg : "transparent", borderRadius: 8 },
                props.disabledStyle
            ]}
        />
    );
};
export default Button;
