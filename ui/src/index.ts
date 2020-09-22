import Chart from 'chart.js'

import { fetchServerData } from './services'
import type { ServerData, Charts } from './types'

function makeCanvas(id: string, htmlClass: string): string {
    return `
<div class="chart-container">
  <canvas id="${id}" class="${htmlClass}" />
</div>
`
}

function makeChart(id: string): Chart {
    const canvas = document.getElementById(id) as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    return new Chart(ctx!, {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            tooltips: { enabled: false },
            legend: { display: false },
        },
        data: {
            labels: [],
            datasets: [
                {
                    label: id,
                    data: [],
                    fill: false,
                    // No curves in the line
                    lineTension: 0,
                    // TODO: Use different colors for different charts (or different channels?)
                    borderColor: '#44a3d7',
                },
            ],
        },
    })
}

function refreshData(charts: Charts) {
    // TODO: Draw messages in place of the chart when no data was available.
    fetchServerData()
        .then((data: ServerData) => {
            if (data.eeg) {
                charts.eeg.forEach((chart: Chart, idx: number) => {
                    if (data.eeg!.length > idx) {
                        updateChart(chart, data.eeg![idx])
                    } else {
                        console.error(
                            `Not enough data! charts: ${charts.eeg.length} data: ${data.eeg!.length
                            }`,
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
        })
        .catch((error) => {
            // TODO: Show a notification or something
            console.error(error)
        })
}

function updateChart(chart: Chart, data: number[]) {
    chart.data.datasets![0].data = data

    let labels = Array(data.length)
    for (let idx = 1; idx <= data.length; idx++) {
        labels[idx] = idx
    }
    chart.data.labels = labels

    // Disabling update animation
    chart.update({ duration: 0 })
}

function main() {
    let pageHtml = '<div id="root-container">'
    pageHtml += '<div id="eeg-container">'

    // TODO: Fix hard-coded 16, and add other charts
    for (let idx = 0; idx < 16; idx++) {
        const id = 'eeg-' + idx
        pageHtml += makeCanvas(id, 'eeg-chart')
    }

    pageHtml += '</div>'

    pageHtml += '<div id="others-container">'
    pageHtml += makeCanvas('gsr', 'gsr-chart')
    pageHtml += makeCanvas('ppg', 'ppg-chart')
    pageHtml += '</div>'

    pageHtml += '</div>'

    document.getElementById('root')!.innerHTML = pageHtml

    let eeg_charts = Array(16)
    for (let idx = 0; idx < 16; idx++) {
        const id = 'eeg-' + idx
        eeg_charts[idx] = makeChart(id)
    }

    const gsr_chart = makeChart('gsr')
    const ppg_chart = makeChart('ppg')

    const charts: Charts = {
        eeg: eeg_charts,
        gsr: gsr_chart,
        ppg: ppg_chart,
    }

    setInterval(refreshData, 1000, charts)
}

main()
