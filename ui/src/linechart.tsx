import React, { useRef, useEffect, useState } from 'react'
import Chart from 'chart.js'
import styled from 'styled-components'

const StyledCanvasContainer = styled.div`
  height: 5vh;
`

type Props = {
    name: string
    series: number[]
}

function LineChart({ name, series }: Props) {
    const [chartRef, setChartRef] = useState<Chart | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // TODO: useLayoutEffect instead of useEffect?
    useEffect(() => {
        if (!canvasRef.current) {
            return
        }
        const ctx = canvasRef.current.getContext("2d")

        if (chartRef) {
            chartRef.destroy()
        }

        console.log('series:')
        console.log(series)

        setChartRef(new Chart(ctx!, {
            type: 'line',
            options: {
                responsive: true,
            },
            data: {
                datasets: [
                    {
                        label: name,
                        data: series,
                    }
                ]
            }
        }))
    }, [name, series, chartRef])

    return (
        <StyledCanvasContainer>
            <canvas id={name + 'canvas'} ref={canvasRef} />
        </StyledCanvasContainer>
    )
}

export default LineChart
