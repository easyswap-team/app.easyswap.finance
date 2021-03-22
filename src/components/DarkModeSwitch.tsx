import React, { useContext } from "react";
import { TouchableHighlight, View } from "react-native";

import { GlobalContext } from "../context/GlobalContext";
import useColors from "../hooks/useColors";
import {MoonIcon, SunIcon} from "./svg/Icons";

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
                    <MoonIcon width={24} height={24} style={{ margin: 3 }} />
                ) : (
                    <SunIcon width={30} height={30} />
                )}
            </TouchableHighlight>
        </View>
    );
};

export default DarkModeSwitch;
