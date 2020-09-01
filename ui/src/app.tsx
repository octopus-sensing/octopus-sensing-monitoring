import React from 'react'
import { useState, useEffect } from 'react'
import styled from 'styled-components'

import { ServerData } from './types'
import { fetchServerData } from './services'
import LineChart from './linechart'

const AppContainer = styled.div`
    padding-top: 1em;
`

function App() {
    const [serverData, setServerData]: [ServerData, (arg0: ServerData) => void] = useState({})

    useEffect(() => {
        const interval = setInterval(refreshData, 1000)
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
            {serverData.eeg ?
                serverData.eeg.map((data, i) => <LineChart key={i} name={'channel ' + i} series={data} />)
                : <p>No data...</p>}
        </AppContainer>
    );
}

export default App;
