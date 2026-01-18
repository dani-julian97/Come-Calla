/**
 * Main Application Module
 * Initializes and coordinates all app modules
 */

import { AppState } from './state.js';
import { Recipes } from './recipes.js';
import { Calendar } from './calendar.js';
import { Modals } from './modals.js';
import { ShoppingList } from './shoppingList.js';

class App {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) return;
        
        try {
            // Load recipes
            await Recipes.load();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Render initial calendar
            Calendar.render();
            
            // Show calendar view
            this.showView('calendar');
            
            // Make modals accessible globally
            window.openRecipeModal = (dateKey) => Modals.openRecipeModal(dateKey);
            
            this.initialized = true;
            console.log('✅ App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Month navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            AppState.previousMonth();
            Calendar.render();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            AppState.nextMonth();
            Calendar.render();
        });
        
        // Shopping list button
        document.getElementById('shoppingListBtn').addEventListener('click', () => {
            this.showView('shoppingList');
        });
        
        // Back to calendar button
        document.getElementById('backToCalendarBtn').addEventListener('click', () => {
            this.showView('calendar');
        });
        
        // Close modals
        document.querySelector('.close').addEventListener('click', () => {
            Modals.closeRecipeModal();
        });
        
        document.querySelector('.close-detail').addEventListener('click', () => {
            Modals.closeRecipeDetail();
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', (event) => {
            const recipeModal = document.getElementById('recipeModal');
            const detailModal = document.getElementById('recipeDetailModal');
            
            if (event.target === recipeModal) {
                Modals.closeRecipeModal();
            }
            if (event.target === detailModal) {
                Modals.closeRecipeDetail();
            }
        });
    }

    /**
     * Show/hide views
     */
    showView(viewName) {
        const calendarView = document.querySelector('.container');
        const shoppingListView = document.getElementById('shoppingListView');
        
        if (viewName === 'calendar') {
            calendarView.classList.remove('hidden');
            shoppingListView.classList.add('hidden');
        } else if (viewName === 'shoppingList') {
            calendarView.classList.add('hidden');
            shoppingListView.classList.remove('hidden');
            ShoppingList.generate();
        }
    }
}

// Initialize app when DOM is ready
const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());

// Export for potential external use
export default app;

