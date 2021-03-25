import React, { FC, useContext, useEffect } from "react";
import { Platform, SafeAreaView, ScrollView, ViewProps } from "react-native";
import { GlobalContext } from "../context/GlobalContext";

export type ContainerProps = ViewProps;

const Container: FC<ContainerProps> = props => {
    const { scrollTop, setScrollTop } = useContext(GlobalContext);

    return Platform.select({
        web: (
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                style={[
                    {
                        flex: 1
                    },
                    props.style
                ]}
                {...props}
            />
        ),
        default: (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView {...props} />
            </SafeAreaView>
        )
    });
};

export default Container;
