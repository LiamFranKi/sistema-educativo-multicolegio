@echo off
REM Script de instalación para Windows
REM Sistema Educativo Multi-Colegio

echo.
echo ================================
echo Sistema Educativo Multi-Colegio
echo ================================
echo.

echo [INFO] Iniciando instalación...

REM Verificar Node.js
echo.
echo ================================
echo Verificando Node.js
echo ================================
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no encontrado. Por favor instala Node.js 16 o superior.
    echo [INFO] Visita: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [INFO] Node.js encontrado: %NODE_VERSION%
)

REM Verificar npm
echo.
echo ================================
echo Verificando npm
echo ================================
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no encontrado. Por favor instala npm.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [INFO] npm encontrado: %NPM_VERSION%
)

REM Verificar PostgreSQL
echo.
echo ================================
echo Verificando PostgreSQL
echo ================================
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL no encontrado. Necesitaras instalarlo para usar la base de datos.
    echo [INFO] Descarga desde: https://www.postgresql.org/download/windows/
) else (
    for /f "tokens=*" %%i in ('psql --version') do set PSQL_VERSION=%%i
    echo [INFO] PostgreSQL encontrado: %PSQL_VERSION%
)

REM Instalar dependencias del proyecto principal
echo.
echo ================================
echo Instalando dependencias del proyecto principal
echo ================================
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias del proyecto principal
    pause
    exit /b 1
) else (
    echo [INFO] Dependencias del proyecto principal instaladas
)

REM Instalar dependencias del frontend
echo.
echo ================================
echo Instalando dependencias del frontend
echo ================================
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias del frontend
    pause
    exit /b 1
) else (
    echo [INFO] Dependencias del frontend instaladas
)
cd ..

REM Instalar dependencias del backend
echo.
echo ================================
echo Instalando dependencias del backend
echo ================================
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias del backend
    pause
    exit /b 1
) else (
    echo [INFO] Dependencias del backend instaladas
)
cd ..

REM Crear archivo .env si no existe
echo.
echo ================================
echo Configurando archivos de entorno
echo ================================
if not exist "backend\.env" (
    if exist "backend\env.example" (
        copy "backend\env.example" "backend\.env" >nul
        echo [INFO] Archivo .env creado desde env.example
        echo [WARNING] Recuerda editar backend\.env con tus credenciales de PostgreSQL
    ) else (
        echo [WARNING] Archivo env.example no encontrado
    )
) else (
    echo [INFO] Archivo .env ya existe
)

REM Crear directorios necesarios
echo.
echo ================================
echo Creando directorios necesarios
echo ================================
if not exist "backend\uploads" mkdir "backend\uploads"
if not exist "backend\logs" mkdir "backend\logs"
echo [INFO] Directorios creados

REM Verificar estructura del proyecto
echo.
echo ================================
echo Verificando estructura del proyecto
echo ================================
if exist "frontend" (
    echo [INFO] Directorio frontend encontrado
) else (
    echo [WARNING] Directorio frontend no encontrado
)

if exist "backend" (
    echo [INFO] Directorio backend encontrado
) else (
    echo [WARNING] Directorio backend no encontrado
)

if exist "migrations" (
    echo [INFO] Directorio migrations encontrado
) else (
    echo [WARNING] Directorio migrations no encontrado
)

REM Mostrar próximos pasos
echo.
echo ================================
echo Instalacion Completada
echo ================================
echo [INFO] ¡Instalación completada exitosamente!
echo.
echo [INFO] Próximos pasos:
echo 1. Configurar PostgreSQL y crear la base de datos 'sistema_educativo_multicolegio'
echo 2. Editar backend\.env con tus credenciales de PostgreSQL
echo 3. Ejecutar las migraciones SQL en la carpeta migrations/
echo 4. Iniciar el proyecto con: npm run dev
echo.
echo [INFO] Comandos útiles:
echo - npm run dev          # Iniciar frontend y backend
echo - npm start            # Solo frontend
echo - npm run backend      # Solo backend
echo - npm run build        # Construir para producción
echo.
echo [INFO] Para más información, consulta el README.md
echo.
pause
