/**
 * CANVAS.JS - Motor de Renderizado Gráfico
 * Responsabilidad: Dibujar la simulación y gestionar el sistema de coordenadas.
 */

const CanvasRenderer = {
    canvas: document.getElementById('canvas'),
    ctx: document.getElementById('canvas').getContext('2d'),
    
    // Configuración de visualización
    config: {
        margin: 50,
        scale: 5, // 1 metro = 5 píxeles
        trailColor: '#2563eb',
        gridColor: '#e2e8f0',
        projectileColor: '#1e293b'
    },

    /**
     * Limpia el escenario y dibuja el plano cartesiano
     */
    initStage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawAxes();
    },

    /**
     * Traduce coordenadas físicas (m) a coordenadas de pantalla (px)
     */
    mapCoordinates(physicsX, physicsY) {
        return {
            x: this.config.margin + (physicsX * this.config.scale),
            y: (this.canvas.height - this.config.margin) - (physicsY * this.config.scale)
        };
    },

    /**
     * Dibuja la rejilla de fondo (Grid) para dar aspecto de laboratorio
     */
    drawGrid() {
        const step = 50; // cada 50px
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.config.gridColor;
        this.ctx.lineWidth = 1;

        for (let x = 0; x <= this.canvas.width; x += step) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
        }
        for (let y = 0; y <= this.canvas.height; y += step) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.stroke();
    },

    drawAxes() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#64748b';
        this.ctx.lineWidth = 2;
        // Eje Y
        this.ctx.moveTo(this.config.margin, 0);
        this.ctx.lineTo(this.config.margin, this.canvas.height);
        // Eje X
        this.ctx.moveTo(0, this.canvas.height - this.config.margin);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - this.config.margin);
        this.ctx.stroke();
    },

    /**
     * Dibuja un frame de la trayectoria
     */
    drawFrame(x, y, isFirstFrame = false) {
        const coords = this.mapCoordinates(x, y);

        if (isFirstFrame) {
            this.ctx.beginPath();
            this.ctx.moveTo(coords.x, coords.y);
            this.ctx.strokeStyle = this.config.trailColor;
            this.ctx.lineWidth = 3;
        } else {
            this.ctx.lineTo(coords.x, coords.y);
            this.ctx.stroke();
            
            // Efecto de "cabeza" de proyectil
            this.drawProjectile(coords.x, coords.y);
        }
    },

    drawProjectile(pxX, pxY) {
        // Limpiamos rastro anterior si fuera necesario (opcional)
        this.ctx.fillStyle = this.config.projectileColor;
        this.ctx.beginPath();
        this.ctx.arc(pxX, pxY, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }
};