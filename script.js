// Estado de la aplicación
let currentDate = new Date();
let selectedDate = null;
let recipes = [];
let mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
    renderCalendar();
    setupEventListeners();
});

// Cargar recetas desde archivos JSON
async function loadRecipes() {
    const recipeFiles = [
        'recetas/pasta-carbonara.json',
        'recetas/pollo-teriyaki.json',
        'recetas/salmon-horno.json',
        'recetas/ensalada-cesar.json',
        'recetas/risotto-setas.json'
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
    
    // Agregar event listeners para toggle
    setupMealSectionToggles();
    
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

// Renderizar lista de recetas para selección
function renderRecipeSelection(mealType, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const currentSelection = mealPlan[selectedDate]?.[mealType];
    
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = `recipe-card ${currentSelection?.id === recipe.id ? 'selected' : ''}`;
        card.dataset.recipeId = recipe.id;
        
        card.innerHTML = `
            <img src="${recipe.foto}" alt="${recipe.titulo}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22%23999%22 x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo imagen%3C/text%3E%3C/svg%3E'">
            <div class="recipe-card-info">
                <div class="recipe-card-title">${recipe.titulo}</div>
                <div class="recipe-card-ingredients">${recipe.ingredientes.slice(0, 3).join(', ')}...</div>
            </div>
            <button class="recipe-detail-btn" aria-label="Ver detalles">👁️</button>
        `;
        
        const detailBtn = card.querySelector('.recipe-detail-btn');
        detailBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showRecipeDetail(recipe);
        });
        
        card.addEventListener('click', () => {
            // Toggle selección
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
        });
        
        container.appendChild(card);
    });
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
    
    // Cerrar modales
    document.querySelector('.back-btn:not(.back-detail)').addEventListener('click', () => {
        document.getElementById('recipeModal').style.display = 'none';
    });
    
    document.querySelector('.back-detail').addEventListener('click', () => {
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

