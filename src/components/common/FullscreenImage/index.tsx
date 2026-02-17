import React, { useState } from 'react';
import { Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import './style.css';

interface FullscreenImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

const FullscreenImage: React.FC<FullscreenImageProps> = ({ 
  src, 
  alt = "Image", 
  width = 40, 
  height = 40 
}) => {
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button 
        className="image-control-button"
        onClick={handleOpen}
      >
        <ZoomInIcon />
      </button>
      
      <Modal
        open={open}
        onClose={handleClose}
        className="fullscreen-image-modal"
      >
        <div className="fullscreen-image-container">
          <IconButton 
            onClick={handleClose} 
            className="fullscreen-close-button"
            color="error"
          >
            <CloseIcon />
          </IconButton>
          
          <img 
            src={src}
            alt={alt}
            className="fullscreen-image"
          />
        </div>
      </Modal>
    </>
  );
};

export default FullscreenImage;