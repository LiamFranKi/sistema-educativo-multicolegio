import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Image,
  Close,
} from '@mui/icons-material';
import { cloudinaryApi } from '../../services/apiService';

const CloudinaryUpload = ({
  onUploadSuccess,
  onDeleteSuccess,
  currentImageUrl,
  currentPublicId,
  folder = 'sistema-educativo',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño
    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. Máximo ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    setError('');
    setPreview(URL.createObjectURL(file));
    setShowPreview(true);
  };

  const handleUpload = async () => {
    if (!preview) return;

    setUploading(true);
    setError('');

    try {
      // Crear un archivo temporal desde la preview
      const response = await fetch(preview);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

      const result = await cloudinaryApi.uploadFile(file);

      if (result.data.success) {
        onUploadSuccess?.(result.data.data);
        setShowPreview(false);
        setPreview(null);
        // Limpiar input
        const input = document.getElementById('cloudinary-upload');
        if (input) input.value = '';
      } else {
        setError(result.data.message || 'Error subiendo archivo');
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      setError('Error subiendo archivo. Intenta nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPublicId) return;

    try {
      const result = await cloudinaryApi.deleteFile(currentPublicId);

      if (result.data.success) {
        onDeleteSuccess?.();
        setError('');
      } else {
        setError(result.data.message || 'Error eliminando archivo');
      }
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      setError('Error eliminando archivo. Intenta nuevamente.');
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <Box>
      {/* Input de archivo */}
      <input
        id="cloudinary-upload"
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {/* Botón de subir */}
      <Button
        variant="outlined"
        startIcon={<CloudUpload />}
        onClick={() => document.getElementById('cloudinary-upload').click()}
        disabled={disabled || uploading}
        fullWidth
        sx={{ mb: 2 }}
      >
        {uploading ? 'Subiendo...' : 'Subir Imagen'}
      </Button>

      {/* Imagen actual */}
      {currentImageUrl && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Imagen actual:
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={currentImageUrl}
              alt="Preview"
              style={{
                width: '100%',
                maxWidth: '200px',
                height: 'auto',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => window.open(currentImageUrl, '_blank')}
            />
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {uploading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Subiendo imagen...</Typography>
        </Box>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onClose={handleClosePreview} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Vista Previa</Typography>
            <IconButton onClick={handleClosePreview}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px'
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Cancelar</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
          >
            {uploading ? 'Subiendo...' : 'Subir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CloudinaryUpload;
