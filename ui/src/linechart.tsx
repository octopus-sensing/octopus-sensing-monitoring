import React from 'react'
import ReactApexChart from 'react-apexcharts'

type Props = {
    name: string
    series: number[]
}

function LineChart({ name, series }: Props) {

    const chartSeries = [{
        name: name,
        data: series,
    }]

    const options = {
        chart: {
            height: 100,
            type: 'line',
            animations: { enabled: false },
            toolbar: { show: false },
            zoom: { enabled: false },
            tooltip: { enabled: false },
        },
        stroke: {
            width: 3,
            curve: 'smooth',
        },
    }

    return (
        <ReactApexChart series={chartSeries} options={options} type='line' height={200} />
    )
}

export default LineChart
