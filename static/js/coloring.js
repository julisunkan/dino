class ColoringApp {
    constructor(animalId, filename) {
        this.animalId = animalId;
        this.filename = filename;
        this.currentColor = '#FF6B6B';
        this.colorHistory = [];
        this.historyIndex = -1;
        this.maxHistoryLength = 20;
        
        // Default color palette
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
            '#A3E4D7', '#FAD7A0', '#D5A6BD', '#A9DFBF', '#F9E79F',
            '#000000', '#FFFFFF', '#8B4513', '#228B22', '#FF4500'
        ];
    }

    async init() {
        await this.loadSVG();
        this.setupColorPalette();
        this.setupEventListeners();
        this.loadProgress();
    }

    async loadSVG() {
        const container = document.getElementById('svg-container');
        const svgPath = `/static/images/animals/${this.filename}`;
        
        try {
            const response = await fetch(svgPath);
            const svgText = await response.text();
            container.innerHTML = svgText;
            
            // Setup click handlers for SVG elements
            this.setupSVGInteractions();
        } catch (error) {
            console.error('Error loading SVG:', error);
            container.innerHTML = '<p class="text-danger">Error loading coloring image</p>';
        }
    }

    setupSVGInteractions() {
        const svg = document.querySelector('#svg-container svg');
        if (!svg) return;

        // Find all colorable elements
        const colorableElements = svg.querySelectorAll('path, circle, ellipse, polygon, rect');
        
        colorableElements.forEach(element => {
            // Set default styling
            if (!element.getAttribute('fill') || element.getAttribute('fill') === 'none') {
                element.setAttribute('fill', 'white');
            }
            element.setAttribute('stroke', '#333');
            element.setAttribute('stroke-width', '2');
            
            // Add click handler
            element.addEventListener('click', (e) => {
                this.colorElement(e.target);
            });
            
            // Add hover effects
            element.addEventListener('mouseenter', (e) => {
                e.target.style.opacity = '0.8';
            });
            
            element.addEventListener('mouseleave', (e) => {
                e.target.style.opacity = '1';
            });
        });
    }

    setupColorPalette() {
        const palette = document.getElementById('color-palette');
        
        this.colors.forEach((color, index) => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color-option';
            colorDiv.style.backgroundColor = color;
            colorDiv.setAttribute('data-color', color);
            
            if (index === 0) {
                colorDiv.classList.add('active');
            }
            
            colorDiv.addEventListener('click', () => {
                this.selectColor(color, colorDiv);
            });
            
            palette.appendChild(colorDiv);
        });
    }

    setupEventListeners() {
        // Undo button
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.undo();
        });
        
        // Redo button
        document.getElementById('redo-btn').addEventListener('click', () => {
            this.redo();
        });
        
        // Clear all button
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearAll();
        });
        
        // Export button
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportToPNG();
        });
    }

    selectColor(color, element) {
        this.currentColor = color;
        
        // Update active color indicator
        document.querySelectorAll('.color-option').forEach(el => {
            el.classList.remove('active');
        });
        element.classList.add('active');
    }

    colorElement(element) {
        const oldColor = element.getAttribute('fill');
        
        // Save to history
        this.saveToHistory();
        
        // Apply new color
        element.setAttribute('fill', this.currentColor);
        
        // Update progress
        this.updateProgress();
        
        // Mark as colored in localStorage
        this.markAsColored();
    }

    saveToHistory() {
        const svg = document.querySelector('#svg-container svg');
        if (!svg) return;
        
        // Remove any history after current index
        this.colorHistory = this.colorHistory.slice(0, this.historyIndex + 1);
        
        // Add current state
        this.colorHistory.push(svg.outerHTML);
        this.historyIndex++;
        
        // Limit history length
        if (this.colorHistory.length > this.maxHistoryLength) {
            this.colorHistory.shift();
            this.historyIndex--;
        }
        
        this.updateHistoryButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreFromHistory();
        }
    }

    redo() {
        if (this.historyIndex < this.colorHistory.length - 1) {
            this.historyIndex++;
            this.restoreFromHistory();
        }
    }

    restoreFromHistory() {
        const container = document.getElementById('svg-container');
        container.innerHTML = this.colorHistory[this.historyIndex];
        this.setupSVGInteractions();
        this.updateHistoryButtons();
    }

    updateHistoryButtons() {
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        
        undoBtn.disabled = this.historyIndex <= 0;
        redoBtn.disabled = this.historyIndex >= this.colorHistory.length - 1;
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all colors?')) {
            this.saveToHistory();
            
            const colorableElements = document.querySelectorAll('#svg-container path, #svg-container circle, #svg-container ellipse, #svg-container polygon, #svg-container rect');
            colorableElements.forEach(element => {
                element.setAttribute('fill', 'white');
            });
            
            this.updateProgress();
        }
    }

    exportToPNG() {
        const svg = document.querySelector('#svg-container svg');
        if (!svg) return;
        
        // Create a canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgData = new XMLSerializer().serializeToString(svg);
        
        // Create an image from SVG
        const img = new Image();
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Fill with white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw the SVG
            ctx.drawImage(img, 0, 0);
            
            // Create download link
            const link = document.createElement('a');
            link.download = `${this.animalId}-colored.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            URL.revokeObjectURL(url);
        };
        
        img.src = url;
    }

    updateProgress() {
        // Count colored elements (non-white fills)
        const colorableElements = document.querySelectorAll('#svg-container path, #svg-container circle, #svg-container ellipse, #svg-container polygon, #svg-container rect');
        const coloredElements = Array.from(colorableElements).filter(el => {
            const fill = el.getAttribute('fill');
            return fill && fill !== 'white' && fill !== '#ffffff' && fill !== '#FFFFFF';
        });
        
        const progress = coloredElements.length / colorableElements.length;
        
        // If more than 50% colored, mark as completed
        if (progress > 0.5) {
            this.markAsColored();
        }
    }

    markAsColored() {
        let coloredAnimals = JSON.parse(localStorage.getItem('coloredAnimals') || '[]');
        if (!coloredAnimals.includes(this.animalId)) {
            coloredAnimals.push(this.animalId);
            localStorage.setItem('coloredAnimals', JSON.stringify(coloredAnimals));
        }
    }

    loadProgress() {
        // Save initial state to history
        const svg = document.querySelector('#svg-container svg');
        if (svg) {
            this.colorHistory = [svg.outerHTML];
            this.historyIndex = 0;
            this.updateHistoryButtons();
        }
    }
}

// Utility functions
function showNotification(message, type = 'success') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}
