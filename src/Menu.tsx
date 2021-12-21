import React, { useContext, useEffect, useState } from 'react';
import { LWCContext } from './App';

import './menu.css';

const MenuComponent = (): JSX.Element => {
	const { dispatch } = useContext(LWCContext);

	const {
        state: {
            action
        },
    } = useContext(LWCContext);

	const [buttonsDisabled, setButtonsDisabled] = useState(true);
	const [updateChart, setUpdateChart] = useState('startUpdateChart');

	useEffect(() => {
		if (action === 'stopUpdateChart') {
			setButtonsDisabled(true);
		}
	}, [action]);

    const handleMenu = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.persist();

            const {
                currentTarget: { name },
            } = e;

            switch (name) {
                case 'createChart':
                    dispatch({ type: 'createChart' });
					setButtonsDisabled(false);
					setUpdateChart('startUpdateChart');
                    break;
                case 'addBlockOfData':
                    dispatch({ type: 'addBlockOfData' });
                    break;
                case 'startUpdateChart':
                    dispatch({ type: 'startUpdateChart' });
					setUpdateChart('stopUpdateChart');
                    break;
                case 'stopUpdateChart':
                    dispatch({ type: 'stopUpdateChart' });
					setButtonsDisabled(true);
                    break;
                default:
                    break;
            }
        },
        [dispatch],
    );

    const handleRadioButton = React.useCallback(
        (e: React.MouseEvent<HTMLInputElement>): void => {
            e.persist();

            const {
                currentTarget: { value },
            } = e;

			dispatch({ type: 'setSeriesType', value: value });
        },
        [dispatch],
    );

	const handleOptionsChange = React.useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
			let parsedOptions = '';
			try {
				parsedOptions = JSON.parse(e.target.value);
			}
			catch(e) { }
			dispatch({ type: 'setSeriesOptions', value: parsedOptions });
		},
        [dispatch],
	);

	const title = updateChart === 'startUpdateChart' ? 'Update the chart 1 bar per second' : 'Stop updating the chart';

    return (
        <>
			<div className='series' style={{
					'display': 'flex',
					'flexDirection': 'row',
					'flexWrap': 'nowrap',
					'justifyContent': 'space-evenly',
					'margin': '2rem'
				}} >
				<div className='radioButton' style={{
					'display': 'flex',
					'flexDirection': 'column',
					'flexWrap': 'nowrap',
					'justifyContent': 'center',
					'alignItems': 'flex-start',
				}} >
					<label>
						<input type="radio" value="Area" name="seriesType" onClick={handleRadioButton} defaultChecked/> 
						Area
					</label>
					<label>
						<input type="radio" value="Bar" name="seriesType" onClick={handleRadioButton}/> 
						Bar
					</label>
					<label>
						<input type="radio" value="Baseline" name="seriesType" onClick={handleRadioButton}/> 
						Baseline
					</label>
					<label>
						<input type="radio" value="Candlestick" name="seriesType" onClick={handleRadioButton}/> 
						Candlestick
					</label>
					<label>
						<input type="radio" value="Histogram" name="seriesType" onClick={handleRadioButton}/> 
						Histogram
					</label>
					<label>
						<input type="radio" value="Line" name="seriesType" onClick={handleRadioButton}/> 
						Line
					</label>
				</div>

				<div className='seriesOptions'>
					<textarea cols={50} rows={15} onChange={handleOptionsChange} defaultValue={`{\n\tpropertyKey: propertyValue\n}`}></textarea>
				</div>
			</div>

            <div className='menuButtons' style={{
					'display': 'flex',
					'flexDirection': 'row',
					'flexWrap': 'nowrap',
					'justifyContent': 'space-evenly',
					'padding': '1rem',
				}} >
                <button type="submit" name="createChart" onClick={handleMenu}>
                    <span>Create and add chart</span>
                </button>

                <button type="submit" name="addBlockOfData" onClick={handleMenu} disabled={buttonsDisabled}>
                    <span>Add 1 block data</span>
                </button>

                <button type="submit" name={updateChart} onClick={handleMenu} disabled={buttonsDisabled}>
                    <span>{ title }</span>
                </button>

                {/* <button type="submit" name="createChartAsOverlay" onClick={handleMenu}>
                    <span>Create and add chart as Overlay</span>
                </button> */}
            </div>
        </>
    );
};

export default MenuComponent;
