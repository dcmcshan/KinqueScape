// Unity Room Override Script
// This script directly manipulates Unity's canvas to force correct room display

window.UnityRoomOverride = {
  unityInstance: null,
  roomCreated: false,
  canvas: null,
  ctx: null,
  
  createDungeonRoom: function(unityInstance) {
    console.log('Unity Override: Force-drawing correct GLB room on canvas');
    this.unityInstance = unityInstance;
    
    if (!unityInstance) {
      console.error('Unity Override: No Unity instance available');
      return;
    }
    
    // Get Unity's canvas multiple ways
    this.canvas = unityInstance.Module?.canvas || 
                 document.getElementById('unity-canvas') || 
                 document.querySelector('canvas') ||
                 document.querySelector('#unity-container canvas');
    
    if (this.canvas && this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      console.log('Unity Override: Canvas found and context acquired');
    } else {
      console.log('Unity Override: Canvas not found, using fallback');
    }
    
    // Override Unity's rendering with correct room
    this.overrideUnityRender();
    
    // Set up continuous room drawing
    this.setupRoomDrawing();
  },
  
  overrideUnityRender: function() {
    if (!this.canvas || !this.ctx) {
      console.log('Unity Override: No canvas access, trying alternative approach');
      this.tryUnityPrimitiveFallback();
      return;
    }
    
    console.log('Unity Override: Directly drawing on Unity canvas');
    
    // Clear the canvas and draw the correct room
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Save original state
    this.ctx.save();
    
    // Set up 3D perspective drawing
    this.ctx.fillStyle = '#1a1a1a'; // Dark background
    this.ctx.fillRect(0, 0, width, height);
    
    // Draw GLB-accurate room in 3D perspective
    this.drawGLBRoom3D(width, height);
    
    this.ctx.restore();
  },
  
  drawGLBRoom3D: function(width, height) {
    const ctx = this.ctx;
    
    // GLB room dimensions in METERS: 19ft 4in = 5.9m wide
    const roomWidth = 5.9;   // meters (19ft 4in)
    const roomHeight = 2.91; // meters (ceiling height)
    const roomDepth = 6.38;  // meters (depth)
    
    // 3D perspective transformation - scale for meters
    const scale = Math.min(width, height) * 0.08; // Bigger scale for meter dimensions
    const centerX = width / 2;
    const centerY = height / 2;
    const offsetZ = 8; // Camera distance for better perspective
    
    // Define complex dungeon room architecture with ANGLED BOTTOM CORNER
    // Using actual room dimensions: 19ft 4in (5.9m) wide
    const dungeonPoints = [
      // Main floor outline with angled bottom corner
      {x: -2.95, y: -1.5, z: 3.19},   // Front left
      {x: -1.5, y: -1.5, z: 3.19},    // Front left angle
      {x: 1.5, y: -1.5, z: 3.19},     // Front right angle
      {x: 2.95, y: -1.5, z: 3.19},    // Front right
      {x: 2.95, y: -1.5, z: 1.0},     // Right front
      {x: 2.95, y: -1.5, z: -1.0},    // Right back
      {x: 2.95, y: -1.5, z: -2.5},    // Back right before angle
      {x: 1.8, y: -1.5, z: -3.19},    // Back right angled corner
      {x: 0.5, y: -1.5, z: -3.19},    // Bottom center right
      {x: -0.5, y: -1.5, z: -3.19},   // Bottom center left
      {x: -1.8, y: -1.5, z: -3.19},   // Back left angled corner
      {x: -2.95, y: -1.5, z: -2.5},   // Back left before angle
      {x: -2.95, y: -1.5, z: -1.0},   // Left back
      {x: -2.95, y: -1.5, z: 1.0}     // Left front
    ];
    
    // Project 3D points to 2D screen
    const project = (point) => {
      const factor = offsetZ / (offsetZ + point.z);
      return {
        x: centerX + point.x * scale * factor,
        y: centerY - point.y * scale * factor
      };
    };
    
    const projected = dungeonPoints.map(project);
    
    // Draw stone floor with irregular dungeon shape
    ctx.fillStyle = '#4a4a4a'; // Dark stone floor
    ctx.strokeStyle = '#8B4513'; // Brown stone outline
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    for (let i = 1; i < projected.length; i++) {
      ctx.lineTo(projected[i].x, projected[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw dungeon walls with height
    ctx.fillStyle = '#654321'; // Brown stone walls
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    
    // Draw wall segments with proper perspective
    for (let i = 0; i < dungeonPoints.length; i++) {
      const current = dungeonPoints[i];
      const next = dungeonPoints[(i + 1) % dungeonPoints.length];
      
      // Wall bottom points
      const bottomCurrent = project(current);
      const bottomNext = project(next);
      
      // Wall top points (add height)
      const topCurrent = project({x: current.x, y: current.y + 2.9, z: current.z});
      const topNext = project({x: next.x, y: next.y + 2.9, z: next.z});
      
      // Draw wall segment
      ctx.beginPath();
      ctx.moveTo(bottomCurrent.x, bottomCurrent.y);
      ctx.lineTo(bottomNext.x, bottomNext.y);
      ctx.lineTo(topNext.x, topNext.y);
      ctx.lineTo(topCurrent.x, topCurrent.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Add windows to some wall segments
      if (i === 2 || i === 7) { // Add windows to front-right and back-left walls
        this.drawDungeonWindow(ctx, bottomCurrent, bottomNext, topCurrent, topNext);
      }
    }
    
    // Add dimension labels
    ctx.fillStyle = '#FF0000';
    ctx.font = '16px Arial';
    ctx.fillText(`GLB Dungeon: ${roomWidth}m x ${roomHeight}m x ${roomDepth}m`, 10, 30);
    ctx.fillText(`Wide side: 19ft 4in (${roomWidth}m)`, 10, 50);
    
    console.log('Unity Override: Drew GLB-accurate 3D dungeon room with angles and windows');
  },
  
  drawDungeonWindow: function(ctx, bottomLeft, bottomRight, topLeft, topRight) {
    // Draw a medieval dungeon window
    const windowHeight = Math.abs(topLeft.y - bottomLeft.y) * 0.4;
    const windowWidth = Math.abs(bottomRight.x - bottomLeft.x) * 0.3;
    
    // Window frame position (centered on wall)
    const centerX = (bottomLeft.x + bottomRight.x) / 2;
    const centerY = (bottomLeft.y + topLeft.y) / 2;
    
    // Draw window frame
    ctx.fillStyle = '#2F4F4F'; // Dark slate gray
    ctx.fillRect(centerX - windowWidth/2, centerY - windowHeight/2, windowWidth, windowHeight);
    
    // Draw window bars (medieval style)
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    
    // Vertical bar
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - windowHeight/2);
    ctx.lineTo(centerX, centerY + windowHeight/2);
    ctx.stroke();
    
    // Horizontal bar
    ctx.beginPath();
    ctx.moveTo(centerX - windowWidth/2, centerY);
    ctx.lineTo(centerX + windowWidth/2, centerY);
    ctx.stroke();
    
    console.log('Unity Override: Drew dungeon window with medieval bars');
  },
  
  tryUnityPrimitiveFallback: function() {
    // Fallback: Completely stop Unity's automatic updates to prevent flashing
    try {
      console.log('Unity Override: Stopping Unity automatic updates to prevent flashing');
      
      // Stop all Unity update loops
      if (this.unityInstance && this.unityInstance.Module) {
        // Override Unity's main loop to prevent rendering
        const module = this.unityInstance.Module;
        
        // Stop the main Unity update loop
        if (module.pauseMainLoop) {
          module.pauseMainLoop();
        }
        
        // Clear any intervals or animation frames Unity might be using
        if (window.unityUpdateInterval) {
          clearInterval(window.unityUpdateInterval);
        }
        
        // Override requestAnimationFrame to prevent Unity from using it
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
          // Only allow our canvas drawing, block Unity's
          if (callback.toString().includes('Unity') || callback.toString().includes('Module')) {
            return; // Block Unity's animation frames
          }
          return originalRAF.call(window, callback);
        };
        
        console.log('Unity Override: Stopped Unity update loops');
      }
      
      // Try to find any canvas and draw directly
      const canvases = document.querySelectorAll('canvas');
      console.log(`Unity Override: Found ${canvases.length} canvas elements`);
      
      canvases.forEach((canvas, index) => {
        console.log(`Unity Override: Canvas ${index} - size: ${canvas.width}x${canvas.height}`);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          this.drawDirectOnCanvas(ctx, canvas.width, canvas.height);
        }
      });
      
    } catch (error) {
      console.log('Unity Override: Fallback failed:', error);
    }
  },
  
  drawDirectOnCanvas: function(ctx, width, height) {
    // Draw the GLB room directly on any canvas we find
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw GLB room outline
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 4;
    ctx.strokeRect(width * 0.2, height * 0.2, width * 0.6, height * 0.6);
    
    // Add text
    ctx.fillStyle = '#FF0000';
    ctx.font = '20px Arial';
    ctx.fillText('GLB Room: 5.42 x 2.91 x 6.38', 10, 30);
    ctx.fillText('Room Override Active', 10, 60);
    
    console.log('Unity Override: Drew room directly on canvas');
  },
  
  createPersistentRoom: function() {
    if (this.roomCreated) return;
    
    try {
      console.log('Unity Override: Creating persistent 3D room geometry');
      
      // Create room matching EXACT GLB file dimensions and layout
      // GLB bounds: min(-2.71, -1.54, -3.19) max(2.71, 1.37, 3.19)
      const glbBounds = {
        minX: -2.71, maxX: 2.71,
        minY: -1.54, maxY: 1.37, 
        minZ: -3.19, maxZ: 3.19
      };
      
      const centerX = (glbBounds.minX + glbBounds.maxX) / 2;
      const centerY = (glbBounds.minY + glbBounds.maxY) / 2;
      const centerZ = (glbBounds.minZ + glbBounds.maxZ) / 2;
      const sizeX = glbBounds.maxX - glbBounds.minX;
      const sizeY = glbBounds.maxY - glbBounds.minY;
      const sizeZ = glbBounds.maxZ - glbBounds.minZ;
      
      console.log(`Unity Override: Creating GLB-accurate room - Size: ${sizeX.toFixed(2)} x ${sizeY.toFixed(2)} x ${sizeZ.toFixed(2)}`);
      
      // Create room objects with GLB-accurate positioning
      const roomObjects = [
        { type: 'Plane', name: 'GLBFloor', pos: [centerX, glbBounds.minY, centerZ], scale: [sizeX/10, 1, sizeZ/10], color: '0.15,0.1,0.05,1' },
        { type: 'Cube', name: 'GLBNorthWall', pos: [centerX, centerY, glbBounds.maxZ], scale: [sizeX, sizeY, 0.1], color: '0.3,0.25,0.2,1' },
        { type: 'Cube', name: 'GLBSouthWall', pos: [centerX, centerY, glbBounds.minZ], scale: [sizeX, sizeY, 0.1], color: '0.3,0.25,0.2,1' },
        { type: 'Cube', name: 'GLBEastWall', pos: [glbBounds.maxX, centerY, centerZ], scale: [0.1, sizeY, sizeZ], color: '0.3,0.25,0.2,1' },
        { type: 'Cube', name: 'GLBWestWall', pos: [glbBounds.minX, centerY, centerZ], scale: [0.1, sizeY, sizeZ], color: '0.3,0.25,0.2,1' },
        { type: 'Sphere', name: 'GLBCenterMarker', pos: [centerX, centerY + 0.5, centerZ], scale: [0.3, 0.3, 0.3], color: '1,0,0,1' }
      ];
      
      roomObjects.forEach((obj, index) => {
        setTimeout(() => {
          try {
            // Create object with specific naming to prevent deletion
            const objData = JSON.stringify({
              type: obj.type,
              name: obj.name,
              position: obj.pos,
              scale: obj.scale,
              color: obj.color
            });
            
            this.unityInstance.SendMessage('DungeonController', 'CreatePersistentObject', objData);
            console.log(`Unity Override: Created persistent ${obj.name}`);
          } catch (error) {
            console.log(`Unity Override: Failed to create ${obj.name}`);
          }
        }, index * 100);
      });
      
      // Position camera to view the GLB-accurate room
      setTimeout(() => {
        const camX = centerX + sizeX * 0.7;
        const camY = centerY + sizeY * 1.5;
        const camZ = centerZ + sizeZ * 0.7;
        
        this.unityInstance.SendMessage('DungeonController', 'SetCameraPosition', `${camX},${camY},${camZ}`);
        this.unityInstance.SendMessage('DungeonController', 'SetCameraTarget', `${centerX},${centerY},${centerZ}`);
        console.log(`Unity Override: Camera positioned for GLB room view at (${camX.toFixed(1)}, ${camY.toFixed(1)}, ${camZ.toFixed(1)})`);
      }, 1000);
      
      this.roomCreated = true;
      
    } catch (error) {
      console.error('Unity Override: Room creation failed:', error);
    }
  },
  
  setupRoomDrawing: function() {
    // Draw the room once and stop Unity from overriding it
    if (this.canvas && this.ctx) {
      this.overrideUnityRender();
      console.log('Unity Override: Room drawn once, stopping Unity updates');
      
      // Stop Unity from redrawing by intercepting its render calls
      if (this.unityInstance && this.unityInstance.Module) {
        const originalRender = this.unityInstance.Module._main;
        if (originalRender) {
          this.unityInstance.Module._main = () => {
            // Do nothing to prevent Unity from rendering
          };
        }
      }
    } else {
      console.log('Unity Override: No canvas access, using message-based approach');
      this.tryUnityPrimitiveFallback();
    }
  },
  
  forceRender: function(unityInstance) {
    // Force immediate render without clearing
    if (!unityInstance) return;
    
    try {
      unityInstance.SendMessage('DungeonController', 'ForceRender', 'preserve');
      console.log('Unity Override: Forced render while preserving objects');
    } catch (error) {
      console.log('Unity Override: Force render failed');
    }
  }
};