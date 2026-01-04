# 🍽️ Planificador de Comidas

Una aplicación web profesional para planificar tus comidas semanalmente. Diseñada con un tema oscuro moderno y funcionalidades intuitivas.

## Características

- 📅 Calendario mensual interactivo
- 🍴 Selección de recetas para comida y cena
- 📝 Detalles completos de cada receta (ingredientes y preparación)
- 💾 Almacenamiento local (las selecciones se guardan automáticamente)
- 🎨 Diseño moderno con tema oscuro
- 📱 Diseño responsive

## Estructura del Proyecto

```
ComidaPlanner/
├── index.html          # Página principal
├── styles.css          # Estilos con tema oscuro
├── script.js           # Lógica de la aplicación
├── recetas/            # Carpeta con recetas en formato JSON
│   ├── pasta-carbonara.json
│   ├── pollo-teriyaki.json
│   ├── salmon-horno.json
│   ├── ensalada-cesar.json
│   └── risotto-setas.json
└── README.md
```

## Formato de Recetas

Cada receta debe seguir esta estructura JSON:

```json
{
  "id": "identificador-unico",
  "titulo": "Nombre de la receta",
  "foto": "URL de la imagen",
  "ingredientes": [
    "Ingrediente 1",
    "Ingrediente 2"
  ],
  "preparacion": "Instrucciones paso a paso..."
}
```

## Despliegue en GitHub Pages

1. Crea un repositorio en GitHub
2. Sube todos los archivos del proyecto
3. Ve a **Settings** > **Pages**
4. Selecciona la rama `main` (o `master`) como fuente
5. Tu aplicación estará disponible en: `https://tu-usuario.github.io/ComidaPlanner/`

## Uso

1. **Navegar por el calendario**: Usa las flechas para cambiar de mes
2. **Seleccionar recetas**: Haz clic en cualquier día del calendario
3. **Elegir comida/cena**: Selecciona una receta para cada comida del día
4. **Ver detalles**: Haz doble clic en una receta para ver sus detalles completos
5. **Guardar**: Las selecciones se guardan automáticamente en tu navegador

## Personalización

Para añadir más recetas:
1. Crea un nuevo archivo JSON en la carpeta `recetas/`
2. Sigue el formato establecido
3. Añade la ruta del archivo en el array `recipeFiles` de `script.js`

## Tecnologías

- HTML5
- CSS3 (con variables CSS y diseño moderno)
- JavaScript (ES6+)
- LocalStorage para persistencia de datos

## Licencia

Proyecto personal - Uso libre

