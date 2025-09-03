#!/bin/bash

# Script de instalación para Linux/Mac
# Sistema Educativo Multi-Colegio

echo "🚀 Iniciando instalación del Sistema Educativo Multi-Colegio..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Verificar Node.js
print_header "Verificando Node.js"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_message "Node.js encontrado: $NODE_VERSION"

    # Verificar versión mínima (16.0.0)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 16 ]; then
        print_error "Node.js versión 16 o superior requerida. Versión actual: $NODE_VERSION"
        exit 1
    fi
else
    print_error "Node.js no encontrado. Por favor instala Node.js 16 o superior."
    print_message "Visita: https://nodejs.org/"
    exit 1
fi

# Verificar npm
print_header "Verificando npm"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_message "npm encontrado: $NPM_VERSION"
else
    print_error "npm no encontrado. Por favor instala npm."
    exit 1
fi

# Verificar PostgreSQL
print_header "Verificando PostgreSQL"
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    print_message "PostgreSQL encontrado: $PSQL_VERSION"
else
    print_warning "PostgreSQL no encontrado. Necesitarás instalarlo para usar la base de datos."
    print_message "Instalación en Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    print_message "Instalación en macOS: brew install postgresql"
fi

# Instalar dependencias del proyecto principal
print_header "Instalando dependencias del proyecto principal"
if npm install; then
    print_message "✅ Dependencias del proyecto principal instaladas"
else
    print_error "❌ Error instalando dependencias del proyecto principal"
    exit 1
fi

# Instalar dependencias del frontend
print_header "Instalando dependencias del frontend"
cd frontend
if npm install; then
    print_message "✅ Dependencias del frontend instaladas"
else
    print_error "❌ Error instalando dependencias del frontend"
    exit 1
fi
cd ..

# Instalar dependencias del backend
print_header "Instalando dependencias del backend"
cd backend
if npm install; then
    print_message "✅ Dependencias del backend instaladas"
else
    print_error "❌ Error instalando dependencias del backend"
    exit 1
fi
cd ..

# Crear archivo .env si no existe
print_header "Configurando archivos de entorno"
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/env.example" ]; then
        cp backend/env.example backend/.env
        print_message "✅ Archivo .env creado desde env.example"
        print_warning "⚠️  Recuerda editar backend/.env con tus credenciales de PostgreSQL"
    else
        print_warning "⚠️  Archivo env.example no encontrado"
    fi
else
    print_message "✅ Archivo .env ya existe"
fi

# Crear directorio de uploads
print_header "Creando directorios necesarios"
mkdir -p backend/uploads
mkdir -p backend/logs
print_message "✅ Directorios creados"

# Verificar estructura del proyecto
print_header "Verificando estructura del proyecto"
REQUIRED_DIRS=("frontend" "backend" "migrations")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_message "✅ Directorio $dir encontrado"
    else
        print_warning "⚠️  Directorio $dir no encontrado"
    fi
done

# Mostrar próximos pasos
print_header "Instalación Completada"
print_message "🎉 ¡Instalación completada exitosamente!"
echo ""
print_message "Próximos pasos:"
echo "1. Configurar PostgreSQL y crear la base de datos 'sistema_educativo_multicolegio'"
echo "2. Editar backend/.env con tus credenciales de PostgreSQL"
echo "3. Ejecutar las migraciones SQL en la carpeta migrations/"
echo "4. Iniciar el proyecto con: npm run dev"
echo ""
print_message "Comandos útiles:"
echo "- npm run dev          # Iniciar frontend y backend"
echo "- npm start            # Solo frontend"
echo "- npm run backend      # Solo backend"
echo "- npm run build        # Construir para producción"
echo ""
print_message "Para más información, consulta el README.md"
