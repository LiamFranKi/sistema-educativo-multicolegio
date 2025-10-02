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
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Image,
  Description,
  VideoFile,
  Close,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { hybridFileService } from '../../services/hybridFileService';

const HybridFileUpload = ({
  onUploadSuccess,
  onDeleteSuccess,
  currentFileUrl,
  currentPublicId,
  folder = 'sistema-educativo',
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  allowedTypes = ['image', 'document', 'video']
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño
    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. Máximo ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Detectar tipo de archivo
    const fileType = hybridFileService.getFileType(file);

    // Validar tipo permitido
    if (!allowedTypes.includes(fileType)) {
      setError(`Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`);
      return;
    }

    setError('');
    setFileInfo({
      name: file.name,
      size: file.size,
      type: fileType,
      mimeType: file.type
    });

    // Crear preview según el tipo
    if (fileType === 'image') {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null); // No preview para documentos
    }

    setShowPreview(true);
  };

  const handleUpload = async () => {
    if (!fileInfo) return;

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await hybridFileService.uploadFile(fileInfo, folder);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        onUploadSuccess?.(result);
        setShowPreview(false);
        setPreview(null);
        setFileInfo(null);
        // Limpiar input
        const input = document.getElementById('hybrid-file-upload');
        if (input) input.value = '';
      } else {
        setError(result.message || 'Error subiendo archivo');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error subiendo archivo. Intenta nuevamente.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!currentFileUrl) return;

    try {
      const result = await hybridFileService.deleteFile(currentFileUrl, currentPublicId);

      if (result.success) {
        onDeleteSuccess?.();
        setError('');
      } else {
        setError(result.message || 'Error eliminando archivo');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('Error eliminando archivo. Intenta nuevamente.');
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setFileInfo(null);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <Image />;
      case 'document': return <Description />;
      case 'video': return <VideoFile />;
      default: return <Description />;
    }
  };

  const getProviderInfo = (url) => {
    if (url) {
      return hybridFileService.getFileInfo(url);
    }
    return null;
  };

  const providerInfo = getProviderInfo(currentFileUrl);

  return (
    <Box>
      {/* Input de archivo */}
      <input
        id="hybrid-file-upload"
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
        onClick={() => document.getElementById('hybrid-file-upload').click()}
        disabled={disabled || uploading}
        fullWidth
        sx={{ mb: 2 }}
      >
        {uploading ? 'Subiendo...' : 'Subir Archivo'}
      </Button>

      {/* Archivo actual */}
      {currentFileUrl && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Archivo actual:
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            backgroundColor: '#f9f9f9'
          }}>
            {getFileIcon(providerInfo?.type || 'document')}
            <Typography variant="body2" sx={{ flex: 1 }}>
              {currentFileUrl.split('/').pop()}
            </Typography>
            <Chip
              label={providerInfo?.provider || 'Railway'}
              size="small"
              color={providerInfo?.type === 'cloudinary' ? 'primary' : 'default'}
            />
            <IconButton
              size="small"
              onClick={handleDelete}
              color="error"
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
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Subiendo archivo...</Typography>
          </Box>
          <LinearProgress variant="determinate" value={uploadProgress} />
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
          {fileInfo && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {getFileIcon(fileInfo.type)}
                <Typography variant="subtitle2">{fileInfo.name}</Typography>
                <Chip
                  label={fileInfo.type}
                  size="small"
                  color={fileInfo.type === 'image' ? 'primary' : 'default'}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Tamaño: {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Destino: {fileInfo.type === 'image' ? 'Cloudinary' : 'Railway'}
              </Typography>
            </Box>
          )}

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

export default HybridFileUpload;
