import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Snackbar from '@mui/material/Snackbar';

function FileUpload({ setGeoJSON: setGeoJSON}) {
  const [file, setFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const onDrop = (acceptedFiles) => {

    if(acceptedFiles.length > 1) {
      setError('Please upload only one file at a time.');
      setOpenSnackbar(true);
      return;
    }

    acceptedFiles.forEach(file => {
      if (file.name.endsWith('.xlsx')) {
        setFile(file);
      } else {
        setError('Invalid file format. Please upload a .xlsx file.');
        setOpenSnackbar(true);
      }    
  })};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: '.xlsx', // the accepted file type
  });

  useEffect(() => {
    if (file && file.name.endsWith('.xlsx')) {
      uploadFile(file);
    }
  }, [file]);

  const uploadFile = async () => {

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:3000/convert', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // backend sends the GeoJSON file content in the response
        const geojsonContent = response.data;

        setGeoJSON(geojsonContent);
        setIsUploaded(true); // Set upload status to true

      } catch (error) {
        setError('Error uploading and visualizing a file.');
        setOpenSnackbar(true);
      }
    }
  };

  return (      
    <div className="dropzone-container" style={{ display: isUploaded ? 'none' : '' }}>
        {error &&  <Snackbar open={openSnackbar} autoHideDuration={4500} onClose={handleClose} message={error}>
      </Snackbar>
    }
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'drag-active' : ''}`}>
        <h1>Visualize your XLSX</h1>
        <input {...getInputProps()} />
        <p><IconButton><CloudUploadIcon /></IconButton>Click to upload or Drag & Drop an XLSX file here</p>
      </div>
    </div>
  );
}

export default FileUpload;
