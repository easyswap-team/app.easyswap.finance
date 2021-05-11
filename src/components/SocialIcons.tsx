import React, { useContext } from "react";
import {
    TwitterIconLight,
    TelegramIconLight,
    GithubIconLight,
    MIconLight
} from './svg/Icons'

import { GlobalContext } from "../context/GlobalContext";
import useColors from "../hooks/useColors";
import useLinker from "../hooks/useLinker";
import FlexView from "./FlexView";

const SocialIcons = () => {
    const { darkMode } = useContext(GlobalContext);
    const { white } = useColors();
    return (
        <FlexView style={{ width: "300px", justifyContent: "space-around"}}>
            <a target='_blank' href='https://github.com/easyswap-team'><GithubIconLight color={darkMode ? white : '#4373EE'} /></a>
            <a target='_blank' href='https://twitter.com/EasyswapFinance'><TwitterIconLight color={darkMode ? white : '#4373EE'} /></a>
            <a target='_blank' href='https://t.me/easyswapFinance'><TelegramIconLight color={darkMode ? white : '#4373EE'} /></a>
            <a target='_blank' href='https://medium.com/@EasyswapFinance'><MIconLight color={darkMode ? white : '#4373EE'} /></a>
        </FlexView>
    );
};

export default SocialIcons;
