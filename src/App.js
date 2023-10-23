import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import OpenLayersMap from './components/OpenLayersMap';

function App() {
  const [geoJSON, setGeoJSON] = useState(null);
  const hasGeoJSON = !geoJSON;

  return (
    <div className={`app ${hasGeoJSON ? 'initial-app-container' : ''}`}>
      <FileUpload setGeoJSON={setGeoJSON} />
      {geoJSON && <OpenLayersMap geoJSON={geoJSON} />}
    </div>
  );
}

export default App;
