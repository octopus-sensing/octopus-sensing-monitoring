import Chart from 'chart.js'

import { fetchServerData } from './services'
import type { ServerData } from './types'

function makeCanvas(id: string) {
    return `
<div class="chart-container">
  <canvas id="${id}" />
</div>
`
}

function makeChart(id: string) {
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

function refreshData(charts: Chart[]) {
    fetchServerData()
        .then((data: ServerData) => {
            if (data.eeg) {
                charts.forEach((chart: Chart, idx: number) => {
                    if (data.eeg!.length > idx) {
                        updateChart(chart, data.eeg![idx])
                    } else {
                        console.error(
                            `Not enough data! charts: ${charts.length} data: ${data.eeg!.length}`,
                        )
                    }
                })
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
    let pageHtml = ''
    // TODO: Fix hard-coded 16, and add other charts
    for (let idx = 0; idx < 16; idx++) {
        const id = 'channel-' + idx
        pageHtml += makeCanvas(id)
    }

    document.getElementById('root')!.innerHTML = pageHtml

    let charts = Array(16)
    for (let idx = 0; idx < 16; idx++) {
        const id = 'channel-' + idx
        charts[idx] = makeChart(id)
    }

    setInterval(refreshData, 1000, charts)
}

main()
