"""
Instalador automático de dependencias de Node.js
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path


class Installer:
    """Maneja la instalación de dependencias de Node.js"""
    
    def __init__(self, project_path: str = None):
        if project_path is None:
            self.project_path = Path(__file__).parent.parent
        else:
            self.project_path = Path(project_path)
        
        self.node_modules = self.project_path / "node_modules"
        self.package_json = self.project_path / "package.json"
    
    def check_node(self) -> bool:
        """Verifica si Node.js está instalado"""
        try:
            result = subprocess.run(
                ["node", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                print(f"✓ Node.js versión: {result.stdout.strip()}")
                return True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        
        print("✗ Node.js no está instalado")
        print("  Descárgalo de: https://nodejs.org/")
        return False
    
    def check_npm(self) -> bool:
        """Verifica si npm está instalado"""
        try:
            result = subprocess.run(
                ["npm", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                print(f"✓ npm versión: {result.stdout.strip()}")
                return True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        
        print("✗ npm no está instalado")
        return False
    
    def clean_node_modules(self):
        """Elimina node_modules para reinstalación limpia"""
        if self.node_modules.exists():
            print("🗑️  Limpiando instalación anterior...")
            shutil.rmtree(self.node_modules)
        
        lock_file = self.project_path / "package-lock.json"
        if lock_file.exists():
            lock_file.unlink()
    
    def install_dependencies(self, clean: bool = False) -> bool:
        """Instala las dependencias de npm"""
        if not self.check_node() or not self.check_npm():
            return False
        
        if not self.package_json.exists():
            print(f"✗ No se encontró package.json en {self.project_path}")
            return False
        
        if clean:
            self.clean_node_modules()
        
        print("\n📦 Instalando dependencias...")
        print("  (Esto puede tardar varios minutos la primera vez)\n")
        
        try:
            # Usar registry más rápido si está disponible
            cmd = ["npm", "install", "--legacy-peer-deps"]
            
            result = subprocess.run(
                cmd,
                cwd=str(self.project_path),
                text=True
            )
            
            if result.returncode == 0:
                print("\n✓ Dependencias instaladas correctamente")
                return True
            else:
                print(f"\n✗ Error en npm install:")
                print(result.stderr)
                return False
                
        except Exception as e:
            print(f"\n✗ Error inesperado: {e}")
            return False
    
    def verify_installation(self) -> bool:
        """Verifica que todo está correctamente instalado"""
        required_files = [
            self.node_modules / "vite",
            self.node_modules / "react",
            self.node_modules / "tailwindcss"
        ]
        
        missing = [f for f in required_files if not f.exists()]
        
        if missing:
            print("✗ Instalación incompleta. Faltan:")
            for f in missing:
                print(f"  - {f.name}")
            return False
        
        print("✓ Instalación verificada")
        return True


def install(project_path: str = None, clean: bool = False) -> bool:
    """Función de conveniencia para instalar"""
    installer = Installer(project_path)
    return installer.install_dependencies(clean=clean)
