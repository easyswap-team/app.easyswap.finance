import { useCallback } from "react";
import { ViewStyle } from "react-native";

import { Spacing } from "../constants/dimension";
import useColors from "./useColors";

const useStyles = () => {
    const { shadow: shadowColor, borderDark } = useColors();
    const border = useCallback(
        (attrs?: { color?: string; radius?: number; padding?: string, borderWidth?: number }) => ({
            borderColor: attrs?.color || borderDark,
            borderWidth: attrs?.borderWidth ? attrs.borderWidth : 1,
            borderRadius: attrs?.radius || 8,
            padding: attrs?.padding ? attrs.padding : Spacing.small
        }),
        []
    );
    
    const shadow = () => ({
        borderRadius: Spacing.tiny,
        elevation: Spacing.small,
        shadowColor,
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        overflow: "visible"
    } as ViewStyle);

    const borderBottom = () => ({borderBottom: `1px solid ${borderDark}`})

    return { border, shadow, borderBottom };
};

export default useStyles;
