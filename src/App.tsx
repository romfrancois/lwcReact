import { LineData, SeriesOptions, SeriesOptionsMap, SeriesType, WhitespaceData } from 'lightweight-charts';
import React, { useReducer } from 'react';
import './App.css';
import LWComponent from './LWCComponent';
import MenuComponent from './Menu';

import { timeValueData } from './chartData';

type Action =
    | { type: 'createChart'; }
    | { type: 'actionTreated'; }
    | { type: 'setSeriesType'; value: string }
    | { type: 'setSeriesOptions'; value: string }
    | { type: 'addBlockOfData'; }
    | { type: 'startUpdateChart'; }
    | { type: 'stopUpdateChart'; }

type LWCApp = {
	action: 'createChart' | 'actionTreated' | 'setSeriesType' | 'setSeriesOptions' | 'addBlockOfData' | 'startUpdateChart' | 'stopUpdateChart' | ''
	data: (LineData | WhitespaceData)[],
	seriesType : SeriesType;
	seriesOptions?: SeriesOptions<SeriesOptionsMap[SeriesType]>;
};

const LWCIS: LWCApp = {
    action: '',
	data: [],
	seriesType: 'Area',
};

type contextProp = {
    dispatch: React.Dispatch<Action>;
    state: LWCApp;
};

export const LWCContext = React.createContext({} as contextProp);

function lwcReducer(state: LWCApp, action: Action) {
    switch (action.type) {
        case 'createChart':
            return {
                ...state,
                action: action.type,
				data: timeValueData,
            };

		case 'actionTreated':
			return {
				...state,
				action: action.type
			};

		case 'setSeriesType':
			return {
				...state,
				seriesType: action.value as SeriesType
			};

		case 'setSeriesOptions':
			return {
				...state,
				seriesOptions: action.value as unknown as SeriesOptions<SeriesOptionsMap[SeriesType]>
			};

		case 'addBlockOfData':
			return {
				...state,
				action: action.type
			};

		case 'startUpdateChart':
			return {
				...state,
				action: action.type
			};

		case 'stopUpdateChart':
			return {
				...state,
				action: action.type
			};

        default:
            return state;
    }
}


const App = (): JSX.Element => {
	const [lwcAppState, dispatch] = useReducer(lwcReducer, LWCIS);

	return (
		<>
			<LWCContext.Provider value={{ state: lwcAppState, dispatch }}>
				<MenuComponent />
				<LWComponent />
			</LWCContext.Provider>
		</>
	);
}

export default App;
