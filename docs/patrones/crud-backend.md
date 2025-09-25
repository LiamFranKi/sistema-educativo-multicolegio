# 🔧 PATRÓN CRUD - BACKEND API

## 📋 **1. ESTRUCTURA DE RUTAS**

### **Archivo de Rutas Estándar:**
```javascript
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');

// GET /api/[modulo] - Listar todos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', filter = '' } = req.query;
    const offset = (page - 1) * limit;
    
    // Construir query dinámicamente
    let query = 'SELECT * FROM [tabla] WHERE 1=1';
    let params = [];
    let paramCount = 0;
    
    // Búsqueda
    if (search) {
      paramCount++;
      query += ` AND (nombre ILIKE $${paramCount} OR descripcion ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    
    // Filtro
    if (filter) {
      paramCount++;
      query += ` AND activo = $${paramCount}`;
      params.push(filter === 'activo');
    }
    
    // Count query (antes del ORDER BY)
    const countQuery = `SELECT COUNT(*) FROM (${query}) as count_query`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    // ORDER BY y paginación
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo [modulo]:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/[modulo]/:id - Obtener por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM [tabla] WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '[Módulo] no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error obteniendo [modulo]:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/[modulo] - Crear nuevo
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, descripcion, activo = true } = req.body;
    
    // Validaciones
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }
    
    // Verificar unicidad
    const checkQuery = 'SELECT id FROM [tabla] WHERE nombre = $1';
    const checkResult = await pool.query(checkQuery, [nombre.trim()]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un [módulo] con ese nombre'
      });
    }
    
    // Insertar
    const insertQuery = `
      INSERT INTO [tabla] (nombre, descripcion, activo, created_at, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [nombre.trim(), descripcion?.trim() || '', activo]);
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: '[Módulo] creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando [modulo]:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/[modulo]/:id - Actualizar
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;
    
    // Verificar existencia
    const checkQuery = 'SELECT * FROM [tabla] WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '[Módulo] no encontrado'
      });
    }
    
    // Validaciones
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }
    
    // Verificar unicidad (excluyendo el actual)
    const uniqueQuery = 'SELECT id FROM [tabla] WHERE nombre = $1 AND id != $2';
    const uniqueResult = await pool.query(uniqueQuery, [nombre.trim(), id]);
    
    if (uniqueResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un [módulo] con ese nombre'
      });
    }
    
    // Actualizar
    const updateQuery = `
      UPDATE [tabla] 
      SET nombre = $1, descripcion = $2, activo = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(updateQuery, [nombre.trim(), descripcion?.trim() || '', activo, id]);
    
    res.json({
      success: true,
      data: result.rows[0],
      message: '[Módulo] actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando [modulo]:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/[modulo]/:id - Eliminar
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar existencia
    const checkQuery = 'SELECT * FROM [tabla] WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '[Módulo] no encontrado'
      });
    }
    
    // Eliminar
    const deleteQuery = 'DELETE FROM [tabla] WHERE id = $1';
    await pool.query(deleteQuery, [id]);
    
    res.json({
      success: true,
      message: '[Módulo] eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando [modulo]:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
```

---

## 🗄️ **2. ESTRUCTURA DE BASE DE DATOS**

### **Tabla Estándar:**
```sql
CREATE TABLE IF NOT EXISTS [tabla] (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints específicos del módulo
    CONSTRAINT chk_[tabla]_nombre CHECK (LENGTH(nombre) >= 2)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_[tabla]_nombre ON [tabla](nombre);
CREATE INDEX IF NOT EXISTS idx_[tabla]_activo ON [tabla](activo);
CREATE INDEX IF NOT EXISTS idx_[tabla]_created_at ON [tabla](created_at);

-- Comentarios
COMMENT ON TABLE [tabla] IS 'Tabla de [módulo] del sistema';
COMMENT ON COLUMN [tabla].nombre IS 'Nombre único del [módulo]';
COMMENT ON COLUMN [tabla].descripcion IS 'Descripción detallada del [módulo]';
COMMENT ON COLUMN [tabla].activo IS 'Estado del [módulo] (activo/inactivo)';
```

---

## 🔐 **3. MIDDLEWARE DE AUTENTICACIÓN**

### **Uso Estándar:**
```javascript
const authenticateToken = require('../middleware/auth');

// Aplicar a todas las rutas
router.use(authenticateToken);

// O aplicar a rutas específicas
router.get('/', authenticateToken, handler);
router.post('/', authenticateToken, handler);
```

---

## 📊 **4. VALIDACIONES COMUNES**

### **Validaciones de Entrada:**
```javascript
// Validación de nombre
if (!nombre || !nombre.trim()) {
  return res.status(400).json({
    success: false,
    message: 'El nombre es requerido'
  });
}

// Validación de longitud
if (nombre.trim().length < 2) {
  return res.status(400).json({
    success: false,
    message: 'El nombre debe tener al menos 2 caracteres'
  });
}

// Validación de unicidad
const checkQuery = 'SELECT id FROM [tabla] WHERE nombre = $1';
const checkResult = await pool.query(checkQuery, [nombre.trim()]);
if (checkResult.rows.length > 0) {
  return res.status(400).json({
    success: false,
    message: 'Ya existe un [módulo] con ese nombre'
  });
}
```

---

## 🚨 **5. MANEJO DE ERRORES**

### **Estructura Estándar:**
```javascript
try {
  // Lógica del endpoint
} catch (error) {
  console.error('Error [operación] [modulo]:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
}
```

### **Respuestas Estándar:**
```javascript
// Éxito
res.json({
  success: true,
  data: result.rows[0],
  message: 'Operación exitosa'
});

// Error de validación
res.status(400).json({
  success: false,
  message: 'Mensaje de error específico'
});

// No encontrado
res.status(404).json({
  success: false,
  message: '[Módulo] no encontrado'
});

// Error del servidor
res.status(500).json({
  success: false,
  message: 'Error interno del servidor'
});
```

---

**Última actualización**: 2025-01-16  
**Versión**: 1.0  
**Estado**: ✅ Patrón establecido y funcional



