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
      // Disable the automatic room clearing that's happening
      this.unityInstance.SendMessage('DungeonController', 'StopAutoClear', 'true');
      this.unityInstance.SendMessage('Canvas', 'SetActive', 'false'); // Disable 2D overlay
      console.log('Unity Override: Stopped automatic room clearing');
    } catch (error) {
      console.log('Unity Override: Could not stop room clearing:', error.message);
    }
  },
  
  createPersistentRoom: function() {
    if (this.roomCreated) return;
    
    try {
      console.log('Unity Override: Creating persistent 3D room geometry');
      
      // Create room based on actual GLB dimensions
      const roomData = {
        center: { x: 0, y: 0, z: 0 },
        size: { x: 5.4, y: 2.9, z: 6.4 } // From GLB bounding box
      };
      
      // Create persistent objects with specific names to avoid clearing
      const roomObjects = [
        { type: 'Plane', name: 'PersistentFloor', pos: [0, -1.5, 0], scale: [5.4, 1, 6.4], color: '0.2,0.2,0.2,1' },
        { type: 'Cube', name: 'PersistentNorthWall', pos: [0, 0, 3.2], scale: [5.4, 2.9, 0.2], color: '0.4,0.4,0.4,1' },
        { type: 'Cube', name: 'PersistentSouthWall', pos: [0, 0, -3.2], scale: [5.4, 2.9, 0.2], color: '0.4,0.4,0.4,1' },
        { type: 'Cube', name: 'PersistentEastWall', pos: [2.7, 0, 0], scale: [0.2, 2.9, 6.4], color: '0.4,0.4,0.4,1' },
        { type: 'Cube', name: 'PersistentWestWall', pos: [-2.7, 0, 0], scale: [0.2, 2.9, 6.4], color: '0.4,0.4,0.4,1' },
        { type: 'Sphere', name: 'PersistentTestSphere', pos: [0, 2, 0], scale: [1, 1, 1], color: '1,0,0,1' }
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
      
      // Position camera to view the room
      setTimeout(() => {
        this.unityInstance.SendMessage('DungeonController', 'SetCameraPosition', '4,3,6');
        this.unityInstance.SendMessage('DungeonController', 'SetCameraTarget', '0,0,0');
        console.log('Unity Override: Camera positioned for room view');
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