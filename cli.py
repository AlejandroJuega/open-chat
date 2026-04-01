"""
Interfaz de línea de comandos para OpenChat
"""

import sys
import argparse
from pathlib import Path

from .installer import Installer, install
from .server import Server, start_server


def cli():
    """Punto de entrada principal para la CLI"""
    parser = argparse.ArgumentParser(
        description="OpenChat - Chat AI con LM Studio",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  openchat install          Instala las dependencias de Node.js
  openchat install --clean Reinstalación limpia
  openchat run              Inicia el servidor de desarrollo
  openchat check            Verifica la instalación
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Comandos disponibles")
    
    # Comando: install
    install_parser = subparsers.add_parser("install", help="Instala las dependencias")
    install_parser.add_argument(
        "--clean", 
        action="store_true",
        help="Reinstalación limpia (elimina node_modules)"
    )
    install_parser.add_argument(
        "--path",
        type=str,
        default=None,
        help="Ruta al proyecto (por defecto: directorio actual)"
    )
    
    # Comando: run
    run_parser = subparsers.add_parser("run", help="Inicia el servidor de desarrollo")
    run_parser.add_argument(
        "--port", 
        type=int, 
        default=5173,
        help="Puerto del servidor (por defecto: 5173)"
    )
    run_parser.add_argument(
        "--no-browser",
        action="store_true",
        help="No abrir el navegador automáticamente"
    )
    run_parser.add_argument(
        "--path",
        type=str,
        default=None,
        help="Ruta al proyecto (por defecto: directorio actual)"
    )
    
    # Comando: check
    check_parser = subparsers.add_parser("check", help="Verifica la instalación")
    check_parser.add_argument(
        "--path",
        type=str,
        default=None,
        help="Ruta al proyecto (por defecto: directorio actual)"
    )
    
    # Comando: stop
    stop_parser = subparsers.add_parser("stop", help="Detiene el servidor")
    
    args = parser.parse_args()
    
    if args.command is None:
        # Sin comando: mostrar ayuda y hacer install + run
        print("🎯 OpenChat - Chat AI con LM Studio\n")
        
        # Hacer instalación y ejecución
        installer = Installer(args.path if hasattr(args, 'path') else None)
        
        if not installer.check_node():
            sys.exit(1)
        
        if not installer.install_dependencies():
            sys.exit(1)
        
        if installer.verify_installation():
            server = Server(args.path if hasattr(args, 'path') else None)
            try:
                server.start(open_browser=True)
                input("\nPresiona Enter para detener el servidor...")
            except KeyboardInterrupt:
                server.stop()
        else:
            sys.exit(1)
    
    elif args.command == "install":
        installer = Installer(args.path)
        
        if not installer.check_node():
            sys.exit(1)
        
        success = installer.install_dependencies(clean=args.clean)
        sys.exit(0 if success else 1)
    
    elif args.command == "run":
        server = Server(args.path, port=args.port)
        
        if not server.start(open_browser=not args.no_browser):
            sys.exit(1)
        
        try:
            input("\nPresiona Enter para detener el servidor...")
        except KeyboardInterrupt:
            pass
        finally:
            server.stop()
    
    elif args.command == "check":
        installer = Installer(args.path)
        
        print("🔍 Verificando instalación...\n")
        
        checks = [
            ("Node.js", installer.check_node()),
            ("npm", installer.check_npm()),
            ("package.json", installer.package_json.exists()),
            ("node_modules", installer.node_modules.exists()),
        ]
        
        all_passed = True
        for name, result in checks:
            status = "✓" if result else "✗"
            print(f"  {status} {name}")
            if not result:
                all_passed = False
        
        if all_passed:
            print("\n✓ Instalación completa")
            if installer.verify_installation():
                print("\n🚀 Ejecuta 'openchat run' para iniciar")
        else:
            print("\n✗ Instalación incompleta")
            print("\n💡 Ejecuta 'openchat install' para instalar dependencias")
            sys.exit(1)
    
    elif args.command == "stop":
        print("🛑 Para detener el servidor, presiona Ctrl+C en la terminal donde está ejecutándose")


def main():
    """Entry point para el paquete"""
    try:
        cli()
    except KeyboardInterrupt:
        print("\n\n👋 ¡Hasta luego!")
        sys.exit(0)


if __name__ == "__main__":
    main()
