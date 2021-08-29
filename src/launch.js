import { createStore } from 'redux';
import './index.css';
import { getCompositeState, rootReducer, ephemeralStateReducer } from './FreeMath';
import { render,  checkAllSaved } from './DefaultHomepageActions';
import { autoSave } from './FreeMath.js';
import URLSearchParams from '@ungap/url-search-params'

var ADD_DEMO_PROBLEM = 'ADD_DEMO_PROBLEM';
var APP_MODE = 'APP_MODE';
var EDIT_ASSIGNMENT = 'EDIT_ASSIGNMENT';

var CURRENT_PROBLEM = 'CURRENT_PROBLEM';
var STEPS = 'STEPS';
var PROBLEMS = 'PROBLEMS';
var FORMAT = 'FORMAT';
var IMG = 'IMG';
var CONTENT = 'CONTENT';

// this action expects an index for which problem to change
var UNDO = 'UNDO';
// this action expects an index for which problem to change
var REDO = 'REDO';


window.onload = function() {
   
    alert("HELLO");
    window.handleClientLoad();
    
    window.store = createStore(rootReducer);
    window.ephemeralStore = createStore(ephemeralStateReducer);
    window.ephemeralStore.subscribe(render);
    window.store.subscribe(render);
    window.store.subscribe(autoSave);
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("mode") === "studentDemo") {
        window.location.hash = '';
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        // turn on confirmation dialog upon navigation away
        window.onbeforeunload = checkAllSaved;
        window.ga('send', 'event', 'Demos', 'open', 'Student Demo');
        window.store.dispatch({type : "NEW_ASSIGNMENT"});
        window.store.dispatch({type : ADD_DEMO_PROBLEM});
    }
    else if (urlParams.get("mode") === "teacherDemo") {
        // turn on confirmation dialog upon navigation away
        window.onbeforeunload = checkAllSaved;
        window.ga('send', 'event', 'Demos', 'open', 'Teacher Demo');

    } else if (urlParams.get("state")) {// open from the google Drive UI
        alert("LAUNCh-STATE");
    }
    document.onpaste = function(event){
      var items = (event.clipboardData || event.originalEvent.clipboardData).items;
      //console.log(JSON.stringify(items)); // will give you the mime types
      for (var index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            var blob = item.getAsFile();
            //console.log(event.target.result);
            const rootState = getCompositeState();
            if (rootState[APP_MODE] === EDIT_ASSIGNMENT) {
                // see if there is a step of type image with empty contents
                // if so paste it there
                const currProbSteps = rootState[PROBLEMS][rootState[CURRENT_PROBLEM]][STEPS];
                const blankImageStep = currProbSteps.find(step => step[FORMAT] === IMG && !step[CONTENT]);
                
            }
        }
      }
    }
    document.addEventListener('keydown', function(event) {
        const rootState = getCompositeState();
        if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
            if (rootState[APP_MODE] === EDIT_ASSIGNMENT) {
                window.store.dispatch({ type : UNDO, PROBLEM_INDEX : rootState[CURRENT_PROBLEM]})
            }
        } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
            if (rootState[APP_MODE] === EDIT_ASSIGNMENT) {
                window.store.dispatch({ type : REDO, PROBLEM_INDEX : rootState[CURRENT_PROBLEM]})
            }
        }
    });

    render();
};
//import { unregister } from './registerServiceWorker';
//unregister();
