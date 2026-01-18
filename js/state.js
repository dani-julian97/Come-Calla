/**
 * Application State Management Module
 */

import { Storage } from './storage.js';

export const AppState = {
    currentDate: new Date(),
    selectedDate: null,
    mealPlan: Storage.getMealPlan(),
    shoppingListChecked: Storage.getShoppingListChecked(),

    /**
     * Set selected date
     */
    setSelectedDate(dateKey) {
        this.selectedDate = dateKey;
    },

    /**
     * Get meal for a specific date and meal type
     */
    getMeal(dateKey, mealType) {
        return this.mealPlan[dateKey]?.[mealType] || null;
    },

    /**
     * Set meal for a specific date and meal type
     */
    setMeal(dateKey, mealType, recipe) {
        if (!this.mealPlan[dateKey]) {
            this.mealPlan[dateKey] = {};
        }
        this.mealPlan[dateKey][mealType] = recipe;
        Storage.saveMealPlan(this.mealPlan);
    },

    /**
     * Remove meal for a specific date and meal type
     */
    removeMeal(dateKey, mealType) {
        if (this.mealPlan[dateKey]) {
            delete this.mealPlan[dateKey][mealType];
            if (Object.keys(this.mealPlan[dateKey]).length === 0) {
                delete this.mealPlan[dateKey];
            }
            Storage.saveMealPlan(this.mealPlan);
        }
    },

    /**
     * Toggle meal selection
     */
    toggleMeal(dateKey, mealType, recipe) {
        const current = this.getMeal(dateKey, mealType);
        if (current?.id === recipe.id) {
            this.removeMeal(dateKey, mealType);
        } else {
            this.setMeal(dateKey, mealType, recipe);
        }
    },

    /**
     * Update shopping list checked state
     */
    updateShoppingListChecked(itemKey, checked) {
        this.shoppingListChecked[itemKey] = checked;
        Storage.saveShoppingListChecked(this.shoppingListChecked);
    },

    /**
     * Navigate to previous month
     */
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    },

    /**
     * Navigate to next month
     */
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    }
};

