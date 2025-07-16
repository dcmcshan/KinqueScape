# Unity WebGL Build Instructions for KinqueScape

## Quick Setup (5 minutes)

1. **Install Unity Hub** (if not already installed):
   - Download from https://unity.com/download
   - Create Unity account if needed

2. **Install Unity Editor**:
   - Open Unity Hub
   - Go to "Installs" tab
   - Click "Install Editor" 
   - Select Unity 2023.3 LTS (recommended)
   - Make sure to check "WebGL Build Support" during installation

3. **Create Unity Project**:
   - Open Unity Hub
   - Click "New Project"
   - Select "3D" template
   - Name: "KinqueScape"
   - Location: Choose any folder
   - Click "Create Project"

4. **Add the Script**:
   - In Unity, go to Assets > Create > C# Script
   - Name it "DungeonController"
   - Double-click to open in editor
   - Replace ALL content with the code from `unity-project/Assets/Scripts/DungeonController.cs`
   - Save the file

5. **Set up the Scene**:
   - Create an empty GameObject: Right-click in Hierarchy > Create Empty
   - Name it "DungeonController"
   - Select it and in Inspector, click "Add Component"
   - Search for "DungeonController" and add it
   - Position the Main Camera at (8, 8, 8) and rotate to look at center

6. **Configure WebGL Settings**:
   - Go to File > Build Settings
   - Select "WebGL" and click "Switch Platform"
   - Click "Player Settings"
   - In Inspector, expand "Publishing Settings"
   - Set "Compression Format" to "Disabled"
   - Set "Memory Size" to 512 MB

7. **Build the Project**:
   - File > Build Settings
   - Click "Build"
   - Select the folder: `[your-project]/public/unity-build/`
   - Wait for build to complete (5-10 minutes)

## Files Generated

After successful build, you should have:
- `KinqueScape.loader.js`
- `KinqueScape.data` 
- `KinqueScape.framework.js`
- `KinqueScape.wasm`

## Testing

1. Restart your development server
2. Go to `/room/dungeon`
3. You should see the Unity WebGL viewer loading
4. Add participants using "Add Demo Participant" button
5. Click on participants and devices to test interaction

## Unity-React Communication

**React → Unity:**
```javascript
sendMessage('DungeonController', 'UpdateDevices', JSON.stringify(devices));
sendMessage('DungeonController', 'UpdateParticipants', JSON.stringify(participants));
```

**Unity → React:**
```csharp
SendMessageToReact("{\"type\":\"device_click\",\"deviceId\":1}");
SendMessageToReact("{\"type\":\"participant_click\",\"participantId\":2}");
```

## Troubleshooting

**Build fails:**
- Make sure WebGL support is installed
- Check Unity version is 2022.3+ LTS
- Ensure sufficient disk space (2GB+)

**React integration issues:**
- Verify build files are in correct location
- Check browser console for errors
- Ensure file paths match in component

**Performance issues:**
- Reduce Memory Size in Player Settings
- Enable compression in Player Settings
- Optimize textures and models

## Next Steps

1. **Add 3D Models**: Import .fbx or .obj dungeon models
2. **Improve Lighting**: Add point lights for torches
3. **Add Animations**: Animate participants walking
4. **Add Sound**: Import audio for dungeon atmosphere
5. **Optimize Performance**: Use LOD groups and occlusion culling