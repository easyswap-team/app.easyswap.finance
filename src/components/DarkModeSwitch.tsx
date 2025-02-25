import React, { useContext } from "react";
import { TouchableHighlight, View } from "react-native";

import { GlobalContext } from "../context/GlobalContext";
import useColors from "../hooks/useColors";
import SvgMoon from "./svg/SvgMoon";
import SvgSun from "./svg/SvgSun";

const DarkModeSwitch = props => {
    const { darkMode, setDarkMode } = useContext(GlobalContext);
    const { overlay } = useColors();
    const onPress = async () => {
        await setDarkMode(!darkMode);
    };
    return (
        <View style={props.style}>
            <TouchableHighlight activeOpacity={0.7} underlayColor={overlay} onPress={onPress}>
                {darkMode ? (
                    <SvgMoon style={{ margin: 3 }} />
                ) : (
                    <SvgSun color={props.color} />
                )}
            </TouchableHighlight>
        </View>
    );
};

export default DarkModeSwitch;