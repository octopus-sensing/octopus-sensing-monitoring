import { ServerData } from './types'

export async function fetchServerData(): Promise<ServerData> {
    const response = await fetch('http://' + window.location.host + '/api/fetch')

    if (!response.ok) {
        return Promise.reject('Could not fetch data from the server: ' + response.statusText)
    }

    return response.json()
}
