"""
OpenChat - Librería Python para ejecutar AI Chat con LM Studio

Instalación automática de dependencias y servidor de desarrollo.
"""

__version__ = "1.0.0"
__author__ = "OpenChat Team"

from .cli import main
from .installer import Installer
from .server import Server

__all__ = ["main", "Installer", "Server", "__version__"]
