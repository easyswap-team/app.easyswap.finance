/* tslint:disable:ordered-imports */
import "./globals";
import React from "react";

import { Rubik_300Light, Rubik_400Regular, Rubik_500Medium, Rubik_700Bold } from "@expo-google-fonts/rubik";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { ethers } from "ethers";
import { ContextProvider } from "./src/context";
import { Screens } from "./src/screens";
import { YellowBox } from "react-native";
import sushiData from "@sushiswap/sushi-data";
import { default as network } from './web/network.json';

if (__DEV__) {
    YellowBox.ignoreWarnings(["Setting a timer", "VirtualizedLists should never be nested"]);
}

const App = () => {
    if(window.ethereum) {
        // change SubGraph and AlchemyAPI url depending on network id
        ethereum.request({ method: "eth_chainId" }).then(res => {
            let chainId = Number(res)
            const alchemyUrl = network[chainId].alchemyUrl

            // change alchemy
            ethers.providers.AlchemyProvider.getUrl = () => {
                return {
                    url: (alchemyUrl),
                    throttleCallback: function (attempt, url) {
                        if (apiKey === defaultApiKey) {
                            formatter.showThrottleMessage();
                        }
                        return Promise.resolve(true);
                    }
                };
            }

            let alchemyProvider = new ethers.providers.AlchemyProvider(
                1,
                __DEV__ ? process.env.MAINNET_API_KEY : "Em65gXMcaJl7JF9ZxcMwa4r5TcrU8wZV"
            )

            let kovanProvider = new ethers.providers.AlchemyProvider(
                42,
                __DEV__ ? process.env.KOVAN_API_KEY : "MOX3sLJxKwltJjW6XZ8aBtDpenq-18St"
            )

            if(!global.ALCHEMY_PROVIDER) {
                global.ALCHEMY_PROVIDER = alchemyProvider
            }
            if(!global.KOVAN_PROVIDER) {
                global.KOVAN_PROVIDER = kovanProvider
            }
        }).catch(err => {
            console.log('err', err)
        })
    }

    const [fontsLoaded] = useFonts({
        light: Rubik_300Light,
        regular: Rubik_400Regular,
        medium: Rubik_500Medium,
        bold: Rubik_700Bold
    });

    if (!fontsLoaded && !global.ALCHEMY_PROVIDER) {
        return <AppLoading />;
    }
    
    return (
        <ContextProvider>
            <Screens />
        </ContextProvider>
    );
};

export default App;
