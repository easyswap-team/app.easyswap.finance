import React, { PropsWithChildren, useContext } from "react";
import { View, ViewProps } from "react-native";

import { Spacing } from "../constants/dimension";
import { GlobalContext } from "../context/GlobalContext";
import useColors from "../hooks/useColors";
import useStyles from "../hooks/useStyles";

const InfoBox = (props: PropsWithChildren<ViewProps>) => {
    const { darkMode } = useContext(GlobalContext);
    const { backgroundLight, borderDark, tokenBg } = useColors();
    const { border } = useStyles();
    return (
        <View
            {...props}
            style={[
                {
                    ...border({ color: darkMode ? borderDark : backgroundLight }),
                    backgroundColor: tokenBg,
                    padding: Spacing.small
                },
                props.style
            ]}
        />
    );
};

export default InfoBox;
