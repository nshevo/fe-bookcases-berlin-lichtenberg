import {Control} from 'ol/control.js';

export default class ResetMapControl extends Control {

    constructor(opt_options) {
      const options = opt_options || {};
  
      const button = document.createElement('button');
      button.innerHTML = '↺';
  
      const element = document.createElement('div');  
      element.title = "Reset map for new visualization";
      element.className = 'ol-reload-control ol-control';
      
      element.appendChild(button);
  
      super({
        element: element,
        target: options.target,
      });
  
      button.addEventListener('click', this.handleMapReload, false);
    }
  
    handleMapReload() {
      window.location.reload();
    }
  }
  