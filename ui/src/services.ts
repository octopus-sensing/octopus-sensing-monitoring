import { ServerData } from './types'

export function fetchServerData(): Promise<ServerData> {
    // TODO: Get the URL from the current browser's URL
    return new Promise((resolve, reject) => {
        fetch("http://" + window.location.host + "/api/fetch")
            .then(response => {
                if (!response.ok) {
                    reject("Could not fetch data from the server: " + response.statusText)
                }
                resolve(response.json())
            })
            .catch(error => reject(error))
    })
}
