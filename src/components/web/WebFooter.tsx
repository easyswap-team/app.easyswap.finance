/* eslint-disable react/prop-types */
import React from "react";
import { Image, TouchableHighlight, View } from "react-native";
import { useHistory, useLocation } from "react-router-dom";

import Constants from "expo-constants";

import { Spacing } from "../../constants/dimension";
import useLinker from "../../hooks/useLinker";
import FlexView from "../FlexView";
import SocialIcons from "../SocialIcons";
import Text from "../Text";

const FLAGS = {
    us: require("../../../assets/flags/us.svg"),
    kr: require("../../../assets/flags/kr.svg"),
    fr: require("../../../assets/flags/fr.svg"),
    es: require("../../../assets/flags/es.svg"),
    jp: require("../../../assets/flags/jp.svg")
};

const ALCHEMY_URL = "https://dashboard.alchemyapi.io/signup?referral=429fb682-0d85-40ab-ad88-daf847cf7c63";

const WebFooter = ({ simple = true }) => {
    const onPressAlchemy = useLinker(ALCHEMY_URL, "", "_blank");
    return (
        <View style={{ width: "100%", padding: Spacing.normal, alignItems: "center" }}>
            {simple && (
                <>
                    <SocialIcons />
                    {/* <TouchableHighlight onPress={onPressAlchemy}>
                        <Image
                            source={require("../../../assets/alchemy.png")}
                            style={{ width: 188, height: 40, marginTop: Spacing.tiny }}
                        />
                    </TouchableHighlight> */}
                </>
            )}
            <Text note={true} style={{ marginTop: Spacing.normal, fontSize: 16 }}>
                Easyswap © 2021 {/** Constants.manifest.version **/}
            </Text>
            <FlexView style={{ marginTop: Spacing.normal }}>
                <Flag name={"us"} locale={"en"} />
                <Flag name={"es"} locale={"es"} />
                <Flag name={"fr"} locale={"fr"} />
                <Flag name={"jp"} locale={"jp"} />
                <Flag name={"kr"} locale={"ko"} />
            </FlexView>
        </View>
    );
};

const Flag = ({ name, locale }) => {
    const history = useHistory();
    const location = useLocation();
    const onPress = () => {
        history.push(location.pathname + "?locale=" + locale);
    };
    return (
        <TouchableHighlight onPress={onPress} style={{ marginHorizontal: 10 }}>
            <Image source={FLAGS[name]} style={{ width: 30, height: 20 }} />
        </TouchableHighlight>
    );
};

export default WebFooter;
