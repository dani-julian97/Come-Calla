/**
 * Modals Module
 * Handles all modal operations
 */

import { AppState } from './state.js';
import { Recipes } from './recipes.js';
import { Calendar } from './calendar.js';
import { formatDateDisplay } from './utils.js';

export const Modals = {
    /**
     * Open recipe selection modal
     */
    openRecipeModal(dateKey) {
        AppState.setSelectedDate(dateKey);
        const modal = document.getElementById('recipeModal');
        const dateStr = formatDateDisplay(dateKey);
        
        document.getElementById('modalDate').textContent = 
            dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
        
        this.renderRecipeSelection('lunch', 'lunchRecipes');
        this.renderRecipeSelection('dinner', 'dinnerRecipes');
        
        // Collapse sections by default
        const mealSections = document.querySelectorAll('.meal-section');
        mealSections.forEach(section => section.classList.add('collapsed'));
        
        const categorySections = document.querySelectorAll('.category-section');
        categorySections.forEach(section => section.classList.add('collapsed'));
        
        // Setup toggles
        this.setupMealSectionToggles();
        this.setupCategoryToggles();
        
        modal.style.display = 'block';
    },

    /**
     * Close recipe selection modal
     */
    closeRecipeModal() {
        document.getElementById('recipeModal').style.display = 'none';
    },

    /**
     * Render recipe selection for a meal type
     */
    renderRecipeSelection(mealType, containerId) {
        const container = document.getElementById(containerId);
        const currentSelection = AppState.getMeal(AppState.selectedDate, mealType);
        
        const categories = ['ensalada/verdura', 'proteina', 'hidratos'];
        categories.forEach(category => {
            const categoryContainer = container.querySelector(
                `.category-recipes-list[data-category="${category}"]`
            );
            if (!categoryContainer) return;
            
            categoryContainer.innerHTML = '';
            
            const categoryRecipes = Recipes.getByCategory(category);
            categoryRecipes.forEach(recipe => {
                const isSelected = currentSelection?.id === recipe.id;
                const card = Recipes.createCard(
                    recipe,
                    isSelected,
                    () => this.handleRecipeSelect(recipe, mealType),
                    (r) => this.showRecipeDetail(r)
                );
                categoryContainer.appendChild(card);
            });
        });
    },

    /**
     * Handle recipe selection
     */
    handleRecipeSelect(recipe, mealType) {
        AppState.toggleMeal(AppState.selectedDate, mealType, recipe);
        this.renderRecipeSelection('lunch', 'lunchRecipes');
        this.renderRecipeSelection('dinner', 'dinnerRecipes');
        Calendar.render();
    },

    /**
     * Show recipe detail modal
     */
    showRecipeDetail(recipe) {
        const modal = document.getElementById('recipeDetailModal');
        const content = document.getElementById('recipeDetailContent');
        
        content.innerHTML = `
            <div class="recipe-detail-content">
                <div class="recipe-detail-header">
                    <img src="${recipe.foto}" alt="${recipe.titulo}" 
                         loading="lazy" 
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23333%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23999%22 x=%22200%22 y=%22150%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo imagen%3C/text%3E%3C/svg%3E'">
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
    },

    /**
     * Close recipe detail modal
     */
    closeRecipeDetail() {
        document.getElementById('recipeDetailModal').style.display = 'none';
    },

    /**
     * Setup meal section toggles
     */
    setupMealSectionToggles() {
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
    },

    /**
     * Setup category toggles
     */
    setupCategoryToggles() {
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
};

