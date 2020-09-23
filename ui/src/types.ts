import Chart from 'chart.js'

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
