import React, { useState, useEffect } from 'react'

const useHelper = () => {
    const [pathTokenAdress, setPathTokenAdress] = useState(null)
    let tokenAdress

    if(window.location.hash) {
        tokenAdress = window.location.hash.split('/?')[1]

        if(tokenAdress) {
            tokenAdress = tokenAdress.split('=')[1]
        }
    }
    

    useEffect(() => {
        setPathTokenAdress(tokenAdress)
    }, [tokenAdress])

    return {
        pathTokenAdress
    }
}

export default useHelper;