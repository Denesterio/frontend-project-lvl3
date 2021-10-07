import init from './init.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import domReady from './domReady.js';

domReady.then(() => init());

export default init;
