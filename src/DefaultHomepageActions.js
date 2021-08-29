import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import FreeMath, { getCompositeState } from './FreeMath.js';

var MathQuill = window.MathQuill;


var GOOGLE_ID = 'GOOGLE_ID';
// state for google drive auto-save
// Property name and possible values, also can be DIRTY_WORKING_COPY, SAVING
var GOOGLE_DRIVE_STATE = 'GOOGLE_DRIVE_STATE';
var ALL_SAVED = 'ALL_SAVED';

var APP_MODE = 'APP_MODE';
var MODE_CHOOSER = 'MODE_CHOOSER';

function checkAllSaved() {
    const appState = getCompositeState();
    if (appState[APP_MODE] !== MODE_CHOOSER &&
        !(appState[GOOGLE_ID] && appState[GOOGLE_DRIVE_STATE] === ALL_SAVED)) {
        return true;
    } else {
        return null;
    }
}


function render() {
    window.MathQuill = MathQuill.getInterface(1);
    const globalState = getCompositeState();
    ReactDOM.render(
        <div>
            <FreeMath value={globalState} />
        </div>,
        document.getElementById('root')
    );
}

export { render, checkAllSaved};
