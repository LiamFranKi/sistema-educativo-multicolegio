# Patrones de Diseño - Página Web CMS

## 📋 Resumen General

Patrones específicos para el diseño y desarrollo de la página web administrable del sistema educativo.

---

## 🎨 Patrones de Diseño Visual

### 🎯 **Header Administrable**

#### 📐 **Estructura del Header**

```html
<div class="header-container">
  <!-- Barra Superior (Azul) -->
  <div class="header-top-bar">
    <!-- Redes Sociales + Contacto + Intranet -->
  </div>

  <!-- Barra Principal (Blanca) -->
  <div class="header-main-bar">
    <!-- Logo + Navegación -->
  </div>
</div>
```

#### 🎨 **Colores del Header**

- **Barra Superior**: `#1A4060` (Azul oscuro)
- **Barra Principal**: `#FFFFFF` (Blanco)
- **Menú Activo**: `#1A4060` (Azul oscuro)
- **Menú Hover**: `#1A4060` (Mismo color que activo)
- **Texto**: `#333333` (Gris oscuro)

#### 📱 **Responsive del Header**

- **Desktop**: Layout horizontal completo
- **Tablet**: Adaptación automática
- **Mobile**: Elementos apilados, menú hamburguesa

### 🎯 **Elementos Administrables**

#### 🏢 **Logo Principal**

- **Ubicación**: `frontend/src/assets/images/logo-vanguard.png`
- **Dimensiones**: 3116x1382px (proporción 2.25:1)
- **Altura en header**: 75px
- **Filtro**: `brightness(0) invert(1)` para blanco

#### 📞 **Información de Contacto**

- **Dirección**: "Av. Principal 123, Lima, Perú"
- **Teléfonos**: "+51 987 654 321" / "+51 1 234 5678"
- **Iconos**: 🏫 (ubicación), 📞 (teléfono)
- **Color**: Blanco con filtro `brightness(0) invert(1)`

#### 🌐 **Redes Sociales**

- **Iconos**: 28x28px
- **Ubicación**: `docs/diseños/icons/`
- **Archivos**: `facebook-white.png`, `instagram-white.png`, `tiktok-white.png`, `youtube-white.png`
- **Hover**: Escala 1.1 y opacidad 0.8

#### 🔗 **Botón Intranet**

- **Texto**: "Intranet"
- **Icono**: 👥 (dos usuarios)
- **Estilo**: Píldora con gradiente azul
- **Borde**: 2px sólido blanco
- **Hover**: Glow y transformación

#### 🧭 **Navegación Principal**

- **Menús**: Home, Niveles, Documentos, Preguntas Frecuentes, Trabaja con Nosotros, Contacto
- **Estado Activo**: Fondo azul, texto blanco
- **Estado Hover**: Mismo color que activo
- **Transición**: 0.2s ease-in-out

---

## 🗃️ Patrones de Base de Datos

### 🎯 **Tabla: `configuracion_web`**

```sql
CREATE TABLE configuracion_web (
    id SERIAL PRIMARY KEY,
    logo_principal VARCHAR(255),
    color_principal VARCHAR(7) DEFAULT '#1A4060',
    direccion TEXT,
    telefono_1 VARCHAR(20),
    telefono_2 VARCHAR(20),
    email_contacto VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🎯 **Tabla: `redes_sociales`**

```sql
CREATE TABLE redes_sociales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    icono VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🎯 **Tabla: `menu_navegacion`**

```sql
CREATE TABLE menu_navegacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    url VARCHAR(255),
    orden INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🎯 **Tabla: `contenido_paginas`**

```sql
CREATE TABLE contenido_paginas (
    id SERIAL PRIMARY KEY,
    pagina VARCHAR(100) NOT NULL,
    seccion VARCHAR(100) NOT NULL,
    titulo VARCHAR(255),
    contenido TEXT,
    imagen VARCHAR(255),
    orden INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Patrones de Implementación

### 🎯 **Componentes React**

#### 📁 **Estructura de Componentes**

```
frontend/src/pages/PaginaWeb/
├── components/
│   ├── Header/
│   │   ├── HeaderTopBar.js
│   │   ├── HeaderMainBar.js
│   │   └── NavigationMenu.js
│   ├── Body/
│   │   ├── HeroSection.js
│   │   ├── AboutSection.js
│   │   └── ContactSection.js
│   └── Footer/
│       └── Footer.js
├── admin/
│   ├── WebConfigForm.js
│   ├── SocialMediaManager.js
│   └── MenuManager.js
└── index.js
```

#### 🎯 **Patrón de Componente Header**

```jsx
const Header = () => {
  const [config, setConfig] = useState({});
  const [socialMedia, setSocialMedia] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  return (
    <div className="header-container">
      <HeaderTopBar config={config} socialMedia={socialMedia} />
      <HeaderMainBar config={config} menuItems={menuItems} />
    </div>
  );
};
```

### 🎯 **Patrones de API**

#### 📡 **Endpoints del CMS**

```javascript
// Configuración general
GET    /api/web/config
PUT    /api/web/config

// Redes sociales
GET    /api/web/social-media
POST   /api/web/social-media
PUT    /api/web/social-media/:id
DELETE /api/web/social-media/:id

// Menú de navegación
GET    /api/web/menu
POST   /api/web/menu
PUT    /api/web/menu/:id
DELETE /api/web/menu/:id

// Contenido de páginas
GET    /api/web/content/:page
PUT    /api/web/content/:page
```

---

## 🎨 Patrones de CSS

### 🎯 **Variables CSS**

```css
:root {
  --color-primary: #1a4060;
  --color-secondary: #3470b3;
  --color-text: #333333;
  --color-white: #ffffff;
  --color-gray: #666666;

  --font-family: "Roboto", sans-serif;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;

  --border-radius: 6px;
  --transition: all 0.2s ease-in-out;
}
```

### 🎯 **Clases Utilitarias**

```css
.text-primary {
  color: var(--color-primary);
}
.bg-primary {
  background-color: var(--color-primary);
}
.text-white {
  color: var(--color-white);
}
.bg-white {
  background-color: var(--color-white);
}

.transition {
  transition: var(--transition);
}
.rounded {
  border-radius: var(--border-radius);
}

.hover-scale:hover {
  transform: scale(1.1);
}
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(26, 64, 96, 0.3);
}
```

---

## 📱 Patrones Responsive

### 🎯 **Breakpoints**

```css
/* Mobile First */
@media (min-width: 768px) {
  /* Tablet */
}
@media (min-width: 1024px) {
  /* Desktop */
}
@media (min-width: 1440px) {
  /* Large Desktop */
}
```

### 🎯 **Grid Responsive**

```css
.header-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .header-grid {
    grid-template-columns: 1fr auto 1fr;
  }
}
```

---

## 🔄 Patrones de Estado

### 🎯 **Estado del CMS**

```javascript
const [webConfig, setWebConfig] = useState({
  logo: "",
  color: "#1A4060",
  address: "",
  phones: [],
  email: "",
});

const [socialMedia, setSocialMedia] = useState([]);
const [menuItems, setMenuItems] = useState([]);
const [pageContent, setPageContent] = useState({});
```

### 🎯 **Patrón de Actualización**

```javascript
const updateConfig = async (newConfig) => {
  try {
    await apiService.updateWebConfig(newConfig);
    setWebConfig(newConfig);
    showSuccess("Configuración actualizada");
  } catch (error) {
    showError("Error al actualizar");
  }
};
```

---

## 🎯 Mejores Prácticas

### ✅ **Do's**

- Usar variables CSS para colores
- Implementar lazy loading para imágenes
- Validar datos en frontend y backend
- Usar TypeScript para tipado
- Implementar cache para contenido estático
- Optimizar imágenes (WebP, lazy loading)

### ❌ **Don'ts**

- No hardcodear colores en componentes
- No cargar todas las imágenes al inicio
- No omitir validaciones de seguridad
- No usar estilos inline
- No olvidar el SEO
- No ignorar la accesibilidad

---

_Última actualización: 2025-01-19_
_Versión: 1.0.0_
_Estado: En desarrollo_


