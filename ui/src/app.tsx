import React from 'react'
import { useState, useEffect } from 'react'
import styled from 'styled-components'

import { ServerData } from './types'
import { fetchServerData } from './services'

const AppContainer = styled.div`
    padding-top: 1em;
`

function App() {
    const [serverData, setServerData]: [ServerData, (arg0: ServerData) => void] = useState({})

    useEffect(() => {
        const interval = setInterval(refreshData, 500)
        return () => clearInterval(interval)
    }, []) // Runs only on mount

    function refreshData() {
        fetchServerData()
            .then(data => setServerData(data))
            .catch(error => {
                // TODO: Show a notification or something
                console.log(error)
                setServerData({})
            })
    }

    return (
        <AppContainer>
            <p>{serverData.eeg ? serverData.eeg : "connecting..."}</p>
        </AppContainer>
    );
}

export default App;
