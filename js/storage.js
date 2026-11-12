/**
 * Mente en Equilibrio - LocalStorage Manager
 */
const DB_NAME = 'mente_equilibrio_db';

const Storage = {
    /**
     * Initial database state
     */
    getInitialData() {
        return {
            user: {
                name: 'Usuario',
                theme: 'light',
                joined: new Date().toISOString()
            },
            emotions: [],
            journal: [],
            wellness: {
                completedTasks: [],
                lastUpdate: new Date().toISOString()
            }
        };
    },

    /**
     * Get all data from DB
     */
    getData() {
        const data = localStorage.getItem(DB_NAME);
        if (!data) {
            const initial = this.getInitialData();
            this.saveData(initial);
            return initial;
        }
        return JSON.parse(data);
    },

    /**
     * Save all data to DB
     */
    saveData(data) {
        localStorage.setItem(DB_NAME, JSON.stringify(data));
    },

    /**
     * Update a specific key in the DB
     */
    updateKey(key, value) {
        const data = this.getData();
        data[key] = value;
        this.saveData(data);
    },

    /**
     * Reset all data
     */
    clearAll() {
        localStorage.removeItem(DB_NAME);
        window.location.reload();
    }
};
