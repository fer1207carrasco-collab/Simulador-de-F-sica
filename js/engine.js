/**
 * ENGINE.JS - Motor de Cálculo Físico
 * Responsabilidad: Procesar variables físicas y devolver vectores de estado.
 */

const PhysicsEngine = {
    // Constantes físicas (pueden ser sobreescritas por el usuario)
    GRAVITY_EARTH: 9.806,
    
    /**
     * Calcula la posición (x, y) en un instante 't'
     * @param {number} v0 - Velocidad inicial (m/s)
     * @param {number} angle - Ángulo en grados
     * @param {number} t - Tiempo transcurrido (s)
     * @param {number} g - Gravedad (m/s²)
     */
    getTrajectoryPoint(v0, angle, t, g = this.GRAVITY_EARTH) {
        const rad = angle * (Math.PI / 180);
        
        // Ecuaciones de movimiento parabólico
        const x = v0 * Math.cos(rad) * t;
        const y = (v0 * Math.sin(rad) * t) - (0.5 * g * Math.pow(t, 2));
        
        // Cálculo de velocidades instantáneas (Vectores)
        const vx = v0 * Math.cos(rad);
        const vy = (v0 * Math.sin(rad)) - (g * t);
        
        return {
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            vTotal: Math.sqrt(vx * vx + vy * vy) // Magnitud del vector velocidad
        };
    },

    /**
     * Calcula métricas teóricas máximas (Nivel Estratégico para comparación)
     */
    getTheoreticalMax(v0, angle, g = this.GRAVITY_EARTH) {
        const rad = angle * (Math.PI / 180);
        
        // Alcance máximo horizontal (R)
        const range = (Math.pow(v0, 2) * Math.sin(2 * rad)) / g;
        
        // Altura máxima (H)
        const maxHeight = (Math.pow(v0, 2) * Math.pow(Math.sin(rad), 2)) / (2 * g);
        
        // Tiempo total de vuelo
        const totalTime = (2 * v0 * Math.sin(rad)) / g;

        return {
            range: parseFloat(range.toFixed(2)),
            maxHeight: parseFloat(maxHeight.toFixed(2)),
            totalTime: parseFloat(totalTime.toFixed(2))
        };
    },

    /**
     * Valida si los datos de entrada son seguros (Evita overflows físicos)
     */
    validateInput(v0, angle) {
        if (v0 < 0 || v0 > 500) return false;
        if (angle < 0 || angle > 90) return false;
        return true;
    }
};

// Exportación lógica para uso en main.js
if (typeof module !== 'undefined') {
    module.exports = PhysicsEngine;
}