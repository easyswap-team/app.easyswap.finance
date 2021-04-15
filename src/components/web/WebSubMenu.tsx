import React, { FC, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Link, useRouteMatch } from "react-router-dom";

import { HEADER_WIDTH, IS_DESKTOP, Spacing, SUB_MENU_HEIGHT, DESKTOP_CONTENT_WIDTH, SCREEN_WIDTH } from "../../constants/dimension";
import useColors from "../../hooks/useColors";
import useStyles from "../../hooks/useStyles";
import useTranslation from "../../hooks/useTranslation";
import FlexView from "../FlexView";
import Text from "../Text";
import { GlobalContext } from "../../context/GlobalContext";

export interface WebSubMenuItem {
    title: string;
    path: string;
}

export interface WebSubMenuProps {
    items: WebSubMenuItem[];
}

export const SwapSubMenu = props => {
    const t = useTranslation();
    return (
        <WebSubMenu
            items={[
                {
                    title: t("new-order"),
                    path: "/swap"
                },
                {
                    title: t("my-orders"),
                    path: "/swap/my-orders"
                }
            ]}
            {...props}
        />
    );
};

export const LiquiditySubMenu = props => {
    const t = useTranslation();
    return (
        <WebSubMenu
            items={[
                {
                    title: t("add-liquidity"),
                    path: "/liquidity"
                },
                {
                    title: t("remove-liquidity"),
                    path: "/liquidity/remove"
                }
            ]}
            {...props}
        />
    );
};

export const MigrateSubMenu = () => {
    const t = useTranslation();
    return (
        <WebSubMenu
            items={[
                {
                    title: t("migrate-liquidity"),
                    path: "/migrate"
                }
            ]}
        />
    );
};

export const StakingSubMenu = () => {
    const t = useTranslation();
    return (
        <WebSubMenu
            items={[
                {
                    title: t("stake"),
                    path: "/staking"
                },
                {
                    title: t("unstake"),
                    path: "/staking/unstake"
                }
            ]}
        />
    );
};

export const FarmingSubMenu = props => {
    const t = useTranslation();
    return (
        <WebSubMenu
            items={[
                {
                    title: t("plant-lp-tokens"),
                    path: "/farming"
                },
                {
                    title: t("harvest-sushi"),
                    path: "/farming/harvest"
                }
            ]}
            {...props}
        />
    );
};

const WebSubMenu: FC<WebSubMenuProps> = props => {
    const { submenu, white, borderDark } = useColors();
    const { border } = useStyles()
    const { darkMode } = useContext(GlobalContext);
    const [bg, setBg] = useState(0)

    const getBgColor = opacity => {
        if(darkMode) {
            return `rgb(31, 33, 39, ${opacity}%)`
        }
        else {
            return `rgb(255, 255, 255, ${opacity}%)`
        }
    }

    useEffect(() => {
        if(props.scrollTop) {
            if(props.scrollTop > 100) {
                setBg(getBgColor(100))
            }
            else if(props.scrollTop < 20) {
                setBg(getBgColor(0))
            }
            else {
                setBg(getBgColor(props.scrollTop))
            }
        }
    }, [props.scrollTop, darkMode])

    return (
        <View 
            style={{
                width: IS_DESKTOP ? 330 : SCREEN_WIDTH - Spacing.large,
                ...border({padding: 5, color: darkMode ? borderDark : '#ccd5df'}),
                alignSelf: 'center',
                marginTop: 20,
                position: 'absolute',
                zIndex: 1,
                background: bg
            }}
        >
            <FlexView
                style={{
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                {props.items.map(item => (
                    <MenuItem key={item.path} {...item} />
                ))}
            </FlexView>
        </View>
    );
};

const MenuItem = ({ title, path }) => {
    const { textMedium, textLight, tokenBg, subMenuItem } = useColors();
    const match = useRouteMatch(path);
    const active = match?.isExact;
    return (
        <Link
            to={path}
            style={{
                width: '50%',
                background: active ? subMenuItem : 'none',
                borderRadius: 8,
                textAlign: 'center',
                paddingTop: 9,
                paddingBottom: 9,
                textDecoration: "none"
            }}>
            <Text
                fontWeight={active ? "regular" : "light"}
                style={{
                    fontSize: 16,
                    color: active ? textMedium : textLight
                }}>
                {title}
            </Text>
        </Link>
    );
};

export default WebSubMenu;
