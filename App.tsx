/* tslint:disable:ordered-imports */
import "./globals";
import React from "react";

import { OpenSans_300Light, OpenSans_400Regular, OpenSans_600SemiBold } from "@expo-google-fonts/open-sans";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { ContextProvider } from "./src/context";
import { Screens } from "./src/screens";
import { YellowBox } from "react-native";
import sushiData from "@sushiswap/sushi-data";
import { default as network } from './web/network.json';

// change SubGraph url depending on network id
ethereum.request({ method: "eth_chainId" }).then(res => {
    let chainId = Number(res)
    sushiData.graphAPIEndpoints.exchange = network[chainId].subGraphExchangeUrl
}).catch(err => {
	console.log('err', err)
})

if (__DEV__) {
    YellowBox.ignoreWarnings(["Setting a timer", "VirtualizedLists should never be nested"]);
}

const App = () => {
    const [fontsLoaded] = useFonts({
        light: OpenSans_300Light,
        regular: OpenSans_400Regular,
        bold: OpenSans_600SemiBold
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    }
    return (
        <ContextProvider>
            <Screens />
        </ContextProvider>
    );
};

export default App;
