import React, { useRef, useState } from 'react';
import {
  Typography, Box, Grid, Button, TextField,
  IconButton, Tooltip
} from '@mui/material';
import { IoDocumentAttachOutline } from "react-icons/io5";

function FileUploadComponent() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ display: 'inline' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the native input
      />
      <Tooltip title="Adicionar Arquivo">
        <IconButton
          id="outlined-hidden-label-normal"
          defaultValue=""
          variant="outlined"
          onClick={handleButtonClick}>
          <IoDocumentAttachOutline />
        </IconButton></Tooltip>
      {/* <TextField  value={selectedFile?.name}
                            required
                            id="outlined-hidden-label-normal"
                            defaultValue=""
                            variant="outlined"
                            size="small"
                            sx={{ width: '80%' }}
                            onClick={handleButtonClick}
                          /> */}
      {/* <Button variant="contained" onClick={handleButtonClick}>
        Upload File
      </Button> */}
      {/* {selectedFile && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Selected file: {selectedFile.name}
        </Typography>
      )} */}
    </div>
  );
}

export default FileUploadComponent;