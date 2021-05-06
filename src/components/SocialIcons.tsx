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
    const { background, textLight, white } = useColors();
    const onPressTwitter = useLinker("https://twitter.com/EasyswapFinance", "", "_blank");
    const onPressGithub = useLinker("https://github.com/easyswap-team", "", "_blank");
    const onPressTelegram = useLinker("https://t.me/easyswapFinance", "", "_blank");
    const onPressM = useLinker("https://medium.com/@EasyswapFinance", "", "_blank");
    return (
        <FlexView style={{ width: "300px", justifyContent: "space-around"}}>
            <GithubIconLight color={darkMode ? white : '#4373EE'} onPress={onPressGithub} />
            <TwitterIconLight color={darkMode ? white : '#4373EE'} onPress={onPressTwitter} />
            <TelegramIconLight color={darkMode ? white : '#4373EE'} onPress={onPressTelegram} />
            <MIconLight color={darkMode ? white : '#4373EE'} onPress={onPressM} />
        </FlexView>
    );
};

export default SocialIcons;
