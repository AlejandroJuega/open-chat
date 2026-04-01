#!/bin/bash

# OpenChat - AI Chat con LM Studio

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║      OpenChat - AI Chat con LM Studio     ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Obtener directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Verificar Python
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "✗ Python no está instalado"
        echo ""
        echo "Descárgalo de: https://www.python.org/downloads/"
        exit 1
    fi
    PYTHON=python
else
    PYTHON=python3
fi

echo "✓ Python encontrado: $($PYTHON --version)"
echo ""

# Instalar librería si no está
if ! $PYTHON -c "import openchat" 2> /dev/null; then
    echo "📦 Instalando OpenChat..."
    pip install -e . > /dev/null 2>&1
    
    if [ $? -ne 0 ]; then
        echo "✗ Error instalando OpenChat"
        exit 1
    fi
    
    echo "✓ OpenChat instalado"
    echo ""
fi

# Ejecutar OpenChat
echo "🚀 Iniciando OpenChat..."
echo ""
$PYTHON -m openchat
