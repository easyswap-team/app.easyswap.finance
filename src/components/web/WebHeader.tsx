import React, { FC, useContext } from "react";
import { TouchableHighlight, View } from "react-native";
import { Icon } from "react-native-elements";
import { Link, useRouteMatch } from "react-router-dom";

import { HEADER_HEIGHT, HEADER_WIDTH, IS_DESKTOP, Spacing } from "../../constants/dimension";
import { EthersContext } from "../../context/EthersContext";
import { GlobalContext } from "../../context/GlobalContext";
import useColors from "../../hooks/useColors";
import useTranslation from "../../hooks/useTranslation";
import DarkModeSwitch from "../DarkModeSwitch";
import FlexView from "../FlexView";
import SvgLogoDark from "../svg/SvgLogoDark";
import SvgLogoLight from "../svg/SvgLogoLight";
import { IconMenu, IconMenuDark } from "../svg/Icons"
import Text from "../Text";

export interface WebHeaderProps {
    onExpandMenu?: () => void;
}

const WebHeader: FC<WebHeaderProps> = props => {
    const { header, borderDark } = useColors();
    return (
        <View
            // @ts-ignore
            style={{
                position: "fixed",
                top: 0,
                zIndex: 100,
                width: "100%",
                height: HEADER_HEIGHT,
                paddingBottom: Spacing.small,
                backgroundColor: header,
                borderBottomWidth: 1,
                borderColor: borderDark
            }}
        >
            <FlexView
                style={{
                    flex: 1,
                    width: IS_DESKTOP ? HEADER_WIDTH : "100%",
                    alignSelf: "center",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: Spacing.small,
                    paddingHorizontal: Spacing.normal
                }}>
                <Title />
                {IS_DESKTOP ? <Menu /> : <MenuIcon openMenu={props.openMenu} />}
            </FlexView>
        </View>
    );
};

export const Title = () => {
    const { darkMode } = useContext(GlobalContext);
    const SvgLogo = darkMode ? SvgLogoDark : SvgLogoLight;
    return (
        <View style={{ alignSelf: "center", width: 215 }}>
            <Link to={"/"} style={{ textDecoration: "none" }}>
                <SvgLogo width={127} height={28} style={{ marginTop: 8 }} />
            </Link>
        </View>
    );
};

const Menu = () => {
    const t = useTranslation();
    return (
        <>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MenuItem title={t("menu.home")} path={"/"} />
                <MenuItem title={t("menu.swap")} path={"/swap"} />
                <MenuItem title={t("menu.liquidity")} path={"/liquidity"} />
                <MenuItem title={t("menu.farm")} path={"/farming"} />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Status />
                <DarkModeSwitch style={{ marginLeft: Spacing.small }} />
            </View>
        </>
    );
};

const MenuItem = ({ title, path }) => {
    const { textDark, textLight } = useColors();
    const match = useRouteMatch(path);
    const active = (path === "/" ? match?.isExact : true) && match?.path?.startsWith(path);
    return (
        <Link to={path} style={{ marginLeft: 4, marginRight: 4, marginBottom: -4, textDecoration: "none" }}>
            <Text
                style={{
                    fontFamily: "regular",
                    fontSize: 18,
                    color: active ? textDark : textLight,
                    padding: 3
                }}>
                {title}
            </Text>
        </Link>
    );
};

const MenuIcon = ({ openMenu }) => {
    const { textDark } = useColors();
    const { darkMode } = useContext(GlobalContext);
    const MenuBtn = darkMode ? IconMenuDark : IconMenu;
    return <MenuBtn width={24} height={10} style={{ alignSelf: 'center' }} color={textDark} onClick={openMenu} />;
};

const Status = () => {
    const t = useTranslation();
    const { textLight, green, borderDark } = useColors();
    const { ethereum, chainId, address, ensName } = useContext(EthersContext);
    const title = !!address
        ? ensName || address!.substring(0, 6) + "..." + address!.substring(address!.length - 4, address!.length)
        : t("menu.not-connected");
    const color = address ? green : textLight;
    const onPress = () => {
        if (confirm(t("do-you-want-to-disconnect"))) ethereum?.disconnect?.();
    };
    return (
        <TouchableHighlight onPress={onPress} disabled={!ethereum?.isWalletConnect}>
            <FlexView
                style={{
                    height: 28,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: Spacing.small,
                    paddingHorizontal: 19,
                    paddingTop: 19,
                    paddingBottom: 19,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: borderDark
                }}>
                <View style={{ backgroundColor: color, width: 12, height: 12, borderRadius: 12, marginRight: 12 }} />
                <Text style={{ fontSize: 15, color: textLight, marginRight: 2 }}>{title}</Text>
                {ethereum?.isWalletConnect && <CloseIcon />}
            </FlexView>
        </TouchableHighlight>
    );
};

const CloseIcon = () => {
    const { textLight } = useColors();
    return (
        <Icon
            type={"material-community"}
            name={"close"}
            size={15}
            color={textLight}
            style={{ paddingLeft: 2, paddingTop: 2 }}
        />
    );
};

export default WebHeader;
