# Unity WebGL Build Files

This directory should contain the Unity WebGL build files for the KinqueScape dungeon environment.

## Required Files:
- `KinqueScape.loader.js` - Unity loader script
- `KinqueScape.data` - Unity data file
- `KinqueScape.framework.js` - Unity framework
- `KinqueScape.wasm` - WebAssembly binary

## How to Generate Unity Build:

1. **Create Unity Project:**
   - Open Unity Hub and create a new 3D project named "KinqueScape"
   - Import the dungeon assets (or create basic dungeon scene)

2. **Set Up Build Settings:**
   - Go to File > Build Settings
   - Select WebGL platform
   - Click "Switch Platform"

3. **Player Settings:**
   - Go to Edit > Project Settings > Player
   - WebGL Settings:
     - Compression Format: Disabled (for development)
     - Memory Size: 256MB (adjust as needed)
     - Enable Decompression Fallback: Yes

4. **Create DungeonController Script:**
   ```csharp
   using UnityEngine;
   using System.Runtime.InteropServices;
   using System;

   public class DungeonController : MonoBehaviour
   {
       [DllImport("__Internal")]
       private static extern void SendMessageToReact(string message);

       void Start()
       {
           // Send ready message to React
           SendMessageToReact("{\"type\":\"unity_ready\"}");
       }

       public void UpdateDevices(string devicesJson)
       {
           // Update device representations in Unity
           Debug.Log("Updating devices: " + devicesJson);
       }

       public void UpdateParticipants(string participantsJson)
       {
           // Update participant representations in Unity
           Debug.Log("Updating participants: " + participantsJson);
       }

       public void ResetCamera()
       {
           // Reset camera to default position
           Debug.Log("Resetting camera");
       }

       public void ZoomIn()
       {
           // Zoom camera in
           Debug.Log("Zooming in");
       }

       public void ZoomOut()
       {
           // Zoom camera out
           Debug.Log("Zooming out");
       }
   }
   ```

5. **Build the Project:**
   - File > Build Settings > Build
   - Choose this directory as the build location
   - Unity will generate the required files

## Development Notes:
- The Unity build files are large and should not be committed to version control
- For development, you can use the Three.js fallback until Unity build is ready
- The React component will automatically detect when Unity files are available

## Communication Protocol:
- React → Unity: Uses `sendMessage()` to call Unity functions
- Unity → React: Uses `SendMessageToReact()` to send JSON messages