"""
Servidor de desarrollo para OpenChat
"""

import os
import sys
import subprocess
import threading
import time
import webbrowser
from pathlib import Path
from typing import Optional


class Server:
    """Maneja el servidor de desarrollo de Vite"""
    
    def __init__(self, project_path: str = None, port: int = 5173):
        if project_path is None:
            self.project_path = Path(__file__).parent.parent
        else:
            self.project_path = Path(project_path)
        
        self.port = port
        self.process: Optional[subprocess.Popen] = None
        self._output_lines = []
    
    def is_running(self) -> bool:
        """Verifica si el servidor está ejecutándose"""
        return self.process is not None and self.process.poll() is None
    
    def start(self, open_browser: bool = True, verbose: bool = False) -> bool:
        """Inicia el servidor de desarrollo"""
        if self.is_running():
            print("⚠️  El servidor ya está ejecutándose")
            return True
        
        print(f"\n🚀 Iniciando servidor en http://localhost:{self.port}")
        print("   Presiona Ctrl+C para detener\n")
        
        try:
            # Detectar el ejecutable de vite
            vite_bin = self.project_path / "node_modules" / "vite" / "bin" / "vite.js"
            
            if not vite_bin.exists():
                print("✗ Vite no está instalado. Ejecuta: openchat install")
                return False
            
            # Comando para iniciar el servidor
            cmd = ["node", str(vite_bin)]
            
            self.process = subprocess.Popen(
                cmd,
                cwd=str(self.project_path),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            
            # Hilo para leer la salida
            def read_output():
                for line in self.process.stdout:
                    self._output_lines.append(line)
                    if verbose:
                        print(line, end='')
                    
                    # Detectar cuando el servidor está listo
                    if "Local:" in line or "localhost" in line:
                        if open_browser and "ready in" in line.lower() or "compiled" in line.lower():
                            time.sleep(1)  # Esperar un poco más
                            try:
                                webbrowser.open(f"http://localhost:{self.port}")
                            except:
                                pass
            
            output_thread = threading.Thread(target=read_output, daemon=True)
            output_thread.start()
            
            # Abrir navegador automáticamente
            if open_browser:
                time.sleep(2)
                try:
                    webbrowser.open(f"http://localhost:{self.port}")
                except:
                    pass
            
            return True
            
        except Exception as e:
            print(f"✗ Error al iniciar el servidor: {e}")
            return False
    
    def stop(self):
        """Detiene el servidor"""
        if self.process and self.is_running():
            print("\n🛑 Deteniendo servidor...")
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()
            self.process = None
            print("✓ Servidor detenido")
    
    def get_output(self) -> list:
        """Obtiene las líneas de salida del servidor"""
        return self._output_lines.copy()


def start_server(project_path: str = None, port: int = 5173, 
                 open_browser: bool = True) -> Server:
    """Función de conveniencia para iniciar el servidor"""
    server = Server(project_path, port)
    server.start(open_browser=open_browser)
    return server
