/**
 * Recipes Management Module
 * Handles recipe loading and operations
 */

import { createPlaceholderImage, handleImageError } from './utils.js';

const RECIPE_FILES = [
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

export const Recipes = {
    recipes: [],

    /**
     * Load all recipes from JSON files
     */
    async load() {
        try {
            const promises = RECIPE_FILES.map(file => 
                fetch(file)
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        return response.json();
                    })
                    .catch(err => {
                        console.warn(`No se pudo cargar ${file}:`, err);
                        return null;
                    })
            );
            
            const loadedRecipes = await Promise.all(promises);
            this.recipes = loadedRecipes.filter(recipe => recipe !== null);
            console.log(`✅ ${this.recipes.length} recetas cargadas`);
            return this.recipes;
        } catch (error) {
            console.error('❌ Error cargando recetas:', error);
            return [];
        }
    },

    /**
     * Get all recipes
     */
    getAll() {
        return this.recipes;
    },

    /**
     * Get recipes by category
     */
    getByCategory(category) {
        return this.recipes.filter(r => r.categoria === category);
    },

    /**
     * Get recipe by ID
     */
    getById(id) {
        return this.recipes.find(r => r.id === id);
    },

    /**
     * Create recipe card element
     */
    createCard(recipe, isSelected, onSelect, onDetail) {
        const card = document.createElement('div');
        card.className = `recipe-card ${isSelected ? 'selected' : ''}`;
        card.dataset.recipeId = recipe.id;
        
        const img = document.createElement('img');
        img.src = recipe.foto;
        img.alt = recipe.titulo;
        img.loading = 'lazy';
        img.onerror = () => handleImageError(img, 70, 70);
        
        card.innerHTML = `
            <div class="recipe-card-info">
                <div class="recipe-card-title">${recipe.titulo}</div>
                <div class="recipe-card-ingredients">${recipe.ingredientes.slice(0, 3).join(', ')}...</div>
            </div>
        `;
        card.insertBefore(img, card.firstChild);
        
        // Handle single click (select) and double click (detail)
        let clickTimer = null;
        let clickCount = 0;
        
        card.addEventListener('click', (e) => {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    if (onSelect) onSelect(recipe);
                    clickCount = 0;
                }, 300);
            } else if (clickCount === 2) {
                clearTimeout(clickTimer);
                if (onDetail) onDetail(recipe);
                clickCount = 0;
            }
        });
        
        card.addEventListener('dblclick', (e) => {
            e.preventDefault();
            clearTimeout(clickTimer);
            clickCount = 0;
            if (onDetail) onDetail(recipe);
        });
        
        return card;
    }
};

