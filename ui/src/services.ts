/* This file is part of Octopus Sensing Monitoring <https://octopus-sensing.nastaran-saffar.me/>
 * Copyright © 2020, 2021 Aidin Gharibnavaz <aidin@aidinhut.com>
 *
 * Octopus Sensing Monitoring is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * Octopus Sensing Monitoring is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with Octopus Sensing
 * Monitoring. If not, see <https://www.gnu.org/licenses/>.
 */

import { ServerData } from './types'

export async function fetchServerData(): Promise<ServerData> {
    const response = await fetch('http://' + window.location.host + '/api/fetch')

    if (!response.ok) {
        return Promise.reject('Could not fetch data from the server: ' + response.statusText)
    }

    return response.json()
}
