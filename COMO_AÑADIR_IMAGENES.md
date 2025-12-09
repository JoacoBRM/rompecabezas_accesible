# Cómo Añadir Más Imágenes y Categorías

## 📋 Resumen

Este documento explica cómo añadir nuevas categorías e imágenes al juego de rompecabezas accesible.

## 🎯 Método 1: Añadir una Nueva Categoría

### Paso 1: Editar `js/game.js`

Abre el archivo `js/game.js` y busca el objeto `categories` (aproximadamente en la línea 11-35). Añade una nueva categoría siguiendo este formato:

```javascript
const categories = {
    animales: {
        name: 'Animales',
        image: 'URL_DE_LA_IMAGEN',
        description: 'León majestuoso'
    },
    paisajes: {
        name: 'Paisajes',
        image: 'URL_DE_LA_IMAGEN',
        description: 'Montañas nevadas'
    },
    // ... categorías existentes ...
    
    // ✨ NUEVA CATEGORÍA - Añade aquí
    deportes: {
        name: 'Deportes',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        description: 'Fútbol en acción'
    }
};
```

**Campos importantes:**
- `deportes`: Clave única para la categoría (sin espacios, minúsculas)
- `name`: Nombre que se mostrará al usuario
- `image`: URL de la imagen (ver opciones abajo)
- `description`: Descripción breve de la imagen

### Paso 2: Editar `game.html`

Abre el archivo `game.html` y busca la sección `<div class="category-grid">` (aproximadamente en la línea 22). Añade una nueva tarjeta de categoría:

```html
<div class="category-card" tabindex="0" role="button" 
     onclick="selectCategory('deportes')" 
     onkeydown="if(event.key==='Enter' || event.key===' '){event.preventDefault(); selectCategory('deportes');}"
     aria-label="Categoría Deportes: Fútbol en acción">
    <div class="category-image" style="background-image: url('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80');"></div>
    <h2>⚽ Deportes</h2>
    <p>Fútbol en acción</p>
</div>
```

**Asegúrate de:**
- Usar la misma clave (`deportes`) en `onclick` y `selectCategory()`
- La URL de la imagen debe coincidir con la del archivo JS
- Actualizar el `aria-label` para accesibilidad
- Añadir un emoji apropiado (opcional pero recomendado)

### Paso 3: ¡Listo!

Guarda ambos archivos y recarga la página. Tu nueva categoría debería aparecer en la pantalla de selección.

---

## 🖼️ Opciones para Obtener Imágenes

### Opción 1: Unsplash (Recomendado - Gratis)

Unsplash ofrece imágenes de alta calidad gratuitas:

1. Visita [https://unsplash.com](https://unsplash.com)
2. Busca la imagen que desees (ej: "soccer", "mountains", "food")
3. Haz clic en la imagen
4. Copia la URL de la imagen
5. Añade parámetros de optimización: `?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`

**Ejemplo completo:**
```
https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80
```

### Opción 2: Imágenes Locales

Si prefieres usar tus propias imágenes:

1. Guarda la imagen en la carpeta `assets/` del proyecto
2. Usa una ruta relativa en lugar de URL:

```javascript
deportes: {
    name: 'Deportes',
    image: 'assets/futbol.jpg',  // ← Ruta local
    description: 'Fútbol en acción'
}
```

**Recomendaciones para imágenes locales:**
- Tamaño: 600x600 píxeles (cuadrada)
- Formato: JPG o PNG
- Peso: Menos de 200KB para mejor rendimiento

### Opción 3: Otras Fuentes Gratuitas

- **Pexels**: [https://www.pexels.com](https://www.pexels.com)
- **Pixabay**: [https://pixabay.com](https://pixabay.com)
- **Freepik**: [https://www.freepik.com](https://www.freepik.com) (requiere atribución)

---

## 🎨 Cambiar la Imagen de una Categoría Existente

Para cambiar solo la imagen de una categoría existente (sin añadir una nueva):

1. Encuentra la nueva URL de la imagen que deseas usar
2. Edita `js/game.js` y actualiza el campo `image`:

```javascript
animales: {
    name: 'Animales',
    image: 'NUEVA_URL_AQUI',  // ← Cambia esta línea
    description: 'León majestuoso'
}
```

3. Edita `game.html` y actualiza el `style` de la tarjeta correspondiente:

```html
<div class="category-image" style="background-image: url('NUEVA_URL_AQUI');"></div>
```

---

## 📝 Ejemplo Completo: Añadir Categoría "Naturaleza"

### En `js/game.js`:
```javascript
const categories = {
    // ... categorías existentes ...
    
    naturaleza: {
        name: 'Naturaleza',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        description: 'Bosque verde'
    }
};
```

### En `game.html`:
```html
<div class="category-card" tabindex="0" role="button" 
     onclick="selectCategory('naturaleza')" 
     onkeydown="if(event.key==='Enter' || event.key===' '){event.preventDefault(); selectCategory('naturaleza');}"
     aria-label="Categoría Naturaleza: Bosque verde">
    <div class="category-image" style="background-image: url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80');"></div>
    <h2>🌲 Naturaleza</h2>
    <p>Bosque verde</p>
</div>
```

---

## ⚠️ Consejos Importantes

1. **URLs deben ser HTTPS**: Asegúrate de que las URLs comiencen con `https://`
2. **Imágenes cuadradas**: Funcionan mejor para el rompecabezas
3. **Coherencia**: Usa la misma URL en ambos archivos (JS y HTML)
4. **Accesibilidad**: Siempre actualiza el `aria-label` con una descripción clara
5. **Prueba**: Después de añadir una categoría, prueba que funcione correctamente

---

## 🔧 Solución de Problemas

**Problema: La imagen no se muestra**
- Verifica que la URL sea correcta y accesible
- Asegúrate de que la URL comience con `https://`
- Comprueba que no haya errores de tipeo

**Problema: La categoría no aparece**
- Verifica que añadiste el código en ambos archivos (JS y HTML)
- Asegúrate de que la clave de categoría coincida en ambos lugares
- Revisa la consola del navegador (F12) para ver errores

**Problema: El rompecabezas no usa la imagen correcta**
- Verifica que la URL en `game.js` sea exactamente igual a la de `game.html`
- Recarga la página con Ctrl+F5 (limpia caché)

---

## 📚 Recursos Adicionales

- **Emojis para categorías**: [https://emojipedia.org](https://emojipedia.org)
- **Paleta de colores**: Puedes personalizar los colores en `css/styles.css`
- **Más información sobre accesibilidad**: [https://www.w3.org/WAI/](https://www.w3.org/WAI/)
