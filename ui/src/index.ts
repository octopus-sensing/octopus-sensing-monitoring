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

import { Chart, LineController, LinearScale, Title } from 'chart.js'

// To make Charts tree-shakeable, we need to register the components we're using.
Chart.register(LineController, LinearScale, Title)

import { fetchServerData } from './services'
import type { Charts } from './types'

function makeCanvas(id: string, htmlClass: string): string {
    return `
<div class="chart-container">
  <canvas id="${id}" class="${htmlClass}" />
</div>
`
}

function makeChart(id: string, color: string): Chart {
    const canvas = document.getElementById(id) as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('Context of the Canvas is null!')
    }

    return new Chart(ctx, {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                tooltip: { enabled: false },
                legend: { display: false },
            },
        },
        data: {
            labels: [],
            datasets: [
                {
                    label: id,
                    data: [],
                    fill: false,
                    borderColor: color,
                },
            ],
        },
    })
}

async function base64ToBlob(b64: string): Promise<Blob> {
    const url = `data:image/png;base64,${b64}`
    return await (await fetch(url)).blob()
}

async function refreshData(charts: Charts) {
    // TODO: Draw messages in place of the chart when no data was available.

    try {
        const data = await fetchServerData()

        if (data.eeg) {
            const eegData = data.eeg
            charts.eeg.forEach((chart: Chart, idx: number) => {
                if (eegData.length > idx) {
                    updateChart(chart, eegData[idx])
                } else {
                    console.error(
                        `Not enough data! charts: ${charts.eeg.length} data: ${eegData.length}`,
                    )
                }
            })
        }

        if (data.gsr) {
            updateChart(charts.gsr, data.gsr)
        }

        if (data.ppg) {
            updateChart(charts.ppg, data.ppg)
        }

        if (data.webcam) {
            const imageTag = document.getElementById('webcam-image') as HTMLImageElement
            if (imageTag.src != '') {
                URL.revokeObjectURL(imageTag.src)
            }
            base64ToBlob(data.webcam).then((blob) => (imageTag.src = URL.createObjectURL(blob)))
        }
    } catch (error) {
        // TODO: Show a notification or something
        console.error(error)
    }
}

function updateChart(chart: Chart, data: number[]) {
    if (!chart.data.datasets) {
        throw new Error("in updateChart: 'chart.data.datasets' is undefined! Should never happen!")
    }

    chart.data.datasets[0].data = data

    const labels = Array(data.length)
    for (let idx = 0; idx < data.length; idx++) {
        labels[idx] = idx
    }
    chart.data.labels = labels

    // 'none': disables update animation
    chart.update('none')
}

function main() {
    let pageHtml = '<div id="root-container">'
    pageHtml += '<div id="eeg-container">'
    pageHtml += '<div class="title">EEG</div>'

    // TODO: Fix hard-coded 16, and add other charts
    for (let idx = 0; idx < 16; idx++) {
        const id = 'eeg-' + idx
        pageHtml += makeCanvas(id, 'eeg-chart')
    }

    pageHtml += '</div>'

    pageHtml += '<div id="others-container">'

    pageHtml += '<div class="title">GSR</div>'
    pageHtml += makeCanvas('gsr', 'gsr-chart')

    pageHtml += '<div class="title">PPG</div>'
    pageHtml += makeCanvas('ppg', 'ppg-chart')

    pageHtml += '<div class="title">Camera</div>'
    pageHtml += '<img id="webcam-image" src=""></img>'

    pageHtml += '</div>'

    pageHtml += '</div>'

    const rootElement = document.getElementById('root')
    if (!rootElement) {
        throw new Error('Root element is null!')
    }
    rootElement.innerHTML = pageHtml

    const eeg_charts = Array(16)
    for (let idx = 0; idx < 16; idx++) {
        const id = 'eeg-' + idx
        eeg_charts[idx] = makeChart(id, '#44a3d7')
    }

    const gsr_chart = makeChart('gsr', '#44d7a3')
    const ppg_chart = makeChart('ppg', '#d74493')

    const charts: Charts = {
        eeg: eeg_charts,
        gsr: gsr_chart,
        ppg: ppg_chart,
    }

    setInterval(refreshData, 1000, charts)
}

main()
