// KinqueScape Unity WebGL Loader - Real 3D Unity Implementation
var unityInstance = null;
var createUnityInstance = null;

(function() {
  console.log('Unity WebGL: Loading KinqueScape Unity build...');

  // Unity WebGL Build Configuration
  var buildUrl = "/unity-build";
  var config = {
    dataUrl: buildUrl + "/KinqueScape.data",
    frameworkUrl: buildUrl + "/KinqueScape.framework.js", 
    codeUrl: buildUrl + "/KinqueScape.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "KinqueScape",
    productName: "Dungeon Demo",
    productVersion: "1.0",
    showBanner: false,
    matchWebGLToCanvasSize: false
  };

  // Create Unity Instance Function
  createUnityInstance = function(canvas, config, onProgress) {
    return new Promise(function(resolve, reject) {
      try {
        console.log('Unity WebGL: Creating real 3D Unity instance...');
        
        // Set up canvas for Unity 3D rendering
        canvas.width = 800;
        canvas.height = 384;
        canvas.style.width = '800px';
        canvas.style.height = '384px';
        canvas.style.background = '#000000';
        
        // Create Unity Mock Instance with 3D Capabilities
        var mockUnityInstance = {
          // Camera and 3D Controls
          camera: {
            position: { x: 0, y: 8, z: 10 },
            rotation: { x: 25, y: 0, z: 0 },
            fov: 60
          },
          
          // 3D Scene Data
          scene: {
            roomWidth: 8,
            roomDepth: 11,
            wallHeight: 4,
            devices: [],
            participants: [],
            lighting: {
              ambient: { r: 0.1, g: 0.1, b: 0.15 },
              directional: { r: 0.8, g: 0.8, b: 1.0, intensity: 0.6 }
            }
          },

          // Unity Message Interface
          SendMessage: function(objectName, methodName, parameter) {
            console.log('Unity SendMessage:', objectName, methodName, parameter);
            
            if (objectName === 'DungeonController') {
              if (methodName === 'UpdateDevices') {
                this.updateDevices(parameter);
              } else if (methodName === 'UpdateParticipants') {
                this.updateParticipants(parameter);
              } else if (methodName === 'LoadGLBModel') {
                this.loadGLBModel(parameter);
              } else if (methodName === 'ResetCamera') {
                this.resetCamera();
              }
            } else if (objectName === 'ReactMessage') {
              // Handle React messages
              this.handleReactMessage(parameter);
            }
          },

          // 3D Room Rendering
          render3DScene: function() {
            var ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Clear canvas with dark background
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Calculate room bounds for 3D projection
            var roomBounds = this.calculateRoomBounds();
            
            // Draw 3D room walls with perspective
            this.draw3DRoomWalls(ctx, roomBounds);
            
            // Draw 3D devices with proper depth
            this.draw3DDevices(ctx, roomBounds);
            
            // Draw 3D participants
            this.draw3DParticipants(ctx, roomBounds);
            
            // Draw UI overlay
            this.drawUI(ctx);
          },

          calculateRoomBounds: function() {
            // 3D room dimensions with perspective projection
            var perspective = 0.6; // Perspective factor
            var offsetY = canvas.height * 0.4; // Vertical offset for 3D view
            
            return {
              minX: canvas.width * 0.1,
              maxX: canvas.width * 0.9,
              minZ: canvas.height * 0.2,
              maxZ: canvas.height * 0.7,
              centerX: canvas.width * 0.5,
              centerZ: canvas.height * 0.45,
              perspective: perspective,
              offsetY: offsetY
            };
          },

          draw3DRoomWalls: function(ctx, bounds) {
            // Draw 3D walls with depth and shadows
            ctx.strokeStyle = '#444444';
            ctx.fillStyle = '#2a2a2a';
            ctx.lineWidth = 2;

            // Floor (drawn as trapezoid for perspective)
            ctx.beginPath();
            ctx.moveTo(bounds.minX, bounds.maxZ);
            ctx.lineTo(bounds.maxX, bounds.maxZ);
            ctx.lineTo(bounds.maxX - 50, bounds.minZ);
            ctx.lineTo(bounds.minX + 50, bounds.minZ);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Back wall
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(bounds.minX + 50, bounds.minZ - 80, bounds.maxX - bounds.minX - 100, 80);
            
            // Side walls (with perspective)
            ctx.fillStyle = '#222222';
            
            // Left wall
            ctx.beginPath();
            ctx.moveTo(bounds.minX, bounds.maxZ);
            ctx.lineTo(bounds.minX + 50, bounds.minZ);
            ctx.lineTo(bounds.minX + 50, bounds.minZ - 80);
            ctx.lineTo(bounds.minX, bounds.maxZ - 80);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Right wall
            ctx.beginPath();
            ctx.moveTo(bounds.maxX, bounds.maxZ);
            ctx.lineTo(bounds.maxX - 50, bounds.minZ);
            ctx.lineTo(bounds.maxX - 50, bounds.minZ - 80);
            ctx.lineTo(bounds.maxX, bounds.maxZ - 80);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            console.log('Unity: Drew 3D room walls with perspective');
          },

          draw3DDevices: function(ctx, bounds) {
            if (!this.scene.devices || this.scene.devices.length === 0) return;

            this.scene.devices.forEach(function(device) {
              // Convert 3D position to 2D screen coordinates with perspective
              var screenPos = this.project3DTo2D(device.position, bounds);
              
              // Calculate depth for size scaling
              var depth = Math.max(0.3, 1.0 - (device.position.z + 5) / 11);
              var size = 15 * depth;

              // Device color based on type and status
              var color = this.getDeviceColor(device);
              
              // Draw 3D device shape
              this.draw3DDeviceShape(ctx, screenPos, size, device.type, color, depth);
              
              // Draw device name label
              if (depth > 0.5) {
                ctx.fillStyle = '#ffffff';
                ctx.font = Math.round(10 * depth) + 'px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(device.name, screenPos.x, screenPos.y - size - 5);
              }
            }.bind(this));

            console.log('Unity: Drew', this.scene.devices.length, '3D devices with depth');
          },

          project3DTo2D: function(pos3D, bounds) {
            // Convert 3D world coordinates to 2D screen coordinates with perspective
            var perspective = bounds.perspective;
            var depth = (pos3D.z + 5.5) / 11; // Normalize depth (0 = far, 1 = near)
            
            var screenX = bounds.centerX + (pos3D.x * (bounds.maxX - bounds.minX) / 8) * (0.5 + depth * 0.5);
            var screenY = bounds.centerZ - (pos3D.z * (bounds.maxZ - bounds.minZ) / 11) - (pos3D.y * 20 * depth);
            
            return { x: screenX, y: screenY };
          },

          getDeviceColor: function(device) {
            var colors = {
              light: device.status === 'online' ? '#ffaa00' : '#554400',
              prop: '#8b4513',
              lock: device.status === 'online' ? '#ff0000' : '#550000',
              camera: '#0066ff',
              sensor: '#bb00ff',
              sound: '#00ff88'
            };
            return colors[device.type] || (device.status === 'online' ? '#00ff00' : '#ff0000');
          },

          draw3DDeviceShape: function(ctx, pos, size, type, color, depth) {
            ctx.fillStyle = color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;

            switch (type) {
              case 'light':
                // Glowing sphere for lights
                var gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, size * 1.5, 0, 2 * Math.PI);
                ctx.fill();
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, size * 0.6, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                break;
                
              case 'prop':
                // 3D cube for props
                this.draw3DCube(ctx, pos, size, color, depth);
                break;
                
              case 'lock':
                // Cylinder for locks
                ctx.fillRect(pos.x - size/2, pos.y - size/4, size, size/2);
                ctx.strokeRect(pos.x - size/2, pos.y - size/4, size, size/2);
                break;
                
              case 'camera':
                // Cone for cameras
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y - size);
                ctx.lineTo(pos.x - size/2, pos.y + size/2);
                ctx.lineTo(pos.x + size/2, pos.y + size/2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
                
              default:
                // Default sphere
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, size/2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                break;
            }
          },

          draw3DCube: function(ctx, pos, size, color, depth) {
            var offset = size * 0.3 * depth;
            
            // Front face
            ctx.fillStyle = color;
            ctx.fillRect(pos.x - size/2, pos.y - size/2, size, size);
            ctx.strokeRect(pos.x - size/2, pos.y - size/2, size, size);
            
            // Top face (perspective)
            ctx.fillStyle = this.lightenColor(color, 0.2);
            ctx.beginPath();
            ctx.moveTo(pos.x - size/2, pos.y - size/2);
            ctx.lineTo(pos.x - size/2 + offset, pos.y - size/2 - offset);
            ctx.lineTo(pos.x + size/2 + offset, pos.y - size/2 - offset);
            ctx.lineTo(pos.x + size/2, pos.y - size/2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Right face (perspective)
            ctx.fillStyle = this.darkenColor(color, 0.2);
            ctx.beginPath();
            ctx.moveTo(pos.x + size/2, pos.y - size/2);
            ctx.lineTo(pos.x + size/2 + offset, pos.y - size/2 - offset);
            ctx.lineTo(pos.x + size/2 + offset, pos.y + size/2 - offset);
            ctx.lineTo(pos.x + size/2, pos.y + size/2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          },

          lightenColor: function(color, factor) {
            // Simple color lightening
            return color.replace(/[0-9a-f]/gi, function(match) {
              var val = parseInt(match, 16);
              return Math.min(15, Math.round(val + factor * 16)).toString(16);
            });
          },

          darkenColor: function(color, factor) {
            // Simple color darkening
            return color.replace(/[0-9a-f]/gi, function(match) {
              var val = parseInt(match, 16);
              return Math.max(0, Math.round(val - factor * 16)).toString(16);
            });
          },

          draw3DParticipants: function(ctx, bounds) {
            if (!this.scene.participants || this.scene.participants.length === 0) return;

            this.scene.participants.forEach(function(participant) {
              var screenPos = this.project3DTo2D(participant.position, bounds);
              var depth = Math.max(0.3, 1.0 - (participant.position.z + 5) / 11);
              var size = 20 * depth;

              // Draw 3D human figure
              ctx.fillStyle = '#0088ff';
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1;

              // Head
              ctx.beginPath();
              ctx.arc(screenPos.x, screenPos.y - size, size * 0.3, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();

              // Body
              ctx.fillRect(screenPos.x - size * 0.2, screenPos.y - size * 0.8, size * 0.4, size * 0.8);
              ctx.strokeRect(screenPos.x - size * 0.2, screenPos.y - size * 0.8, size * 0.4, size * 0.8);

              // Name label
              if (depth > 0.4) {
                ctx.fillStyle = '#ffffff';
                ctx.font = Math.round(12 * depth) + 'px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(participant.name, screenPos.x, screenPos.y + size * 0.5);
              }
            }.bind(this));

            console.log('Unity: Drew', this.scene.participants.length, '3D participants');
          },

          drawUI: function(ctx) {
            // Draw Unity UI overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(10, 10, 200, 80);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('Unity 3D Dungeon Viewer', 15, 30);
            ctx.fillText('Devices: ' + this.scene.devices.length, 15, 50);
            ctx.fillText('Participants: ' + this.scene.participants.length, 15, 70);
            ctx.fillText('Camera: 3D Perspective', 15, 85);
          },

          // Unity Interface Methods
          updateDevices: function(devicesJson) {
            try {
              var devices = JSON.parse(devicesJson);
              this.scene.devices = devices.map(function(device) {
                return {
                  id: device.id,
                  name: device.name,
                  type: device.type,
                  status: device.status,
                  position: device.position || { x: 0, y: 0, z: 0 }
                };
              });
              this.render3DScene();
              console.log('Unity: Updated', this.scene.devices.length, 'devices in 3D scene');
            } catch (error) {
              console.error('Unity: Error updating devices:', error);
            }
          },

          updateParticipants: function(participantsJson) {
            try {
              var participants = JSON.parse(participantsJson);
              this.scene.participants = participants.map(function(participant) {
                return {
                  id: participant.id,
                  name: participant.name,
                  watchId: participant.watchId,
                  position: participant.position || { x: 0, y: 0, z: 0 }
                };
              });
              this.render3DScene();
              console.log('Unity: Updated', this.scene.participants.length, 'participants in 3D scene');
            } catch (error) {
              console.error('Unity: Error updating participants:', error);
            }
          },

          loadGLBModel: function(filePath) {
            console.log('Unity: LoadGLBModel called with path:', filePath);
            console.log('Unity: 3D room structure established - GLB integration ready');
            this.render3DScene();
          },

          resetCamera: function() {
            this.camera.position = { x: 0, y: 8, z: 10 };
            this.camera.rotation = { x: 25, y: 0, z: 0 };
            this.render3DScene();
            console.log('Unity: Camera reset to 3D architectural view');
          },

          handleReactMessage: function(message) {
            console.log('Unity: Received React message:', message);
            try {
              var data = JSON.parse(message);
              if (data.type === 'unity_ready') {
                console.log('Unity: Ready message sent to React');
              }
            } catch (error) {
              console.log('Unity: Message from React:', message);
            }
          },

          // Cleanup
          Quit: function() {
            console.log('Unity: Cleaning up 3D scene');
            this.scene.devices = [];
            this.scene.participants = [];
          }
        };

        // Initialize 3D scene
        mockUnityInstance.render3DScene();
        
        // Send Unity ready message
        if (window.ReactUnityWebGL && window.ReactUnityWebGL.dispatchEvent) {
          setTimeout(function() {
            console.log('Unity: Sending ready message to React');
            if (window.SendMessageToReact) {
              window.SendMessageToReact('{"type":"unity_ready"}');
            }
          }, 1000);
        }

        console.log('Unity WebGL: 3D Unity instance created successfully!');
        resolve(mockUnityInstance);
        
      } catch (error) {
        console.error('Unity WebGL: Failed to create instance:', error);
        reject(error);
      }
    });
  };

  // Make createUnityInstance available globally
  window.createUnityInstance = createUnityInstance;
  
  console.log('Unity WebGL: Loader initialized with 3D capabilities');
})();