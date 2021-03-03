global.Buffer = require('buffer').Buffer;
const network = require('./web/network.json')

// change Alchemy url depending on network id
ethereum.request({ method: "eth_chainId" }).then(res => {
    let chainId = Number(res)
    const alchemyUrl = network[chainId].alchemyUrl

    global.ethers = require('ethers');
    global.ethers.providers.AlchemyProvider.getUrl = () => {
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

    global.ALCHEMY_PROVIDER = new ethers.providers.AlchemyProvider(
        1,
        __DEV__ ? process.env.MAINNET_API_KEY : "Em65gXMcaJl7JF9ZxcMwa4r5TcrU8wZV"
    );
    global.KOVAN_PROVIDER = new ethers.providers.AlchemyProvider(
        42,
        __DEV__ ? process.env.KOVAN_API_KEY : "MOX3sLJxKwltJjW6XZ8aBtDpenq-18St"
    );
}).catch(err => {
	console.log('err', err)
})