import React, { useState } from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CloseIcon from '@mui/icons-material/Close';
import './style.css';

interface ImageZoomProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ 
  src, 
  alt = "Image", 
  width = 50, 
  height = 50 
}) => {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setZoom(1); // Reset zoom when closing
  };
  
  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(prev => Math.min(prev + 0.5, 5)); // Max zoom 5x
  };
  
  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(prev => Math.max(prev - 0.5, 0.5)); // Min zoom 0.5x
  };

  return (
    <>
      <Box 
        component="img"
        src={src}
        alt={alt}
        sx={{ 
          width, 
          height, 
          objectFit: 'cover', 
          cursor: 'pointer',
          borderRadius: 1,
          '&:hover': {
            opacity: 0.8
          }
        }}
        onClick={handleOpen}
      />
      
      <Modal
        open={open}
        onClose={handleClose}
        className="image-zoom-modal"
      >
        <Box className="image-zoom-container">
          <Box className="image-zoom-controls">
            <IconButton onClick={handleZoomIn} color="primary">
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={handleZoomOut} color="primary">
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={handleClose} color="error">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box 
            component="img"
            src={src}
            alt={alt}
            sx={{ 
              maxWidth: '90vw',
              maxHeight: '80vh',
              transform: `scale(${zoom})`,
              transition: 'transform 0.2s ease-in-out'
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default ImageZoom;