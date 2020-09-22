import Chart from 'chart.js'

export type ServerData = {
    eeg?: number[][]
    gsr?: any
    ppg?: any
    camera?: any
}

export type Charts = {
    eeg: Chart[]
    gsr: Chart
    ppg: Chart
}
