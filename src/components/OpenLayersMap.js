import React from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';
import { Point } from 'ol/geom';
import bookshelfIcon from '../images/mapIcons/bookshelfIcon.png';
import OpenLayersPopup from './OpenLayersPopup';

import {defaults as defaultControls} from 'ol/control.js';
import ResetMapControl from './ResetMapControl';

export default class OpenLayersMap extends React.Component {
  
  constructor(props) {
    super(props);

    this.isMobile = window.innerWidth <= 768; // Defining mobile width threshold

    this.state = { 
      center: fromLonLat([13.3884, 52.5169]), 
      zoom: 10, 
      geoJSON: props.geoJSON,
    };

    this.map = new Map({
      controls: defaultControls().extend([new ResetMapControl()]),
      target: null,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.createLayer()
      ],
      view: new View({
        center: this.state.center,
        zoom: this.state.zoom
      })
    });
  }

  createLayer() {
        // Create a VectorSource from the JSON data
        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(this.state.geoJSON, {
          }),
        });
        
        // Create a vector layer with the vector source
        const vectorLayer = new VectorLayer({
          source: vectorSource
        }); 
        
        vectorSource.getFeatures().forEach((feature) => {
          const geometry = feature.getGeometry();
          const coordinates = geometry.getCoordinates();
          // Set coordinates of the feature
          feature.setGeometry(new Point(fromLonLat(coordinates)));
          feature.setStyle(new Style({image: new Icon({ 
            scale: 0.05,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            anchor: [0.5, 46],
            src: bookshelfIcon,})}));
        });

        return vectorLayer;
  }
    componentDidMount() {
      this.map.setTarget("map");
     
      // Listener to open popup overlay on click
      this.map.on('singleclick', evt => {
        const feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
        });
  
        if (feature) {
          const coordinates = feature.getGeometry().getCoordinates();          
          const name = feature.get('name');
          const address = feature.get('address');

          this.setState({ coordinates: coordinates, name: name, address: address });
        }else{
          if(this.isMobile){
            this.setState({ coordinates: null, name: null, address: null});
          }else{
            let popupOverlay = this.map.getOverlayById("popup");
            this.map.removeOverlay(popupOverlay);
          }
        }
      });

      // Listener to change cursor on hover
      this.map.on('pointermove', evt => {
        const pixel = this.map.getEventPixel(evt.originalEvent);
        const hit = this.map.hasFeatureAtPixel(pixel);
        this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      });
    }
  
    componentWillUnmount() {
      this.map.setTarget(null);
    }

    mobileOverlayCloseButtonClicked() {
      this.setState({ coordinates: null, name: null, address: null })
    }

    render() {
      const { coordinates, name, address} = this.state;

      const openLayersPopup = coordinates && name && address && this.map && <OpenLayersPopup map={this.map} coordinates={coordinates} name={name} address={address} />;

      return (
        <div>
          <div>           
              {this.isMobile &&name && address && 
                <div className="mobile-overlay">
                  <h3>{name}</h3>
                  <p>{address}</p>
                  <a className="mobile-overlay-close-button" onClick={() => this.mobileOverlayCloseButtonClicked()} aria-label="close">&#x25B2;</a>
                </div> 
              }

              <div id="map" />
              {!this.isMobile && openLayersPopup}
          </div>
        </div>
      );
  }

}
