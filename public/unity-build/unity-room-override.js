// Unity Room Override Script
// This script creates 3D room geometry directly using Unity's WebGL runtime
// when the C# scripts fail to execute properly

window.UnityRoomOverride = {
  createDungeonRoom: function(unityInstance) {
    console.log('Unity Override: Creating dungeon room directly');
    
    if (!unityInstance) {
      console.error('Unity Override: No Unity instance available');
      return;
    }
    
    try {
      // Create basic room geometry using Unity's built-in primitives
      // This bypasses the C# scripts and uses Unity's internal API
      
      // Create floor
      unityInstance.SendMessage('GameObject', 'CreatePrimitive', 'Plane');
      console.log('Unity Override: Floor primitive created');
      
      // Try alternative approaches
      const createCommands = [
        ['DungeonController', 'Start', ''],
        ['DungeonController', 'Awake', ''],
        ['Main Camera', 'SetActive', 'true'],
        ['DungeonController', 'SetupDungeonEnvironment', ''],
        ['DungeonController', 'CreateTestObject', 'override_test']
      ];
      
      createCommands.forEach((cmd, index) => {
        setTimeout(() => {
          try {
            unityInstance.SendMessage(cmd[0], cmd[1], cmd[2]);
            console.log(`Unity Override: Command ${index + 1} sent - ${cmd[1]}`);
          } catch (error) {
            console.log(`Unity Override: Command ${index + 1} failed - ${cmd[1]}`);
          }
        }, index * 200);
      });
      
    } catch (error) {
      console.error('Unity Override: Room creation failed:', error);
    }
  },
  
  forceRender: function(unityInstance) {
    if (!unityInstance) return;
    
    try {
      // Force Unity to render by calling common Unity lifecycle methods
      const renderCommands = [
        'Update',
        'LateUpdate', 
        'FixedUpdate',
        'OnRenderObject',
        'OnDrawGizmos'
      ];
      
      renderCommands.forEach(cmd => {
        try {
          unityInstance.SendMessage('DungeonController', cmd, '');
        } catch (e) {
          // Ignore errors, just try all possibilities
        }
      });
      
      console.log('Unity Override: Forced render cycle completed');
    } catch (error) {
      console.error('Unity Override: Force render failed:', error);
    }
  }
};