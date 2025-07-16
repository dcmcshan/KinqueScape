// Unity Room Override Script
// This script creates persistent 3D room geometry using Unity's WebGL runtime

window.UnityRoomOverride = {
  unityInstance: null,
  roomCreated: false,
  
  createDungeonRoom: function(unityInstance) {
    console.log('Unity Override: Creating persistent dungeon room');
    this.unityInstance = unityInstance;
    
    if (!unityInstance) {
      console.error('Unity Override: No Unity instance available');
      return;
    }
    
    // Stop any existing room clearing
    this.stopRoomClearing();
    
    // Create persistent room geometry
    this.createPersistentRoom();
    
    // Set up continuous monitoring to prevent clearing
    this.setupRoomMonitoring();
  },
  
  stopRoomClearing: function() {
    try {
      // Aggressively disable all existing room systems
      this.unityInstance.SendMessage('DungeonController', 'ClearScene', '');
      this.unityInstance.SendMessage('DungeonController', 'DestroyAllRoomObjects', '');
      this.unityInstance.SendMessage('Canvas', 'SetActive', 'false');
      
      // Disable the hardcoded room that keeps appearing
      const destroyCommands = [
        'StaticDungeonRoom',
        'DungeonWalls', 
        'DungeonFloor',
        'RoomBoundary',
        'DefaultRoom'
      ];
      
      destroyCommands.forEach(objName => {
        try {
          this.unityInstance.SendMessage('GameObject', 'Destroy', objName);
        } catch (e) {
          // Continue trying all object names
        }
      });
      
      console.log('Unity Override: Aggressively cleared existing room');
    } catch (error) {
      console.log('Unity Override: Room clearing attempt:', error.message);
    }
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
  
  setupRoomMonitoring: function() {
    // Continuously recreate room if it gets cleared
    setInterval(() => {
      if (this.unityInstance && this.roomCreated) {
        try {
          // Ensure persistent objects stay visible
          this.unityInstance.SendMessage('DungeonController', 'EnsurePersistentObjects', '');
        } catch (error) {
          // If this fails, try to recreate the room
          this.roomCreated = false;
          this.createPersistentRoom();
        }
      }
    }, 2000);
    
    console.log('Unity Override: Room monitoring active');
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