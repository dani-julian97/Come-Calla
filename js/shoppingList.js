/**
 * Shopping List Module
 * Handles shopping list generation and management
 */

import { AppState } from './state.js';
import { formatDateKey } from './utils.js';

const CATEGORY_KEYWORDS = {
    'Verduras y Hortalizas': ['cebolla', 'ajo', 'tomate', 'pimiento', 'calabacín', 'berenjena', 
                              'espinaca', 'lechuga', 'judía', 'pepino', 'zanahoria', 'apio', 
                              'brócoli', 'guisante'],
    'Carnes y Pescados': ['pollo', 'carne', 'entraña', 'filete', 'panceta', 'bacon', 'jamón', 
                          'gamba', 'mejillón', 'salmón', 'lubina', 'calamar', 'pescado'],
    'Lácteos y Huevos': ['huevo', 'queso', 'nata', 'parmesano', 'mozzarella', 'feta', 'cabra'],
    'Cereales y Pasta': ['arroz', 'pasta', 'pan', 'espagueti', 'risotto'],
    'Condimentos y Especias': ['sal', 'pimienta', 'aceite', 'vinagre', 'pimentón', 'orégano', 
                                'romero', 'tomillo', 'albahaca', 'azafrán', 'limón']
};

export const ShoppingList = {
    /**
     * Generate shopping list for current week
     */
    generate() {
        const content = document.getElementById('shoppingListContent');
        content.innerHTML = '';
        
        // Get current week (Monday to Sunday)
        const today = new Date();
        const dayOfWeek = (today.getDay() + 6) % 7; // Monday = 0
        const monday = new Date(today);
        monday.setDate(today.getDate() - dayOfWeek);
        monday.setHours(0, 0, 0, 0);
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        
        // Collect all ingredients for the week
        const ingredientsMap = new Map();
        
        for (let date = new Date(monday); date <= sunday; date.setDate(date.getDate() + 1)) {
            const dateKey = formatDateKey(date);
            const dayMeals = AppState.mealPlan[dateKey];
            
            if (dayMeals) {
                if (dayMeals.lunch) {
                    this.addIngredientsToMap(dayMeals.lunch.ingredientes, ingredientsMap);
                }
                if (dayMeals.dinner) {
                    this.addIngredientsToMap(dayMeals.dinner.ingredientes, ingredientsMap);
                }
            }
        }
        
        if (ingredientsMap.size === 0) {
            content.innerHTML = `
                <p class="empty-message">
                    No hay recetas seleccionadas para esta semana. 
                    Selecciona recetas en el calendario para generar la lista de compra.
                </p>
            `;
            return;
        }
        
        // Categorize ingredients
        const categories = this.categorizeIngredients(ingredientsMap);
        
        // Render by categories
        Object.keys(categories).forEach(category => {
            if (categories[category].length > 0) {
                const section = this.createCategorySection(category, categories[category]);
                content.appendChild(section);
            }
        });
    },

    /**
     * Add ingredients to map counting quantities
     */
    addIngredientsToMap(ingredients, map) {
        ingredients.forEach(ingredient => {
            const ing = ingredient.trim();
            const existing = map.get(ing) || 0;
            map.set(ing, existing + 1);
        });
    },

    /**
     * Categorize ingredients
     */
    categorizeIngredients(ingredientsMap) {
        const categories = {
            'Verduras y Hortalizas': [],
            'Carnes y Pescados': [],
            'Lácteos y Huevos': [],
            'Cereales y Pasta': [],
            'Condimentos y Especias': [],
            'Otros': []
        };
        
        ingredientsMap.forEach((quantity, ingredient) => {
            const ingLower = ingredient.toLowerCase();
            let categorized = false;
            
            for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
                if (keywords.some(kw => ingLower.includes(kw))) {
                    categories[category].push({ ingredient, quantity });
                    categorized = true;
                    break;
                }
            }
            
            if (!categorized) {
                categories['Otros'].push({ ingredient, quantity });
            }
        });
        
        return categories;
    },

    /**
     * Create category section
     */
    createCategorySection(category, items) {
        const section = document.createElement('div');
        section.className = 'shopping-list-section';
        section.innerHTML = `<h3>${category}</h3>`;
        
        const list = document.createElement('div');
        items.forEach(({ ingredient, quantity }) => {
            const item = this.createShoppingListItem(ingredient, quantity);
            list.appendChild(item);
        });
        
        section.appendChild(list);
        return section;
    },

    /**
     * Create shopping list item
     */
    createShoppingListItem(ingredient, quantity) {
        const itemKey = ingredient.toLowerCase().trim();
        const isChecked = AppState.shoppingListChecked[itemKey] || false;
        
        const item = document.createElement('label');
        item.className = `shopping-list-item ${isChecked ? 'checked' : ''}`;
        item.innerHTML = `
            <input type="checkbox" class="shopping-list-checkbox" 
                   ${isChecked ? 'checked' : ''} 
                   data-ingredient="${itemKey}">
            <span class="shopping-list-item-label">${ingredient}</span>
            ${quantity > 1 ? `<span class="shopping-list-quantity">x${quantity}</span>` : ''}
        `;
        
        const checkbox = item.querySelector('.shopping-list-checkbox');
        checkbox.addEventListener('change', (e) => {
            const checked = e.target.checked;
            AppState.updateShoppingListChecked(itemKey, checked);
            item.classList.toggle('checked', checked);
        });
        
        return item;
    }
};

