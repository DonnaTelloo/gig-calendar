import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './style.css';

interface ImageDropzoneProps {
  onImageChange: (file: File | null) => void;
  initialImage?: string | null;
  label?: string;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ 
  onImageChange, 
  initialImage = null,
  label = "Drop image here or click to upload"
}) => {
  const [preview, setPreview] = useState<string | null>(initialImage);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection
  const handleFile = useCallback((file: File | null) => {
    onImageChange(file);
    
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  }, [onImageChange]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview && preview !== initialImage) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, initialImage]);

  // Set up drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFile(file);
      }
    }
  }, [handleFile]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFile(target.files[0]);
      }
    };
    input.click();
  }, [handleFile]);

  return (
    <Paper
      className={`image-dropzone ${isDragging ? 'dragging' : ''} ${preview ? 'has-image' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      elevation={2}
    >
      {preview ? (
        <Box className="image-preview-container">
          <img 
            src={preview} 
            alt="Preview" 
            className="image-preview" 
          />
          <Box className="image-overlay">
            <Typography variant="body2">Click to change</Typography>
          </Box>
        </Box>
      ) : (
        <Box className="upload-placeholder">
          <CloudUploadIcon fontSize="large" />
          <Typography variant="body1">{label}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ImageDropzone;