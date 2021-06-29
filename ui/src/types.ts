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

import { Chart } from 'chart.js'

export type ServerData = {
    eeg?: number[][]
    gsr?: number[]
    ppg?: number[]
    webcam?: string
}

export type Charts = {
    eeg: Chart[]
    gsr: Chart
    ppg: Chart
}
