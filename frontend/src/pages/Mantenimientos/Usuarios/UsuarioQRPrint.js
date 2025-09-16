import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Print as PrintIcon,
  QrCode as QrCodeIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { useConfiguracion } from '../../../contexts/ConfiguracionContext';

const UsuarioQRPrint = ({ open, onClose, usuario }) => {
  // Obtener datos del colegio desde el contexto
  const { colegio } = useConfiguracion();

  // Función para obtener el color del rol
  const getRoleColor = (rol) => {
    const colors = {
      'Administrador': 'primary',
      'Docente': 'secondary',
      'Alumno': 'success',
      'Apoderado': 'warning',
      'Tutor': 'info',
      'Psicologia': 'info',
      'Secretaria': 'warning',
      'Director': 'secondary',
      'Promotor': 'primary'
    };
    return colors[rol] || 'default';
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para construir URL de imagen
  const getImageUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${filename}`;
  };

  // Función para capturar la ventana y imprimir
  const handlePrint = async () => {
    try {
      const element = document.querySelector('.printable-area');
      if (!element) return;

      // Capturar la ventana como imagen
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Mayor resolución
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      // Crear una ventana nueva para imprimir
      const printWindow = window.open('', '_blank');

      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Imprimir Carné QR - ${usuario.nombres} ${usuario.apellidos}</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  background: white;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                .print-image {
                  width: 5.5cm;
                  height: 8.5cm;
                  border: 1px solid #ddd;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                  }
                  .print-image {
                    width: 5.5cm;
                    height: 8.5cm;
                    border: none;
                    box-shadow: none;
                  }
                }
              </style>
            </head>
            <body>
              <img src="${canvas.toDataURL('image/png')}" alt="Carné QR" class="print-image" />
            </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        // Esperar a que se cargue la imagen y luego imprimir
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 1000);
        };
      }
    } catch (error) {
      console.error('Error al capturar la ventana:', error);
      // Fallback: imprimir directamente
      window.print();
    }
  };

  // Función para guardar como PDF
  const handleSavePDF = async () => {
    try {
      const element = document.querySelector('.printable-area');
      if (!element) return;

      // Capturar la ventana como imagen
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Mayor resolución
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      // Crear una ventana nueva para generar PDF
      const printWindow = window.open('', '_blank');

      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Guardar Carné QR - ${usuario.nombres} ${usuario.apellidos}</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  background: white;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                .print-image {
                  width: 5.5cm;
                  height: 8.5cm;
                  border: 1px solid #ddd;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                  }
                  .print-image {
                    width: 5.5cm;
                    height: 8.5cm;
                    border: none;
                    box-shadow: none;
                  }
                }
              </style>
            </head>
            <body>
              <img src="${canvas.toDataURL('image/png')}" alt="Carné QR" class="print-image" />
              <script>
                // Auto-imprimir para generar PDF
                window.onload = function() {
                  setTimeout(() => {
                    window.print();
                  }, 1000);
                };
              </script>
            </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.focus();
      }
    } catch (error) {
      console.error('Error al capturar la ventana:', error);
    }
  };

  if (!usuario) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        p: 2,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QrCodeIcon color="primary" />
          <Typography variant="h6" color="primary" component="span">
            Imprimir Código QR
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {/* Vista previa del documento a imprimir - Formato carnet 8.5cm x 5.5cm */}
        <Paper
          elevation={2}
          className="printable-area"
          sx={{
            p: 1.5,
            backgroundColor: 'white',
            border: '2px solid #1976d2',
            borderRadius: 1,
            width: '5.5cm',
            height: '8.5cm',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          {/* Header del carnet */}
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{
              fontWeight: 'bold',
              color: '#1976d2',
              fontSize: '0.7rem',
              lineHeight: 1.1,
              mb: 0.5
            }}>
              {(colegio?.nombre || 'SISTEMA EDUCATIVO MULTICOLEGIO').toUpperCase()}
            </Typography>
            <Typography variant="caption" sx={{
              color: '#666',
              fontSize: '0.6rem',
              display: 'block'
            }}>
              CARNÉ DE IDENTIFICACIÓN
            </Typography>
          </Box>

          {/* Layout del carnet */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flex: 1 }}>
            {/* Foto del usuario */}
            <Avatar
              src={getImageUrl(usuario.foto)}
              sx={{
                width: 45,
                height: 45,
                fontSize: '1.2rem',
                border: '1px solid #1976d2',
                flexShrink: 0
              }}
            >
              {(usuario.nombres?.charAt(0) || '') + (usuario.apellidos?.charAt(0) || '')}
            </Avatar>

            {/* Datos del usuario */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{
                fontWeight: 'bold',
                fontSize: '0.6rem',
                lineHeight: 1.1,
                mb: 0.5,
                wordBreak: 'break-word'
              }}>
                {usuario.nombres} {usuario.apellidos}
              </Typography>
              <Typography variant="caption" sx={{
                color: '#666',
                fontSize: '0.5rem',
                display: 'block',
                mb: 0.5
              }}>
                DNI: {usuario.dni}
              </Typography>
              <Typography variant="caption" sx={{
                color: '#1976d2',
                fontSize: '0.5rem',
                fontWeight: 'bold',
                display: 'block'
              }}>
                {usuario.rol}
              </Typography>
            </Box>
          </Box>

          {/* QR Code central - tamaño ajustado y centrado en ambos ejes */}
          {usuario.qr_code && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '3.6cm',
              mt: 0.1,
              mb: 0.1
            }}>
              <Box sx={{ width: '3.3cm', height: '3.3cm', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <QRCode
                  value={usuario.qr_code}
                  size={256}
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>
            </Box>
          )}

          {/* Información adicional compacta - más arriba */}
          <Box sx={{ mb: 0.4 }}>
            <Typography variant="caption" sx={{
              color: '#666',
              fontSize: '0.45rem',
              display: 'block',
              mb: 0.25
            }}>
              Email: {usuario.email || 'No especificado'}
            </Typography>
            <Typography variant="caption" sx={{
              color: '#666',
              fontSize: '0.45rem',
              display: 'block',
              mb: 0.25
            }}>
              Tel: {usuario.telefono || 'No especificado'}
            </Typography>
            <Typography variant="caption" sx={{
              color: '#666',
              fontSize: '0.45rem',
              display: 'block'
            }}>
              ID: #{usuario.id}
            </Typography>
          </Box>

          {/* Footer del carnet */}
          <Box sx={{
            textAlign: 'center',
            borderTop: '1px solid #e0e0e0',
            pt: 0.5
          }}>
            <Typography variant="caption" sx={{
              color: '#666',
              fontSize: '0.4rem',
              display: 'block'
            }}>
              {new Date().toLocaleDateString('es-ES')}
            </Typography>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{
        p: 2,
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
        gap: 1
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSavePDF}
          variant="outlined"
          startIcon={<PdfIcon />}
          sx={{ borderRadius: 2, color: '#d32f2f', borderColor: '#d32f2f' }}
        >
          Guardar PDF
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          startIcon={<PrintIcon />}
          sx={{ borderRadius: 2 }}
        >
          Imprimir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioQRPrint;
