/**
 * Calendar Module
 * Handles calendar rendering and interactions
 */

import { AppState } from './state.js';
import { formatDateKey, MONTH_NAMES, handleImageError } from './utils.js';

export const Calendar = {
    /**
     * Render the calendar
     */
    render() {
        const year = AppState.currentDate.getFullYear();
        const month = AppState.currentDate.getMonth();
        
        // Update month title
        document.getElementById('currentMonth').textContent = 
            `${MONTH_NAMES[month]} ${year}`;

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

        // Clear calendar
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const dateKey = formatDateKey(new Date(year, month - 1, day));
            calendar.appendChild(this.createDayCell(day, true, dateKey));
        }

        // Current month days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = formatDateKey(date);
            const isToday = date.toDateString() === today.toDateString();
            calendar.appendChild(this.createDayCell(day, false, dateKey, isToday));
        }

        // Next month days to complete grid
        const totalCells = calendar.children.length;
        const remainingCells = 42 - totalCells; // 6 weeks * 7 days
        for (let day = 1; day <= remainingCells; day++) {
            const dateKey = formatDateKey(new Date(year, month + 1, day));
            calendar.appendChild(this.createDayCell(day, true, dateKey));
        }
    },

    /**
     * Create a day cell
     */
    createDayCell(day, isOtherMonth, dateKey, isToday = false) {
        const cell = document.createElement('div');
        cell.className = `day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
        cell.dataset.date = dateKey;

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);

        // Show assigned recipes
        const mealPlan = AppState.mealPlan;
        if (mealPlan[dateKey]) {
            if (mealPlan[dateKey].lunch) {
                const lunchPreview = this.createMealPreview(mealPlan[dateKey].lunch, 'lunch');
                cell.appendChild(lunchPreview);
            }
            if (mealPlan[dateKey].dinner) {
                const dinnerPreview = this.createMealPreview(mealPlan[dateKey].dinner, 'dinner');
                cell.appendChild(dinnerPreview);
            }
        }

        cell.addEventListener('click', () => {
            if (window.openRecipeModal) {
                window.openRecipeModal(dateKey);
            }
        });
        
        return cell;
    },

    /**
     * Create meal preview image
     */
    createMealPreview(recipe, mealType) {
        const preview = document.createElement('img');
        preview.className = `meal-preview ${mealType}`;
        preview.src = recipe.foto;
        preview.alt = recipe.titulo;
        preview.loading = 'lazy';
        preview.title = mealType === 'lunch' ? `🍴 ${recipe.titulo}` : `🌙 ${recipe.titulo}`;
        preview.onerror = () => handleImageError(preview, 40, 40);
        return preview;
    }
};

