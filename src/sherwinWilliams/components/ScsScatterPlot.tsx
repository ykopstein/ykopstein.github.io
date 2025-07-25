import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { type AxisMetatadata } from '../api/types';
import { getColorMetadata } from '../api/colorMetadata';

interface ScsScatterPlotProps {
    colors: { code: string, displayHex: string }[];
    xAxis: AxisMetatadata | undefined;
    yAxis: AxisMetatadata | undefined;
}

function ScsScatterPlot({ colors, xAxis, yAxis }: ScsScatterPlotProps) {
    const [options, setOptions] = useState<Highcharts.Options | undefined>();

    useEffect(() => {
        if (!xAxis || !yAxis) {
            setOptions(undefined);
            return;
        }

        (async () => {
            const points: Highcharts.PointOptionsObject[] = [];
            for (const color of colors) {
                const metadata = await getColorMetadata(color.code);
                if (!metadata) throw new Error(`No metadata found for color code: ${color}`);

                points.push({
                    name: metadata.name,
                    color: `#${metadata.hex}`,
                    x: xAxis.accessor(metadata),
                    y: yAxis.accessor(metadata),
                    marker: { fillColor: color.displayHex, symbol: 'circle', radius: 6 }
                });
            }

            setOptions({
                chart: { type: 'scatter', zooming: { type: 'xy' } },
                title: { text: 'Color Scatter Plot' },
                xAxis: { title: { text: xAxis.metricName } },
                yAxis: { title: { text: yAxis.metricName } },
                series: [{
                    type: 'scatter',
                    data: points,
                    tooltip: {
                        pointFormat: '<b>{point.name}</b><br>X: {point.x}<br>Y: {point.y}'
                    }
                }]
            });
        })();
    }, [colors, xAxis, yAxis]);

    return (<>
        {!!options ?
            <HighchartsReact highcharts={Highcharts} options={options} /> :
            <p>Loading data...</p>}
    </>);
}

export default ScsScatterPlot;
