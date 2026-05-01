/**
 * Google Anti-Gravity Interactive Physics Mode
 * Powered by Matter.js
 */

const { Engine, Runner, Bodies, World, Mouse, MouseConstraint, Composite } = Matter;

let engine, runner, mouseConstraint;
let physicsActive = false;
let animationFrameId = null;
let elementsData = [];
let boundaries = [];

/**
 * Initialize the physics engine
 */
function initEngine() {
    engine = Engine.create();
    engine.world.gravity.y = 0; // Zero gravity

    runner = Runner.create();
    
    // Add mouse control
    const mouse = Mouse.create(document.body);
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    World.add(engine.world, mouseConstraint);
    
    // Boundary update on resize
    window.addEventListener('resize', updateBoundaries);
}

/**
 * Create or update invisible walls
 */
function updateBoundaries() {
    if (!physicsActive) return;

    // Remove old boundaries
    if (boundaries.length > 0) {
        World.remove(engine.world, boundaries);
    }

    const thickness = 100;
    const width = window.innerWidth;
    const height = window.innerHeight;

    boundaries = [
        // Ground
        Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }),
        // Ceiling
        Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }),
        // Left wall
        Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }),
        // Right wall
        Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true })
    ];

    World.add(engine.world, boundaries);
}

/**
 * Map HTML elements to Matter.js bodies
 */
function mapElementsToBodies() {
    // Select targets: nav links, primary buttons, hero img, certificates, featured card, etc.
    const selectors = [
        '.nav-links a', 
        '.btn-primary', 
        '.hero-img', 
        '.project-card', 
        '.featured-card', 
        '.skill-tag', 
        '.service-card',
        '.stat-card',
        '.certificate-card'
    ];
    
    const targets = document.querySelectorAll(selectors.join(', '));
    elementsData = [];

    targets.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        
        // Skip hidden or zero-size elements
        if (rect.width === 0 || rect.height === 0) return;

        // Save original state for clean exit
        const originalStyle = {
            position: el.style.position,
            top: el.style.top,
            left: el.style.left,
            width: el.style.width,
            height: el.style.height,
            transform: el.style.transform,
            transition: el.style.transition,
            zIndex: el.style.zIndex,
            pointerEvents: el.style.pointerEvents
        };

        // Create Matter.js body
        const body = Bodies.rectangle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            rect.width,
            rect.height,
            {
                restitution: 0.6,
                friction: 0.1,
                frictionAir: 0.05,
                density: 0.001
            }
        );

        // Give it some initial random momentum for the "pop" effect
        Matter.Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 5,
            y: (Math.random() - 0.5) * 5
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

        elementsData.push({
            el: el,
            body: body,
            originalStyle: originalStyle
        });

        World.add(engine.world, body);

        // Prepare element for physics
        el.style.width = rect.width + 'px';
        el.style.height = rect.height + 'px';
        el.style.position = 'fixed';
        el.style.top = '0';
        el.style.left = '0';
        el.style.margin = '0';
        el.style.zIndex = '9999';
        el.style.transition = 'none';
        el.style.pointerEvents = 'auto'; // Ensure we can still interact
    });
}

/**
 * Main animation loop to sync DOM with physics
 */
function syncLoop() {
    if (!physicsActive) return;

    elementsData.forEach(data => {
        const { el, body } = data;
        const { x, y } = body.position;
        const angle = body.angle;

        // Sync CSS
        // Subtract half width/height because Matter.js positions are from center
        const rect = el.getBoundingClientRect();
        const tx = x - rect.width / 2;
        const ty = y - rect.height / 2;
        
        el.style.transform = `translate(${tx}px, ${ty}px) rotate(${angle}rad)`;
    });

    animationFrameId = requestAnimationFrame(syncLoop);
}

/**
 * Start the Anti-Gravity mode
 */
window.startAntiGravity = function() {
    if (physicsActive) return;
    
    console.log("Anti-Gravity Mode: Engaged.");
    physicsActive = true;
    
    if (!engine) initEngine();
    
    updateBoundaries();
    mapElementsToBodies();
    
    Runner.run(runner, engine);
    syncLoop();
};

/**
 * Stop the Anti-Gravity mode and restore layout
 */
window.stopGravity = function() {
    if (!physicsActive) return;
    
    console.log("Anti-Gravity Mode: Disengaged. Restoring systems...");
    physicsActive = false;
    
    // Stop physics
    Runner.stop(runner);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    // Clear world
    World.clear(engine.world, false);
    
    // Restore elements
    elementsData.forEach(data => {
        const { el, originalStyle } = data;
        
        // Temporary transition for smooth return
        el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Reset properties to original
        el.style.position = originalStyle.position;
        el.style.top = originalStyle.top;
        el.style.left = originalStyle.left;
        el.style.width = originalStyle.width;
        el.style.height = originalStyle.height;
        el.style.transform = originalStyle.transform;
        el.style.zIndex = originalStyle.zIndex;
        el.style.pointerEvents = originalStyle.pointerEvents;
        
        // Remove temporary transition after animation completes
        setTimeout(() => {
            el.style.transition = originalStyle.transition;
        }, 800);
    });
    
    elementsData = [];
};

// Add hidden trigger to the logo dot
document.addEventListener('DOMContentLoaded', () => {
    const logoDot = document.querySelector('.logo .dot');
    if (logoDot) {
        logoDot.style.cursor = 'pointer';
        logoDot.title = 'Anti-Gravity Easter Egg';
        
        let clicks = 0;
        logoDot.addEventListener('click', () => {
            clicks++;
            if (!physicsActive) {
                if (clicks >= 3) {
                    window.startAntiGravity();
                    clicks = 0;
                }
            } else {
                window.stopGravity();
                clicks = 0;
            }
        });
    }
});
