/**
 * PROYECTO: Simulador de Laboratorio Físico (Cinemática)
 * ENTREGA: Interfaz Funcional e Interactiva (JS Puro)
 * NIVEL: Estratégico - Preparado para Integración con Laravel
 * Demostración rápida del funcionamiento y la lógica en JS.
 */

const Simulator = {
    // 1. Configuración Inicial
    canvas: document.getElementById('canvas'),
    ctx: document.getElementById('canvas').getContext('2d'),
    isAnimating: false,
    
    // 2. Parámetros de Simulación (Variables del Experimento)
    params: {
        v0: 50,
        angle: 45,
        gravity: 9.8,
        scale: 2 // Escala de visualización (píxeles por metro)
    },

    // 3. Inicialización de Eventos
    init() {
        this.resize();
        this.bindEvents();
        console.log("Laboratorio Virtual Inicializado.");
    },

    bindEvents() {
        // Actualizar parámetros en tiempo real desde el DOM
        document.querySelectorAll('input[type="range"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const valId = `${e.target.id}_val`;
                if(document.getElementById(valId)) {
                    document.getElementById(valId).innerText = e.target.value;
                }
                this.params[e.target.id] = parseFloat(e.target.value);
            });
        });

        document.getElementById('launchBtn').addEventListener('click', () => this.start());
        document.getElementById('clearBtn').addEventListener('click', () => this.clear());
        window.addEventListener('resize', () => this.resize());
    },

    // 4. Lógica del Cálculo Algorítmico
    // Implementación de la ecuación: y = tan(θ)x - [g / (2 * v0² * cos²θ)] * x²
    calculateTrajectory(t) {
        const rad = this.params.angle * (Math.PI / 180);
        const x = this.params.v0 * Math.cos(rad) * t;
        const y = (this.params.v0 * Math.sin(rad) * t) - (0.5 * this.params.gravity * Math.pow(t, 2));
        return { x, y };
    },

    // 5. Motor de Animación y Renderizado
    start() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        let t = 0;
        const dt = 0.05; // Precisión del diferencial de tiempo
        
        // Estilo de línea para la trayectoria
        this.ctx.beginPath();
        this.ctx.setLineDash([5, 5]); // Trayectoria punteada para estética científica
        this.ctx.strokeStyle = '#2563eb';
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(50, this.canvas.height - 50);

        const animate = () => {
            const pos = this.calculateTrajectory(t);
            
            // Mapeo de coordenadas físicas a coordenadas de píxeles
            const drawX = 50 + (pos.x * this.params.scale);
            const drawY = (this.canvas.height - 50) - (pos.y * this.params.scale);

            // Condición de parada (suelo o límites)
            if (drawY <= this.canvas.height - 50 && drawX < this.canvas.width) {
                this.ctx.lineTo(drawX, drawY);
                this.ctx.stroke();
                
                // Dibujar el proyectil (punto actual)
                this.drawProjectileHead(drawX, drawY);
                
                t += dt;
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                this.saveMetrics(pos.x); // Preparado para Laravel
            }
        };
        animate();
    },

    drawProjectileHead(x, y) {
        // Solo para feedback visual inmediato
        this.ctx.fillStyle = '#1e293b';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 4, 0, Math.PI * 2);
        this.ctx.fill();
    },

    // 6. Persistencia y Métricas (Fase Estratégica)
    saveMetrics(distanciaMax) {
        document.getElementById('m_dist').innerText = distanciaMax.toFixed(2);
        console.log(`Métricas capturadas: Alcance = ${distanciaMax}m. Listas para enviar a Laravel.`);
    },

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isAnimating = false;
    },

    resize() {
        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
    }
};

// Ejecución al cargar el documento
document.addEventListener('DOMContentLoaded', () => Simulator.init());