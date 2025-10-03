# Configuración de Volumen Persistente en Railway

## Problema
Railway no permite escritura en el sistema de archivos por defecto, causando errores 500 en subida de archivos.

## Solución: Volumen Persistente

### 1. Configurar Variable de Entorno
En Railway, agrega esta variable de entorno:

```
UPLOAD_PATH=/data/uploads
```

### 2. Configurar Volumen en railway.json
Crea o actualiza el archivo `railway.json` en la raíz del proyecto:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300
  },
  "volumes": [
    {
      "mountPath": "/data",
      "name": "uploads-volume"
    }
  ]
}
```

### 3. Crear Directorio en el Código
El código ya está configurado para:
- Crear directorios automáticamente
- Verificar permisos de escritura
- Usar `/data/uploads` como ruta base en Railway

### 4. Verificar en Railway Dashboard
1. Ve a tu proyecto en Railway
2. Settings → Volumes
3. Verifica que el volumen esté montado en `/data`

## Alternativa: Usar /tmp (Temporal)
Si no puedes configurar volúmenes persistentes:

```
UPLOAD_PATH=/tmp/uploads
```

**Nota**: Los archivos en `/tmp` se perderán al reiniciar el contenedor.

## Verificación
Después de configurar, prueba subir una imagen y verifica en los logs:
- ✅ "Directorios creados correctamente"
- ✅ "Permisos de escritura confirmados"
- ✅ "Archivo subido exitosamente"

## Logs de Debug
El código incluye logs detallados para diagnosticar problemas:
- `🔍 Upload Debug Info`
- `📁 Carpeta determinada`
- `📂 Upload path`
- `✅ Permisos de escritura confirmados`
