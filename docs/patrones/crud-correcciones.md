# 🔧 CORRECCIONES CRUD - PATRONES Y MEJORES PRÁCTICAS

## 📋 **INTRODUCCIÓN**

Este documento registra las correcciones importantes realizadas en el módulo Cursos y otros módulos para establecer patrones consistentes y evitar errores comunes en futuras implementaciones.

---

## 🎯 **PATRONES ESTABLECIDOS**

### **1. Manejo de Imágenes**

#### **✅ Patrón Correcto:**

```javascript
// Frontend - Subida de imagen
const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      setLoading(true);
      const response = await fileService.uploadFile(file, "tipo-modulo");

      if (response.success) {
        setFormData((prev) => ({
          ...prev,
          imagen: response.filename, // ✅ Solo el nombre del archivo
        }));
        Swal.fire("Éxito", "Imagen subida correctamente", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Error al subir la imagen", "error");
    } finally {
      setLoading(false);
    }
  }
};
```

```javascript
// Backend - Recepción de imagen
router.post("/", async (req, res) => {
  try {
    const { nombre, imagen, activo } = req.body; // ✅ Recibe JSON con filename

    const result = await query(
      "INSERT INTO tabla (nombre, imagen, activo) VALUES ($1, $2, $3)",
      [nombre, imagen, activo]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno" });
  }
});
```

#### **❌ Patrón Incorrecto (Evitar):**

```javascript
// ❌ NO usar multer en backend para módulos simples
router.post("/", upload.single("imagen"), async (req, res) => {
  const imagen = req.file ? req.file.filename : null; // ❌ Complejo e innecesario
});

// ❌ NO usar response.data.filename
imagen: response.data.filename; // ❌ Causa errores

// ❌ NO usar múltiples estados de loading
const [loading, setLoading] = useState(false);
const [uploadingImage, setUploadingImage] = useState(false); // ❌ Confuso
```

### **2. Orden de Operaciones en Formularios**

#### **✅ Patrón Correcto:**

```javascript
const handleSubmit = async () => {
  if (!validateForm()) return;

  setLoading(true);
  try {
    const response = await service.createItem(formData);

    if (response.success) {
      onSaveSuccess(); // ✅ Primero: cierra modal y recarga datos
      await Swal.fire("Éxito", "Elemento creado exitosamente", "success"); // ✅ Después: confirma
    }
  } catch (error) {
    await Swal.fire("Error", "Error al guardar", "error");
  } finally {
    setLoading(false);
  }
};
```

#### **❌ Patrón Incorrecto (Evitar):**

```javascript
// ❌ NO llamar onSaveSuccess después del Swal
await Swal.fire("Éxito", "Elemento creado", "success");
onSaveSuccess(); // ❌ Puede causar bloqueos y conflictos
```

### **3. Manejo de Estados de Carga**

#### **✅ Patrón Correcto:**

```javascript
// ✅ Un solo estado de loading
const [loading, setLoading] = useState(false);

// ✅ Usar en todos los lugares
disabled = { loading };
{
  loading ? "Guardando..." : "Guardar";
}
```

#### **❌ Patrón Incorrecto (Evitar):**

```javascript
// ❌ NO múltiples estados confusos
const [loading, setLoading] = useState(false);
const [uploadingImage, setUploadingImage] = useState(false);
const [saving, setSaving] = useState(false);
```

### **4. Diseño de Headers de Módulos**

#### **✅ Patrón Correcto:**

```javascript
// ✅ Header con Card y CardHeader
<Card sx={{ mb: 3 }}>
  <CardHeader
    avatar={<ModuleIcon color="primary" sx={{ fontSize: 32 }} />}
    title={
      <Typography variant="h4" component="h1" color="primary">
        Gestión de Módulo
      </Typography>
    }
    subheader="Descripción del módulo"
  />
  <Divider />
  <CardContent>{/* Filtros y controles aquí */}</CardContent>
</Card>
```

#### **❌ Patrón Incorrecto (Evitar):**

```javascript
// ❌ NO usar Box simple para header
<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
  <ModuleIcon sx={{ mr: 2 }} />
  <Typography variant="h4">Gestión de Módulo</Typography>
</Box>
```

### **5. Filtros y Búsqueda**

#### **✅ Patrón Correcto:**

```javascript
// ✅ Grid layout con controles completos
<Grid container spacing={2} alignItems="center">
  <Grid item xs={12} md={4}>
    <TextField
      fullWidth
      placeholder="Buscar por nombre..."
      value={searchTerm}
      onChange={handleSearch}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      size="small"
    />
  </Grid>

  <Grid item xs={12} md={4}>
    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
      <Button
        variant="outlined"
        startIcon={<ClearIcon />}
        onClick={handleClearSearch}
        size="small"
      >
        Limpiar
      </Button>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleCreate}
        size="small"
      >
        Nuevo Elemento
      </Button>
    </Box>
  </Grid>
</Grid>
```

### **6. Menús Contextuales**

#### **✅ Patrón Correcto:**

```javascript
// ✅ ListItemIcon y ListItemText con colores
<MenuItem onClick={() => handleMenuAction('view')}>
  <ListItemIcon>
    <VisibilityIcon color="info" />
  </ListItemIcon>
  <ListItemText primary="Ver Detalle" />
</MenuItem>

<MenuItem onClick={() => handleMenuAction('edit')}>
  <ListItemIcon>
    <EditIcon color="primary" />
  </ListItemIcon>
  <ListItemText primary="Editar Elemento" />
</MenuItem>

<MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
  <ListItemIcon>
    <DeleteIcon color="error" />
  </ListItemIcon>
  <ListItemText primary="Eliminar Elemento" />
</MenuItem>
```

---

## 🚫 **ERRORES COMUNES A EVITAR**

### **1. Importaciones Incorrectas**

```javascript
// ❌ NO importar contextos que no existen
import { useAuth } from "../../../contexts/AuthContext"; // ❌ No existe

// ✅ Verificar contextos disponibles
// Solo: UserContext, ConfiguracionContext, ThemeContext
```

### **2. Referencias a Variables No Definidas**

```javascript
// ❌ NO usar variables no definidas
disabled = { uploadingImage }; // ❌ Si no existe la variable

// ✅ Usar variables existentes
disabled = { loading }; // ✅ Variable definida
```

### **3. Imágenes por Defecto Inexistentes**

```javascript
// ❌ NO referenciar archivos que no existen
if (!imagen) return "/default-module.png"; // ❌ Causa error 404

// ✅ Retornar null o usar getImageUrl
if (!imagen) return null; // ✅ Correcto
// O mejor aún: usar getImageUrl(imagen) de imageUtils
```

### **4. Backend Inconsistente**

```javascript
// ❌ NO usar multer si otros módulos no lo usan
router.post("/", upload.single("imagen"), async (req, res) => {
  const imagen = req.file ? req.file.filename : null;
});

// ✅ Seguir el patrón establecido (JSON)
router.post("/", async (req, res) => {
  const { imagen } = req.body; // ✅ Consistente con otros módulos
});
```

---

## 📚 **CHECKLIST PARA NUEVOS MÓDULOS**

### **Frontend:**

- [ ] Usar `Card` y `CardHeader` para el header del módulo
- [ ] Implementar `Grid` layout para filtros con `fullWidth`
- [ ] Incluir botón "Limpiar" en los filtros
- [ ] Usar `ListItemIcon` y `ListItemText` en menús contextuales
- [ ] Un solo estado `loading` para todas las operaciones
- [ ] Llamar `onSaveSuccess()` antes de `Swal.fire()`
- [ ] Usar `getImageUrl()` de `imageUtils` para imágenes
- [ ] Validar tipos y tamaños de archivos en subida de imágenes

### **Backend:**

- [ ] Recibir JSON en lugar de `multipart/form-data` para módulos simples
- [ ] Implementar validaciones de campos obligatorios
- [ ] Verificar unicidad de campos únicos
- [ ] Manejar errores con respuestas consistentes
- [ ] Usar el patrón de respuesta `{ success: boolean, message: string, data: object }`

### **Integración:**

- [ ] Agregar ruta en `AdminLayout.js`
- [ ] Verificar que el menú esté en `AdminSidebar.js`
- [ ] Implementar servicio en `apiService.js`
- [ ] Seguir patrones de colores y estilos establecidos

---

**Última actualización**: 2025-01-16
**Versión**: 1.0
**Estado**: ✅ Patrones establecidos y documentados


