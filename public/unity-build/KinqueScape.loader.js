// Unity WebGL Loader - Development Implementation
// Compatible with react-unity-webgl

(function() {
  var unityInstance = null;
  
  // Unity WebGL API compatibility
  window.createUnityInstance = function(canvas, config, onProgress) {
    return new Promise((resolve, reject) => {
      console.log('Unity WebGL: Creating instance with config:', config);
      
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
              
              // Handle specific Unity messages
              if (methodName === 'UpdateDevices') {
                try {
                  var devices = JSON.parse(parameter);
                  console.log('Unity: Updated', devices.length, 'devices');
                  updateDeviceVisuals(canvas, devices);
                } catch (e) {
                  console.error('Unity: Error parsing devices:', e);
                }
              } else if (methodName === 'UpdateParticipants') {
                try {
                  var participants = JSON.parse(parameter);
                  console.log('Unity: Updated', participants.length, 'participants');
                  updateParticipantVisuals(canvas, participants);
                } catch (e) {
                  console.error('Unity: Error parsing participants:', e);
                }
              } else if (methodName === 'ResetCamera') {
                console.log('Unity: Camera reset');
                redrawScene(canvas);
              } else if (methodName === 'ZoomIn') {
                console.log('Unity: Zooming in');
                redrawScene(canvas);
              } else if (methodName === 'ZoomOut') {
                console.log('Unity: Zooming out');
                redrawScene(canvas);
              } else if (methodName === 'RefreshLighting') {
                console.log('Unity: Refreshing lighting effects');
                redrawScene(canvas);
              }
            },
            
            Module: {
              canvas: canvas
            }
          };
          
          // Initialize the scene
          console.log('Unity: Initializing scene on canvas:', canvas.width, 'x', canvas.height);
          initializeScene(canvas);
          
          // Set up click handlers
          setupClickHandlers(canvas);
          
          // Notify React that Unity is ready
          setTimeout(() => {
            if (window.ReactUnityWebGL && window.ReactUnityWebGL.dispatchEvent) {
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
  
  var currentDevices = [];
  var currentParticipants = [];
  
  function initializeScene(canvas) {
    redrawScene(canvas);
  }
  
  function redrawScene(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unity: Could not get 2D context for canvas');
      return;
    }
    
    console.log('Unity: Redrawing scene on canvas:', canvas.width, 'x', canvas.height);
    
    // Clear canvas
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
    
    // Draw title and lighting info
    ctx.fillStyle = '#ff0040';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Unity WebGL Dungeon Environment', canvas.width / 2, 30);
    
    // Count and display light sources
    var lightCount = currentDevices.filter(function(device) {
      return device.type === 'light' && device.status === 'online';
    }).length;
    ctx.fillStyle = '#ffdd44';
    ctx.font = '14px Arial';
    ctx.fillText(lightCount + ' Light Sources Active', canvas.width / 2, 50);
    
    // Draw devices with enhanced visibility
    console.log('Unity: Drawing', currentDevices.length, 'devices');
    currentDevices.forEach(function(device) {
      drawDevice(ctx, device, canvas.width, canvas.height);
    });
    
    // Draw participants
    currentParticipants.forEach(function(participant) {
      drawParticipant(ctx, participant, canvas.width, canvas.height);
    });
    
    // Draw legend
    drawLegend(ctx, canvas.width, canvas.height);
  }
  
  function updateDeviceVisuals(canvas, devices) {
    currentDevices = devices;
    redrawScene(canvas);
  }
  
  function updateParticipantVisuals(canvas, participants) {
    currentParticipants = participants;
    redrawScene(canvas);
  }
  
  function drawDevice(ctx, device, canvasWidth, canvasHeight) {
    // Convert 3D position to 2D canvas coordinates
    var x = ((device.position.x + 5) / 10) * canvasWidth * 0.8 + canvasWidth * 0.1;
    var y = ((device.position.z + 5) / 10) * canvasHeight * 0.8 + canvasHeight * 0.1;
    
    console.log('Unity: Drawing device', device.name, 'at', x, y, 'type:', device.type);
    
    // Special handling for light sources
    if (device.type === 'light') {
      console.log('Unity: Drawing LIGHT at', x, y, device.name);
      // Draw light glow effect
      var gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
      gradient.addColorStop(0, 'rgba(255, 200, 100, 0.9)');
      gradient.addColorStop(0.3, 'rgba(255, 150, 50, 0.6)');
      gradient.addColorStop(0.7, 'rgba(255, 100, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 50, 0, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 30, y - 30, 60, 60);
      
      // Draw torch/light icon - larger and brighter
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = device.status === 'online' ? '#ffff44' : '#666';
      ctx.fill();
      
      // Add bright border for lights
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Add flame effect for online lights
      if (device.status === 'online') {
        ctx.beginPath();
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x - 8, y - 25);
        ctx.lineTo(x + 8, y - 25);
        ctx.closePath();
        ctx.fillStyle = '#ff3300';
        ctx.fill();
        
        // Add inner flame
        ctx.beginPath();
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x - 4, y - 22);
        ctx.lineTo(x + 4, y - 22);
        ctx.closePath();
        ctx.fillStyle = '#ffaa00';
        ctx.fill();
      }
    } else {
      // Draw regular device circle
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      
      // Color based on device type
      var deviceColors = {
        'lock': '#ff4444',
        'sound': '#44ff44', 
        'camera': '#4444ff',
        'prop': '#ffaa44',
        'sensor': '#aa44ff'
      };
      ctx.fillStyle = device.status === 'online' ? (deviceColors[device.type] || '#00ff00') : '#ff0000';
      ctx.fill();
    }
    
    // Draw device border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw device name
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(device.name, x, y + 25);
  }
  
  function drawParticipant(ctx, participant, canvasWidth, canvasHeight) {
    var x = (participant.position.x / 10) * canvasWidth * 0.8 + canvasWidth * 0.1;
    var y = (participant.position.z / 10) * canvasHeight * 0.8 + canvasHeight * 0.1;
    
    // Draw participant as human figure
    ctx.fillStyle = '#0099ff';
    
    // Head
    ctx.beginPath();
    ctx.arc(x, y - 15, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Body
    ctx.fillRect(x - 3, y - 10, 6, 15);
    
    // Arms
    ctx.fillRect(x - 8, y - 5, 5, 2);
    ctx.fillRect(x + 3, y - 5, 5, 2);
    
    // Legs
    ctx.fillRect(x - 2, y + 5, 2, 10);
    ctx.fillRect(x, y + 5, 2, 10);
    
    // Draw participant name
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(participant.name, x, y + 25);
  }
  
  function drawLegend(ctx, canvasWidth, canvasHeight) {
    var legendY = canvasHeight - 40;
    
    // Online devices
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(20, legendY, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Online Device', 30, legendY + 4);
    
    // Offline devices
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(130, legendY, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.fillText('Offline Device', 140, legendY + 4);
    
    // Participants
    ctx.fillStyle = '#0099ff';
    ctx.fillRect(250, legendY - 5, 10, 10);
    
    ctx.fillStyle = '#fff';
    ctx.fillText('Participant', 265, legendY + 4);
  }
  
  function setupClickHandlers(canvas) {
    canvas.addEventListener('click', function(event) {
      var rect = canvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      
      // Check device clicks
      currentDevices.forEach(function(device) {
        var deviceX = (device.position.x / 10) * canvas.width * 0.8 + canvas.width * 0.1;
        var deviceY = (device.position.z / 10) * canvas.height * 0.8 + canvas.height * 0.1;
        
        var distance = Math.sqrt(Math.pow(x - deviceX, 2) + Math.pow(y - deviceY, 2));
        if (distance < 15) {
          console.log('Device clicked:', device.id);
          if (window.ReactUnityWebGL && window.ReactUnityWebGL.dispatchEvent) {
            window.ReactUnityWebGL.dispatchEvent('ReactMessage', JSON.stringify({
              type: 'device_click',
              deviceId: device.id
            }));
          }
        }
      });
      
      // Check participant clicks
      currentParticipants.forEach(function(participant) {
        var participantX = (participant.position.x / 10) * canvas.width * 0.8 + canvas.width * 0.1;
        var participantY = (participant.position.z / 10) * canvas.height * 0.8 + canvas.height * 0.1;
        
        var distance = Math.sqrt(Math.pow(x - participantX, 2) + Math.pow(y - participantY, 2));
        if (distance < 20) {
          console.log('Participant clicked:', participant.id);
          if (window.ReactUnityWebGL && window.ReactUnityWebGL.dispatchEvent) {
            window.ReactUnityWebGL.dispatchEvent('ReactMessage', JSON.stringify({
              type: 'participant_click',
              participantId: participant.id
            }));
          }
        }
      });
    });
  }
  
  console.log('Unity WebGL Loader initialized (development mode)');
})();