import React, { useContext } from "react";
import { Image, View } from "react-native";

import WalletConnectProvider from "@walletconnect/web3-provider";
import { IS_DESKTOP, Spacing } from "../../constants/dimension";
import { EthersContext } from "../../context/EthersContext";
import { GlobalContext } from "../../context/GlobalContext";
import useColors from "../../hooks/useColors";
import useStyles from "../../hooks/useStyles";
import useTranslation from "../../hooks/useTranslation";
import Button from "../Button";
import WebFooter from "./WebFooter";
import { default as network } from '../../../web/network.json';

const ConnectWallet = () => {
    const { darkMode } = useContext(GlobalContext);
    const { shadow } = useStyles();
    const metaMask = window.ethereum?.isMetaMask || false;
    const source = darkMode ? require("../../../assets/metamask-dark.png") : require("../../../assets/metamask.png")
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    background: darkMode ? '#1F2127' : '#fff',
                    width: '90%',
                    maxWidth: '400px',
                    maxHeight: '400px',
                    marginTop: 100,
                    paddingTop: 20,
                    paddingBottom: 20,
                    flex: '1 0 100%',
                    borderRadius: 12,
                    ...shadow()
                }}>
                <Image
                    source={source}
                    style={{ width: 148, height: 143, marginBottom: Spacing.normal }}
                />
                {window.ethereum && <ConnectButton />}
                <WalletConnectButton />
            </View>
            <WebFooter simple={true} />
        </View>
    );
};

const ConnectButton = () => {
    const t = useTranslation();
    const { primary } = useColors();
    const { setEthereum } = useContext(EthersContext);
    const onPress = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            setEthereum(window.ethereum);
        } else {
            alert(t("no-ethereum-provider-found"));
        }
    };
    const metaMask = window.ethereum?.isMetaMask || false;
    return (
        <Button
            size={"large"}
            color={primary}
            onPress={onPress}
            title={metaMask ? "MetaMask" : t("connect")}
            containerStyle={{ width: IS_DESKTOP ? 400 : "100%" }}
            style={{
                marginTop: Spacing.small, 
                marginHorizontal: Spacing.normal,
                borderRadius: '8px'
            }}
        />
    );
};

const WalletConnectButton = () => {
    const { darkMode } = useContext(GlobalContext);
    const { primary } = useColors();
    const { setEthereum, chainId } = useContext(EthersContext);

    const onPress = async () => {
        const rpc = {
            [chainId]: network[chainId].alchemyUrl
        }
        const ethereum = new WalletConnectProvider({rpc});
        await ethereum.enable();
        // @ts-ignore
        setEthereum(ethereum);
    };
    return (
        <Button
            size={"large"}
            type={"outline"}
            color={primary}
            onPress={onPress}
            title={"WalletConnect"}
            containerStyle={{ width: IS_DESKTOP ? 400 : "100%" }}
            style={{
                marginTop: Spacing.small,
                marginHorizontal: Spacing.normal,
                borderRadius: '8px'
            }}
        />
    );
};

export default ConnectWallet;
