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

function makeChart(id: string, color: string): Chart {
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
            if (data.webcam) {
                const imageTag = document.getElementById('webcam-image')! as HTMLImageElement
                if (imageTag.src != '') {
                    URL.revokeObjectURL(imageTag.src)
                }
                base64ToBlob(data.webcam).then((blob) => (imageTag.src = URL.createObjectURL(blob)))
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
    for (let idx = 0; idx < data.length; idx++) {
        labels[idx] = idx
    }
    chart.data.labels = labels

    // Disabling update animation
    chart.update({ duration: 0 })
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

    document.getElementById('root')!.innerHTML = pageHtml

    let eeg_charts = Array(16)
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
