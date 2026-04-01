"""
Setup configuration for OpenChat package
"""

from setuptools import setup, find_packages
from pathlib import Path

# Leer el archivo README
readme_file = Path(__file__).parent / "README.md"
long_description = ""
if readme_file.exists():
    long_description = readme_file.read_text(encoding="utf-8")

setup(
    name="openchat",
    version="1.0.0",
    author="OpenChat Team",
    author_email="team@openchat.local",
    description="Librería Python para ejecutar AI Chat con LM Studio",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/openchat/ai-chat",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    python_requires=">=3.8",
    entry_points={
        "console_scripts": [
            "openchat=openchat.cli:main",
        ],
    },
    include_package_data=True,
    zip_safe=False,
)
