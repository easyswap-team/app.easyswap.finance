import React, { useContext } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { Icon } from "react-native-elements";
import { Link, useRouteMatch } from "react-router-dom";

import Modal from "modal-react-native-web";
import { Spacing } from "../../constants/dimension";
import { EthersContext } from "../../context/EthersContext";
import useColors from "../../hooks/useColors";
import useTranslation from "../../hooks/useTranslation";
import DarkModeSwitch from "../DarkModeSwitch";
import FlexView from "../FlexView";
import Text from "../Text";
import {
    MoonIcon,
    SunIcon,
    FarmIcon,
    LiqudityIcon,
    SwapIcon,
    HomeIcon
} from '../svg/Icons'

// tslint:disable-next-line:max-func-body-length
const MobileWebMenu = ({ closeMenu }) => {
    const t = useTranslation();
    const { accent, whiteLight, white } = useColors();
    return (
        <TouchableWithoutFeedback style={{ height: "100%" }} onPress={() => closeMenu()}>
            <View
                style={{
                    height: "100%",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    paddingRight: Spacing.normal,
                    paddingBottom: Spacing.normal,
                    backgroundColor: accent,
                    zIndex: 99999999
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: Spacing.small }}>
                    <Text style={{marginRight: 10, opacity: .5, color: whiteLight}}>Close menu</Text>
                    <CloseButton onPress={closeMenu} />
                </View>
                <View style={{
                    alignItems: "flex-start",
                    borderBottom: '1px solid #ffffff33',
                    borderTop: '1px solid #ffffff33',
                    padding: '30px 0 30px 30px',
                    paddingTop: 30,
                    paddingBottom: 30,
                    paddingLeft: 30,
                    width: '100%'
                }}
                >
                    <View style={{width: '100%', alignItems: 'center'}}>
                        <Status style={{alignSelf: 'center'}} />
                    </View>
                    <View style={{ height: Spacing.large }} />
                    <MobileWebMenuItem title={t("menu.home")} path={"/"} name='home' />
                    <MobileWebMenuItem title={t("menu.swap")} path={"/swap"} name='swap' />
                    <MobileWebMenuItem title={t("menu.liquidity")} path={"/liquidity"} name='liquidity' />
                    <MobileWebMenuItem title={t("menu.farm")} path={"/farming"} name='farm' />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30}}>
                    <DarkModeSwitch color={white} style={{ marginBottom: 4 }} />
                    <Text style={{marginLeft: 10, opacity: .5, color: whiteLight}}>Change mode</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const CloseButton = ({ onPress }) => {
    const { textDark, white } = useColors();
    return <Icon type={"material-community"} name={"close"} color={white} size={32} onPress={onPress} />;
};

const MobileWebMenuItem = ({ title, path, name }) => {
    const { textDark, textLight, white, whiteLight } = useColors();
    const match = useRouteMatch(path);
    const active = match?.path?.startsWith(path);
    const MenuIcon = name === 'home' ? HomeIcon
        : name === 'swap' ? SwapIcon
        : name === 'liquidity' ? LiqudityIcon
        : name === 'farm' ? FarmIcon 
        : null

    return (
        <Link to={path} style={{display: 'flex', alignItems: 'center', textDecoration: "none", marginBottom: Spacing.small, marginTop: Spacing.small }}>
            <MenuIcon opacity={active ? 1 : 0.4} />
            <Text
                style={{
                    fontFamily: "regular",
                    fontSize: 24,
                    color: active ? white : whiteLight,
                    paddingLeft: 15
                }}>
                {title}
            </Text>
        </Link>
    );
};

const Status = () => {
    const t = useTranslation();
    const { textLight, white, green, accent, whiteLight } = useColors();
    const { ethereum, chainId, address, ensName } = useContext(EthersContext);
    const connected = address;
    const title = connected
        ? ensName || address!.substring(0, 6) + "..." + address!.substring(address!.length - 4, address!.length)
        : t("menu.not-connected");
    const color = connected ? green : whiteLight;
    const onPress = () => {
        ethereum?.disconnect?.();
    };
    return (
        <View>
            <FlexView style={{ marginBottom: Spacing.tiny, alignItems: 'center' }}>
                <View style={{ backgroundColor: color, width: 12, height: 12, borderRadius: 12}} />
                <Text style={{ fontSize: 18, color: connected ? white : whiteLight, marginLeft: 8 }}>{title}</Text>
            </FlexView>
            {ethereum?.isWalletConnect && (
                <Text
                    style={{ fontFamily: "regular", fontSize: 15, color: accent, alignSelf: "flex-end" }}
                    onPress={onPress}>
                    Disconnect
                </Text>
            )}
        </View>
    );
};

export default MobileWebMenu;
