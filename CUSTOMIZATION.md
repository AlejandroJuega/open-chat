# 🎨 Guía de Personalización

Este documento te ayudará a personalizar la interfaz a tu gusto.

---

## 📁 Archivos de Estilos

### Archivo principal: `src/index.css`

Aquí encontrarás todas las variables CSS que puedes modificar.

---

## 🎨 Colores

### Colores Principales

```css
/* === COLORES PRINCIPALES === */
--color-primary: #10a37f;           /* Verde principal - Open AI style */
--color-primary-hover: #0d8a6a;     /* Verde hover */
--color-secondary: #5436da;         /* Azul/púrpura */
--color-accent: #8ab4f8;            /* Acento azul */

/* Para cambiar a tu color preferido: */
--color-primary: #TU_COLOR;         /* Ejemplo: #ff6b6b (rojo coral) */
```

### Fondos y Superficies

```css
/* === FONDO Y SUPERFICIES === */
--bg-primary: #212121;              /* Fondo principal oscuro */
--bg-secondary: #2d2d2d;            /* Fondo sidebar */
--bg-tertiary: #383838;             /* Fondo inputs */
--bg-elevated: #424242;             /* Fondos elevados */

/* Versión clara: */
/*
--bg-primary: #ffffff;
--bg-secondary: #f5f5f5;
--bg-tertiary: #eeeeee;
--bg-elevated: #ffffff;
*/
```

### Texto

```css
/* === TEXTO === */
--text-primary: #ececf1;            /* Texto principal */
--text-secondary: #8a8a8a;         /* Texto secundario */
--text-muted: #5f5f5f;             /* Texto deshabilitado */

/* Versión clara: */
/*
--text-primary: #1a1a1a;
--text-secondary: #666666;
--text-muted: #999999;
*/
```

---

## 📐 Tamaños

### Personalizar tamaños

```css
/* === TAMAÑOS === */
--sidebar-width: 280px;             /* Ancho del sidebar */
--header-height: 64px;              /* Altura del header */
--input-height: 56px;               /* Altura del input */
```

---

## 🔲 Bordes y Sombras

### Redondez

```css
/* === BORDES === */
--radius-sm: 8px;                   /* Bordes pequeños */
--radius-md: 12px;                  /* Bordes medianos */
--radius-lg: 16px;                  /* Bordes grandes */
--radius-full: 9999px;              /* Completamente redondo */
```

### Sombras

```css
/* === SOMBRAS === */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--shadow-md: 0 4px 12px rgba(0,0,0,0.4);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
```

---

## 🎬 Animaciones y Transiciones

### Velocidad de transiciones

```css
/* === TRANSICIONES === */
--transition-fast: 150ms ease;      /* Transiciones rápidas */
--transition-normal: 250ms ease;     /* Transiciones normales */
--transition-slow: 400ms ease;      /* Transiciones lentas */
```

---

## 🌙 Tema Oscuro vs Claro

### Para activar modo claro, modifica en `src/index.css`:

```css
body {
  background-color: var(--bg-primary);  /* Será #ffffff en modo claro */
  color: var(--text-primary);            /* Será #1a1a1a en modo claro */
}
```

---

## 🔧 Cambios Rápidos Comunes

### 1. Cambiar el color principal a rojo:
```css
--color-primary: #ef4444;
--color-primary-hover: #dc2626;
```

### 2. Cambiar el color principal a azul:
```css
--color-primary: #3b82f6;
--color-primary-hover: #2563eb;
```

### 3. Cambiar el color principal a morado:
```css
--color-primary: #8b5cf6;
--color-primary-hover: #7c3aed;
```

### 4. Hacer el sidebar más estrecho:
```css
--sidebar-width: 240px;
```

### 5. Hacer el sidebar más ancho:
```css
--sidebar-width: 320px;
```

### 6. Cambiar el fondo a negro puro:
```css
--bg-primary: #000000;
--bg-secondary: #0a0a0a;
--bg-tertiary: #171717;
```

---

## 📝 Personalización de Componentes

### Botón Principal (src/components/ui/button.jsx)

Para cambiar el estilo del botón principal:

```jsx
// En button.jsx, modifica buttonVariants:
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-[TU_COLOR] text-white hover:bg-[TU_COLOR_HOVER]",
        // ... otras variantes
      },
    },
  }
)
```

### Sidebar (src/components/sidebar/Sidebar.jsx)

Para cambiar el icono o estructura del sidebar, edita este archivo.

### Chat Messages (src/components/chat/ChatMessage.jsx)

Para cambiar cómo se muestran los mensajes, edita este archivo.

---

## 🎯 Paleta de Colores Populares

### Estilo OpenAI (Por defecto)
```css
--color-primary: #10a37f;           /* Verde */
--color-secondary: #5436da;         /* Púrpura */
```

### Estilo Discord
```css
--color-primary: #5865f2;           /* Azul Discord */
--color-secondary: #3ba55c;         /* Verde Discord */
```

### Estilo GitHub Dark
```css
--color-primary: #238636;           /* Verde GitHub */
--color-secondary: #1f6feb;         /* Azul GitHub */
```

### Estilo Nord (Frío)
```css
--color-primary: #88c0d0;           /* Cian frío */
--color-secondary: #81a1c1;         /* Azul frío */
```

### Estilo Dracula (Vampire)
```css
--color-primary: #bd93f9;           /* Púrpura Dracula */
--color-secondary: #ff79c6;         /* Rosa Dracula */
```

---

## 🔍 Cómo Encontrar qué Editar

### 1. Inspeccionar elemento
- Click derecho → "Inspeccionar"
- Encuentra el elemento que quieres cambiar
- Mira su clase CSS

### 2. Buscar en archivos
- `src/index.css` - Estilos globales y variables
- `src/components/` - Componentes React individuales

### 3. Modificar variable CSS
```css
/* En src/index.css */
:root {
  /* Cambia el valor de la variable */
  --color-primary: #nuevo_color;
}
```

---

## 📱 Responsive Design

Para ajustar estilos por tamaño de pantalla:

```css
/* Mobile */
@media (max-width: 640px) {
  --sidebar-width: 100%;
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  --sidebar-width: 240px;
}

/* Desktop */
@media (min-width: 1025px) {
  --sidebar-width: 280px;
}
```

---

## 🆘 ¿Necesitas ayuda?

Si tienes dudas sobre qué cambiar, abre una issue en el repositorio.

---

¡Diviértete personalizando tu chat! 🚀
