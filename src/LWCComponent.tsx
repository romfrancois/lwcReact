import { useContext, useEffect, useRef, useState } from 'react';
import './App.css';

import { AreaStyleOptions, createChart, DeepPartial, IChartApi, ISeriesApi, SeriesOptionsCommon, SeriesType } from 'lightweight-charts';
import { LWCContext } from './App';
import { additionalTimeValueData, ohlcData, additionalTimeValueOHLC } from './chartData';


const LWComponent = () => {
	const chartContainerRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const chartOptionsRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const { dispatch } = useContext(LWCContext);

    const {
        state: {
            action,
			data,
			seriesType,
			seriesOptions,
        },
    } = useContext(LWCContext);

	const [chart, setChart] = useState<IChartApi>();
	const [series, setSeries] = useState<Array<ISeriesApi<SeriesType>>>([]);
	const [intervalRefresh, setIntervalRefresh] = useState({} as NodeJS.Timer);

	const createAndAppendOptions = (options: any) => {
		const textarea = document.createElement("textarea");
		textarea.cols = 50;
		textarea.rows = 15;
		textarea.setAttribute('class', 'textarea');
		textarea.value = JSON.stringify(JSON.parse(JSON.stringify(options)), undefined, 4);
		chartOptionsRef.current.appendChild(textarea);
	};

	const constructNewDay = (num: string) => {
		if (num.length < 2) {
			return "0" + num;
		}
		if (num[0] === '1' || num[0] === '2') {
			return num;
		}

		return;
	}

	const newRandomValue = () => {
		const max = 10;
		const min = -10;
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	useEffect(() => {
		if (chartContainerRef.current !== undefined && action === 'createChart') {
			const chart = createChart(chartContainerRef.current, {
				width: chartContainerRef.current.clientWidth || 400,
				height: 300,
				rightPriceScale: {
					visible: true
				},
			});

			switch(seriesType) {
				// "topColor": "rgba( 46, 0, 135, 0.4)"
				case 'Area':
					const options = seriesOptions as DeepPartial<AreaStyleOptions & SeriesOptionsCommon>
					const areaSeries = chart.addAreaSeries(options);
					areaSeries.setData(data);

					createAndAppendOptions(areaSeries.options());
					setSeries([...series, areaSeries]);

					break;

				case 'Bar':
					const barSeries = chart.addBarSeries();
					barSeries.setData(ohlcData);

					createAndAppendOptions(barSeries.options());
					setSeries([...series, barSeries]);

					break;

				case 'Baseline': 
					const baselineSeries = chart.addBaselineSeries();
					baselineSeries.setData(data);

					createAndAppendOptions(baselineSeries.options());
					setSeries([...series, baselineSeries]);

					break;

				case 'Candlestick': 
					const candlestickSeries = chart.addCandlestickSeries();
					candlestickSeries.setData(ohlcData);

					createAndAppendOptions(candlestickSeries.options());
					setSeries([...series, candlestickSeries]);

					break;

				case 'Histogram': 
					const histogramSeries = chart.addHistogramSeries();
					histogramSeries.setData(data);

					createAndAppendOptions(histogramSeries.options());
					setSeries([...series, histogramSeries]);

					break;

				case 'Line': 
					const lineSeries = chart.addLineSeries();
					lineSeries.setData(data);

					createAndAppendOptions(lineSeries.options());
					setSeries([...series, lineSeries]);

					break;

				default: break;
			}

			setChart(chart);
		}

		dispatch({ type: 'actionTreated' });
	}, [dispatch, action, data, seriesType, seriesOptions, series]);

	useEffect(() => {
		if (chartContainerRef.current !== undefined && action === 'addBlockOfData') {
			series.forEach((serie) => {
				if (serie.seriesType() === 'Candlestick' || serie.seriesType() === 'Bar') {
					serie.setData([
						...ohlcData,
						additionalTimeValueOHLC[0]
					]);
		
					additionalTimeValueOHLC.forEach((additionalData) => serie.update(additionalData));
				} else {
					serie.setData([
						...data,
						additionalTimeValueData[0]
					]);

					additionalTimeValueData.forEach((additionalData) => serie.update(additionalData));
				}
			});
		}

		if (chartContainerRef.current !== undefined && action === 'startUpdateChart') {
			let counter = 1;
			const interval = setInterval(function(){
				series.forEach((serie) => {
					const newDay = constructNewDay(`${counter}`);
					const newValue = newRandomValue();

					if (newDay !== undefined) {
						if (serie.seriesType() === 'Candlestick' || serie.seriesType() === 'Bar') {
							try {
								serie.update({ time: `2019-01-${newDay}`, open: Number(`${173 + newValue}`), high: Number(`${173 + newValue}`), low: Number(`${173 + newValue}`), close: Number(`${173 + newValue}`) });
							} catch(e) {}
						} else {
							try {
								serie.update({ time: `2019-01-${newDay}`, value: Number(`${23 + newValue}`) });
							} catch(e) {}
						}
					} else {
						dispatch({ type: 'stopUpdateChart' });
					}
					
				});
				counter++;
			}, 1000);
			setIntervalRefresh(interval);
		}

		if (chartContainerRef.current !== undefined && action === 'stopUpdateChart') {
			if (intervalRefresh !== null) {
				clearInterval(intervalRefresh);
			}
		}
	}, [action, data, dispatch, intervalRefresh, series]);

	useEffect(() => {
		const handleResize = () => {
			chart?.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
		}
	
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	});

    return (
		<>
			<div className='chart' style={{
				'display': 'flex',
				'flexDirection': 'row',
				'flexWrap': 'nowrap',
				'justifyContent': 'space-around',
				'alignItems': 'center',
			}}>
				<div 
					ref={chartContainerRef} 
					className="chart-container" 
					style={{
						'margin': '20px'
					}} 
				/>
				<div 
					ref={chartOptionsRef}
					className='seriesOptions'  
				/>
			</div>
		</>
    );
};

export default LWComponent;
