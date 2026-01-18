// Estado de la aplicación
let currentDate = new Date();
let selectedDate = null;
let recipes = [];
let mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
let shoppingListChecked = JSON.parse(localStorage.getItem('shoppingListChecked')) || {};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
    renderCalendar();
    setupEventListeners();
    showView('calendar');
});

// Cargar recetas desde archivos JSON
async function loadRecipes() {
    const recipeFiles = [
        'recetas/pasta-carbonara.json',
        'recetas/pollo-teriyaki.json',
        'recetas/salmon-horno.json',
        'recetas/ensalada-cesar.json',
        'recetas/risotto-setas.json',
        'recetas/pasta-bolonesa.json',
        'recetas/judias-verdes-ajo.json',
        'recetas/sopa-castellana.json',
        'recetas/tortilla-patatas.json',
        'recetas/ensalada-uvas-aguacate.json',
        'recetas/entrana-acompanamiento.json',
        'recetas/filete-ruso-tomate.json',
        'recetas/pollo-mediterraneo.json',
        'recetas/paella-marisco.json',
        'recetas/ratatouille.json',
        'recetas/gazpacho.json',
        'recetas/lubina-verduras.json',
        'recetas/pisto-manchego.json',
        'recetas/risotto-setas-espinacas.json',
        'recetas/ensalada-mediterranea.json',
        'recetas/salmon-verduras-horno.json',
        'recetas/pasta-primavera.json',
        'recetas/calabacin-relleno.json',
        'recetas/berenjenas-rellenas.json',
        'recetas/ensalada-fruta-fresca.json',
        'recetas/pollo-setas.json'
    ];

    try {
        const promises = recipeFiles.map(file => 
            fetch(file)
                .then(response => response.json())
                .catch(err => {
                    console.warn(`No se pudo cargar ${file}:`, err);
                    return null;
                })
        );
        
        const loadedRecipes = await Promise.all(promises);
        recipes = loadedRecipes.filter(recipe => recipe !== null);
        console.log('Recetas cargadas:', recipes.length);
    } catch (error) {
        console.error('Error cargando recetas:', error);
    }
}

// Renderizar calendario
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Actualizar título del mes
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    document.getElementById('currentMonth').textContent = 
        `${monthNames[month]} ${year}`;

    // Obtener primer día del mes y número de días
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Lunes = 0

    // Limpiar calendario
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const dateKey = formatDateKey(new Date(year, month - 1, day));
        calendar.appendChild(createDayCell(day, true, dateKey));
    }

    // Días del mes actual
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateKey = formatDateKey(date);
        const isToday = date.toDateString() === today.toDateString();
        calendar.appendChild(createDayCell(day, false, dateKey, isToday));
    }

    // Días del mes siguiente para completar la cuadrícula
    const totalCells = calendar.children.length;
    const remainingCells = 42 - totalCells; // 6 semanas * 7 días
    for (let day = 1; day <= remainingCells; day++) {
        const dateKey = formatDateKey(new Date(year, month + 1, day));
        calendar.appendChild(createDayCell(day, true, dateKey));
    }
}

// Crear celda de día
function createDayCell(day, isOtherMonth, dateKey, isToday = false) {
    const cell = document.createElement('div');
    cell.className = `day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
    cell.dataset.date = dateKey;

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    cell.appendChild(dayNumber);

    // Mostrar recetas asignadas
    if (mealPlan[dateKey]) {
        if (mealPlan[dateKey].lunch) {
            const lunchPreview = document.createElement('img');
            lunchPreview.className = 'meal-preview lunch';
            lunchPreview.src = mealPlan[dateKey].lunch.foto;
            lunchPreview.alt = mealPlan[dateKey].lunch.titulo;
            lunchPreview.title = `🍴 ${mealPlan[dateKey].lunch.titulo}`;
            lunchPreview.onerror = function() {
                this.style.display = 'none';
            };
            cell.appendChild(lunchPreview);
        }
        if (mealPlan[dateKey].dinner) {
            const dinnerPreview = document.createElement('img');
            dinnerPreview.className = 'meal-preview dinner';
            dinnerPreview.src = mealPlan[dateKey].dinner.foto;
            dinnerPreview.alt = mealPlan[dateKey].dinner.titulo;
            dinnerPreview.title = `🌙 ${mealPlan[dateKey].dinner.titulo}`;
            dinnerPreview.onerror = function() {
                this.style.display = 'none';
            };
            cell.appendChild(dinnerPreview);
        }
    }

    cell.addEventListener('click', () => openRecipeModal(dateKey));
    return cell;
}

// Formatear fecha como clave (YYYY-MM-DD)
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Abrir modal de selección de recetas
function openRecipeModal(dateKey) {
    selectedDate = dateKey;
    const modal = document.getElementById('recipeModal');
    const date = new Date(dateKey + 'T00:00:00');
    
    const dateStr = date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('modalDate').textContent = 
        dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    
    renderRecipeSelection('lunch', 'lunchRecipes');
    renderRecipeSelection('dinner', 'dinnerRecipes');
    
    // Colapsar secciones por defecto
    const mealSections = document.querySelectorAll('.meal-section');
    mealSections.forEach(section => {
        section.classList.add('collapsed');
    });
    
    // Colapsar categorías por defecto (en comida y cena)
    const categorySections = document.querySelectorAll('.category-section');
    categorySections.forEach(section => {
        section.classList.add('collapsed');
    });
    
    // Agregar event listeners para toggle
    setupMealSectionToggles();
    setupCategoryToggles();
    
    modal.style.display = 'block';
}

// Configurar toggles para las secciones de comida/cena
function setupMealSectionToggles() {
    const mealSections = document.querySelectorAll('.meal-section');
    mealSections.forEach(section => {
        const h3 = section.querySelector('h3');
        if (h3 && !h3.dataset.toggleSetup) {
            h3.dataset.toggleSetup = 'true';
            h3.addEventListener('click', (e) => {
                e.stopPropagation();
                section.classList.toggle('collapsed');
            });
        }
    });
}

// Configurar toggles para las categorías dentro de comida
function setupCategoryToggles() {
    const categorySections = document.querySelectorAll('.category-section');
    categorySections.forEach(section => {
        const h4 = section.querySelector('.category-header');
        if (h4 && !h4.dataset.toggleSetup) {
            h4.dataset.toggleSetup = 'true';
            h4.addEventListener('click', (e) => {
                e.stopPropagation();
                section.classList.toggle('collapsed');
            });
        }
    });
}

// Renderizar lista de recetas para selección
function renderRecipeSelection(mealType, containerId) {
    const container = document.getElementById(containerId);
    const currentSelection = mealPlan[selectedDate]?.[mealType];
    
    // Renderizar por categorías para comida y cena
    const categories = ['ensalada/verdura', 'proteina', 'hidratos'];
    categories.forEach(category => {
        const categoryContainer = container.querySelector(`.category-recipes-list[data-category="${category}"]`);
        if (!categoryContainer) return;
        
        categoryContainer.innerHTML = '';
        
        const categoryRecipes = recipes.filter(r => r.categoria === category);
        categoryRecipes.forEach(recipe => {
            const card = createRecipeCard(recipe, currentSelection, mealType);
            categoryContainer.appendChild(card);
        });
    });
}

// Crear tarjeta de receta
function createRecipeCard(recipe, currentSelection, mealType) {
    const card = document.createElement('div');
    card.className = `recipe-card ${currentSelection?.id === recipe.id ? 'selected' : ''}`;
    card.dataset.recipeId = recipe.id;
    
    card.innerHTML = `
        <img src="${recipe.foto}" alt="${recipe.titulo}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22%23999%22 x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo imagen%3C/text%3E%3C/svg%3E'">
        <div class="recipe-card-info">
            <div class="recipe-card-title">${recipe.titulo}</div>
            <div class="recipe-card-ingredients">${recipe.ingredientes.slice(0, 3).join(', ')}...</div>
        </div>
    `;
    
    // Manejar click simple (seleccionar) y doble click (ver descripción)
    let clickTimer = null;
    let clickCount = 0;
    
    card.addEventListener('click', (e) => {
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                // Click simple - seleccionar receta
                if (currentSelection?.id === recipe.id) {
                    // Deseleccionar
                    if (mealPlan[selectedDate]) {
                        delete mealPlan[selectedDate][mealType];
                        if (Object.keys(mealPlan[selectedDate]).length === 0) {
                            delete mealPlan[selectedDate];
                        }
                    }
                } else {
                    // Seleccionar
                    if (!mealPlan[selectedDate]) {
                        mealPlan[selectedDate] = {};
                    }
                    mealPlan[selectedDate][mealType] = recipe;
                }
                
                saveMealPlan();
                renderRecipeSelection('lunch', 'lunchRecipes');
                renderRecipeSelection('dinner', 'dinnerRecipes');
                renderCalendar();
                
                clickCount = 0;
            }, 300); // Esperar 300ms para detectar si es doble click
        } else if (clickCount === 2) {
            // Doble click - mostrar descripción
            clearTimeout(clickTimer);
            showRecipeDetail(recipe);
            clickCount = 0;
        }
    });
    
    // También manejar dblclick nativo para mejor compatibilidad
    card.addEventListener('dblclick', (e) => {
        e.preventDefault();
        clearTimeout(clickTimer);
        clickCount = 0;
        showRecipeDetail(recipe);
    });
    
    return card;
}

// Mostrar detalles de receta
function showRecipeDetail(recipe) {
    const modal = document.getElementById('recipeDetailModal');
    const content = document.getElementById('recipeDetailContent');
    
    content.innerHTML = `
        <div class="recipe-detail-content">
            <div class="recipe-detail-header">
                <img src="${recipe.foto}" alt="${recipe.titulo}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23333%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23999%22 x=%22200%22 y=%22150%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo imagen%3C/text%3E%3C/svg%3E'">
                <h2 class="recipe-detail-title">${recipe.titulo}</h2>
            </div>
            <div class="recipe-detail-section">
                <h3>Ingredientes</h3>
                <ul>
                    ${recipe.ingredientes.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
            <div class="recipe-detail-section">
                <h3>Preparación</h3>
                <p>${recipe.preparacion}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Guardar plan de comidas en localStorage
function saveMealPlan() {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
}

// Guardar estado de checkboxes de lista de compra
function saveShoppingListChecked() {
    localStorage.setItem('shoppingListChecked', JSON.stringify(shoppingListChecked));
}

// Mostrar/ocultar vistas
function showView(viewName) {
    const calendarView = document.querySelector('.container');
    const shoppingListView = document.getElementById('shoppingListView');
    
    if (viewName === 'calendar') {
        calendarView.classList.remove('hidden');
        shoppingListView.classList.add('hidden');
    } else if (viewName === 'shoppingList') {
        calendarView.classList.add('hidden');
        shoppingListView.classList.remove('hidden');
        generateShoppingList();
    }
}

// Generar lista de compra semanal
function generateShoppingList() {
    const content = document.getElementById('shoppingListContent');
    content.innerHTML = '';
    
    // Obtener inicio y fin de la semana actual (lunes a domingo)
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // Lunes = 0
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    // Recopilar todos los ingredientes de la semana
    const ingredientsMap = new Map();
    
    for (let date = new Date(monday); date <= sunday; date.setDate(date.getDate() + 1)) {
        const dateKey = formatDateKey(date);
        if (mealPlan[dateKey]) {
            if (mealPlan[dateKey].lunch) {
                addIngredientsToMap(mealPlan[dateKey].lunch.ingredientes, ingredientsMap);
            }
            if (mealPlan[dateKey].dinner) {
                addIngredientsToMap(mealPlan[dateKey].dinner.ingredientes, ingredientsMap);
            }
        }
    }
    
    if (ingredientsMap.size === 0) {
        content.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No hay recetas seleccionadas para esta semana. Selecciona recetas en el calendario para generar la lista de compra.</p>';
        return;
    }
    
    // Agrupar ingredientes por categoría
    const categories = {
        'Verduras y Hortalizas': [],
        'Carnes y Pescados': [],
        'Lácteos y Huevos': [],
        'Cereales y Pasta': [],
        'Condimentos y Especias': [],
        'Otros': []
    };
    
    const vegKeywords = ['cebolla', 'ajo', 'tomate', 'pimiento', 'calabacín', 'berenjena', 'espinaca', 'lechuga', 'judía', 'pepino', 'zanahoria', 'apio', 'brócoli', 'guisante'];
    const meatKeywords = ['pollo', 'carne', 'entraña', 'filete', 'panceta', 'bacon', 'jamón', 'gamba', 'mejillón', 'salmón', 'lubina', 'calamar', 'pescado'];
    const dairyKeywords = ['huevo', 'queso', 'nata', 'parmesano', 'mozzarella', 'feta', 'cabra'];
    const grainKeywords = ['arroz', 'pasta', 'pan', 'espagueti', 'risotto'];
    const spiceKeywords = ['sal', 'pimienta', 'aceite', 'vinagre', 'pimentón', 'orégano', 'romero', 'tomillo', 'albahaca', 'azafrán', 'limón'];
    
    ingredientsMap.forEach((quantity, ingredient) => {
        const ingLower = ingredient.toLowerCase();
        let categorized = false;
        
        if (vegKeywords.some(kw => ingLower.includes(kw))) {
            categories['Verduras y Hortalizas'].push({ingredient, quantity});
            categorized = true;
        } else if (meatKeywords.some(kw => ingLower.includes(kw))) {
            categories['Carnes y Pescados'].push({ingredient, quantity});
            categorized = true;
        } else if (dairyKeywords.some(kw => ingLower.includes(kw))) {
            categories['Lácteos y Huevos'].push({ingredient, quantity});
            categorized = true;
        } else if (grainKeywords.some(kw => ingLower.includes(kw))) {
            categories['Cereales y Pasta'].push({ingredient, quantity});
            categorized = true;
        } else if (spiceKeywords.some(kw => ingLower.includes(kw))) {
            categories['Condimentos y Especias'].push({ingredient, quantity});
            categorized = true;
        }
        
        if (!categorized) {
            categories['Otros'].push({ingredient, quantity});
        }
    });
    
    // Renderizar por categorías
    Object.keys(categories).forEach(category => {
        if (categories[category].length > 0) {
            const section = document.createElement('div');
            section.className = 'shopping-list-section';
            section.innerHTML = `<h3>${category}</h3>`;
            
            const list = document.createElement('div');
            categories[category].forEach(({ingredient, quantity}) => {
                const itemKey = ingredient.toLowerCase().trim();
                const isChecked = shoppingListChecked[itemKey] || false;
                
                const item = document.createElement('label');
                item.className = `shopping-list-item ${isChecked ? 'checked' : ''}`;
                item.innerHTML = `
                    <input type="checkbox" class="shopping-list-checkbox" ${isChecked ? 'checked' : ''} data-ingredient="${itemKey}">
                    <span class="shopping-list-item-label">${ingredient}</span>
                    ${quantity > 1 ? `<span class="shopping-list-quantity">x${quantity}</span>` : ''}
                `;
                
                const checkbox = item.querySelector('.shopping-list-checkbox');
                checkbox.addEventListener('change', (e) => {
                    const checked = e.target.checked;
                    shoppingListChecked[itemKey] = checked;
                    saveShoppingListChecked();
                    item.classList.toggle('checked', checked);
                });
                
                list.appendChild(item);
            });
            
            section.appendChild(list);
            content.appendChild(section);
        }
    });
}

// Agregar ingredientes al mapa contando cantidad
function addIngredientsToMap(ingredients, map) {
    ingredients.forEach(ingredient => {
        const ing = ingredient.trim();
        const existing = map.get(ing) || 0;
        map.set(ing, existing + 1);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Navegación de meses
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Botón lista de compra
    document.getElementById('shoppingListBtn').addEventListener('click', () => {
        showView('shoppingList');
    });
    
    // Botón volver al calendario
    document.getElementById('backToCalendarBtn').addEventListener('click', () => {
        showView('calendar');
    });
    
    // Cerrar modales
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('recipeModal').style.display = 'none';
    });
    
    document.querySelector('.close-detail').addEventListener('click', () => {
        document.getElementById('recipeDetailModal').style.display = 'none';
    });
    
    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', (event) => {
        const recipeModal = document.getElementById('recipeModal');
        const detailModal = document.getElementById('recipeDetailModal');
        if (event.target === recipeModal) {
            recipeModal.style.display = 'none';
        }
        if (event.target === detailModal) {
            detailModal.style.display = 'none';
        }
    });
}
