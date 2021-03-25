import React, { FC } from "react";
import { View } from "react-native";
import { Link, useRouteMatch } from "react-router-dom";

import { HEADER_WIDTH, IS_DESKTOP, Spacing, SUB_MENU_HEIGHT, DESKTOP_CONTENT_WIDTH, SCREEN_WIDTH } from "../../constants/dimension";
import useColors from "../../hooks/useColors";
import useStyles from "../../hooks/useStyles";
import useTranslation from "../../hooks/useTranslation";
import FlexView from "../FlexView";
import Text from "../Text";

export interface WebSubMenuItem {
    title: string;
    path: string;
}

export interface WebSubMenuProps {
    items: WebSubMenuItem[];
}

export const SwapSubMenu = () => {
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
        />
    );
};

export const LiquiditySubMenu = () => {
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

export const FarmingSubMenu = () => {
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
        />
    );
};

const WebSubMenu: FC<WebSubMenuProps> = props => {
    const { submenu } = useColors();
    const { border } = useStyles()
    return (
        <View
            style={{
                width: IS_DESKTOP ? DESKTOP_CONTENT_WIDTH : SCREEN_WIDTH - Spacing.large,
                ...border({padding: 'tiny'}),
                alignSelf: 'center',
                marginLeft: -15,
                marginTop: 30
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
    const { textMedium, textLight, tokenBg } = useColors();
    const match = useRouteMatch(path);
    const active = match?.isExact;
    return (
        <Link
            to={path}
            style={{
                width: '50%',
                background: active ? tokenBg : 'none',
                borderRadius: 8,
                textAlign: 'center',
                paddingTop: Spacing.small,
                paddingBottom: Spacing.small,
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
