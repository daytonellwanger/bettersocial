import React from 'react';
import ReactDOM from 'react-dom';
import { reactPlugin } from './AppInsights';
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js';
import ErrorHandler from './components/ErrorHandler';

ReactDOM.render(
    <React.StrictMode>
        <AppInsightsContext.Provider value={reactPlugin}>
            <ErrorHandler />
        </AppInsightsContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
