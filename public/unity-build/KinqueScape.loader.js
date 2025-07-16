// Unity WebGL Loader - Minimal Implementation for Development
// This is a development placeholder until actual Unity build is ready

(function() {
  var unityInstance = null;
  
  // Unity WebGL API compatibility
  window.createUnityInstance = function(canvas, config, onProgress) {
    return new Promise((resolve, reject) => {
      // Simulate loading progress
      var progress = 0;
      var interval = setInterval(() => {
        progress += 0.1;
        if (onProgress) onProgress(progress);
        
        if (progress >= 1) {
          clearInterval(interval);
          
          // Create mock Unity instance
          unityInstance = {
            SendMessage: function(gameObjectName, methodName, parameter) {
              console.log('Unity SendMessage:', gameObjectName, methodName, parameter);
              
              // Simulate Unity responses
              setTimeout(() => {
                if (methodName === 'UpdateDevices') {
                  console.log('Unity: Devices updated');
                } else if (methodName === 'UpdateParticipants') {
                  console.log('Unity: Participants updated');
                } else if (methodName === 'ResetCamera') {
                  console.log('Unity: Camera reset');
                }
              }, 100);
            },
            
            Module: {
              canvas: canvas
            }
          };
          
          // Draw basic 3D scene on canvas
          drawBasicScene(canvas);
          
          // Notify React that Unity is ready
          setTimeout(() => {
            if (window.ReactUnityWebGL) {
              window.ReactUnityWebGL.dispatchEvent('ReactMessage', JSON.stringify({
                type: 'unity_ready'
              }));
            }
          }, 500);
          
          resolve(unityInstance);
        }
      }, 100);
    });
  };
  
  function drawBasicScene(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set up canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw dungeon floor grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    var gridSize = 40;
    for (var x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (var y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw title
    ctx.fillStyle = '#ff0040';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Unity WebGL Dungeon Environment', canvas.width / 2, 50);
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('Waiting for Unity build files...', canvas.width / 2, 80);
    ctx.fillText('Place Unity build files in /public/unity-build/', canvas.width / 2, 100);
    
    // Draw some basic shapes as placeholder
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.3, canvas.height * 0.4, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#0099ff';
    ctx.fillRect(canvas.width * 0.6 - 5, canvas.height * 0.6 - 10, 10, 20);
    
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5, canvas.height * 0.3, 6, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Mock Unity build configuration
  window.unityBuildConfig = {
    dataUrl: '/unity-build/KinqueScape.data',
    frameworkUrl: '/unity-build/KinqueScape.framework.js',
    codeUrl: '/unity-build/KinqueScape.wasm',
    streamingAssetsUrl: 'StreamingAssets',
    companyName: 'KinqueScape',
    productName: 'Dungeon Demo',
    productVersion: '1.0.0',
  };
  
  console.log('Unity WebGL Loader initialized (development mode)');
})();