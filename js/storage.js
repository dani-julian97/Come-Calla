/**
 * Storage Management Module
 * Handles all localStorage operations
 */

export const Storage = {
    /**
     * Get meal plan from localStorage
     */
    getMealPlan() {
        try {
            const data = localStorage.getItem('mealPlan');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error loading meal plan:', error);
            return {};
        }
    },

    /**
     * Save meal plan to localStorage
     */
    saveMealPlan(mealPlan) {
        try {
            localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
        } catch (error) {
            console.error('Error saving meal plan:', error);
        }
    },

    /**
     * Get shopping list checked items from localStorage
     */
    getShoppingListChecked() {
        try {
            const data = localStorage.getItem('shoppingListChecked');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error loading shopping list:', error);
            return {};
        }
    },

    /**
     * Save shopping list checked items to localStorage
     */
    saveShoppingListChecked(checked) {
        try {
            localStorage.setItem('shoppingListChecked', JSON.stringify(checked));
        } catch (error) {
            console.error('Error saving shopping list:', error);
        }
    }
};

