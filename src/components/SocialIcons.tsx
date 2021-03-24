import React, { useContext } from "react";
import {
    TwitterIconLight,
    TelegramIconLight,
    GithubIconLight,
    TwitterIconDark,
    TelegramIconDark,
    GithubIconDark
} from './svg/Icons'

import { GlobalContext } from "../context/GlobalContext";
import useColors from "../hooks/useColors";
import useLinker from "../hooks/useLinker";
import FlexView from "./FlexView";

const SocialIcons = () => {
    const { darkMode } = useContext(GlobalContext);
    const { background, textLight } = useColors();
    const onPressTwitter = useLinker("https://twitter.com/sushiswap", "", "_blank");
    const onPressGithub = useLinker("https://github.com/sushiswap", "", "_blank");
    const onPressDiscord = useLinker("https://discord.gg/YS8xH7E", "", "_blank");
    const GithubIcon = darkMode ? GithubIconDark : GithubIconLight
    const TwitterIcon = darkMode ? TwitterIconDark : TwitterIconLight
    const TelegramIcon = darkMode ? TelegramIconDark : TelegramIconLight
    return (
        <FlexView style={{ width: "200px", justifyContent: "space-around", marginTop: 30 }}>
            <GithubIcon onPress={onPressGithub} />
            <TwitterIcon onPress={onPressTwitter} />
            <TelegramIcon onPress={onPressDiscord} />
        </FlexView>
    );
};

export default SocialIcons;
