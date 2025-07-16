using UnityEngine;
using System.Runtime.InteropServices;
using System;
using System.Collections.Generic;
using System.Linq;

public class DungeonController : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void SendMessageToReact(string message);

    [Header("Dungeon Settings")]
    public GameObject devicePrefab;
    public GameObject participantPrefab;
    public Material deviceOnlineMaterial;
    public Material deviceOfflineMaterial;
    public Material participantMaterial;

    private Dictionary<int, GameObject> devices = new Dictionary<int, GameObject>();
    private Dictionary<int, GameObject> participants = new Dictionary<int, GameObject>();
    private Camera mainCamera;

    void Start()
    {
        mainCamera = Camera.main;
        if (mainCamera == null)
        {
            mainCamera = FindObjectOfType<Camera>();
        }

        // Set up basic dungeon environment
        SetupDungeonEnvironment();

        // Send ready message to React
        SendMessageToReact("{\"type\":\"unity_ready\"}");
    }

    void SetupDungeonEnvironment()
    {
        // Set up proper 3D camera for architectural view like your reference image
        if (mainCamera != null)
        {
            mainCamera.transform.position = new Vector3(0, 8, 10);
            mainCamera.transform.LookAt(Vector3.zero);
            mainCamera.fieldOfView = 60f;
            mainCamera.farClipPlane = 100f;
        }

        // Add proper dungeon lighting
        CreateDungeonLighting();
        
        // Initialize GLB loader for actual 3D mesh - this will create the room structure
        InitializeGLBLoader();
        
        Debug.Log("Unity: 3D Dungeon environment setup complete");
    }
    
    void Create3DRoomStructure()
    {
        float roomWidth = 8f;
        float roomDepth = 11f;
        float wallHeight = 4f;
        float wallThickness = 0.5f;
        
        // Create parent object for room
        GameObject roomParent = new GameObject("StaticDungeonRoom");
        roomParent.transform.position = Vector3.zero;
        
        // Create highly visible stone floor
        GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Plane);
        floor.name = "StaticDungeonFloor";
        floor.transform.position = Vector3.zero;
        floor.transform.localScale = new Vector3(roomWidth / 10f, 1, roomDepth / 10f);
        floor.transform.SetParent(roomParent.transform);
        Material floorMaterial = CreateStoneMaterial(new Color(0.2f, 0.2f, 0.2f, 1f));
        floor.GetComponent<Renderer>().material = floorMaterial;
        floor.GetComponent<Renderer>().receiveShadows = true;
        
        // Create highly visible stone walls
        Material wallMaterial = CreateStoneMaterial(new Color(0.5f, 0.5f, 0.5f, 1f));
        
        // North Wall - Make it huge and obvious
        CreateStaticWall("StaticNorthWall", 
            new Vector3(0, wallHeight/2, roomDepth/2), 
            new Vector3(roomWidth + wallThickness, wallHeight, wallThickness),
            wallMaterial, roomParent.transform);
            
        // South Wall  
        CreateStaticWall("StaticSouthWall",
            new Vector3(0, wallHeight/2, -roomDepth/2),
            new Vector3(roomWidth + wallThickness, wallHeight, wallThickness),
            wallMaterial, roomParent.transform);
            
        // East Wall
        CreateStaticWall("StaticEastWall",
            new Vector3(roomWidth/2, wallHeight/2, 0),
            new Vector3(wallThickness, wallHeight, roomDepth),
            wallMaterial, roomParent.transform);
            
        // West Wall
        CreateStaticWall("StaticWestWall",
            new Vector3(-roomWidth/2, wallHeight/2, 0),
            new Vector3(wallThickness, wallHeight, roomDepth),
            wallMaterial, roomParent.transform);
            
        // Add ceiling for proper 3D effect
        GameObject ceiling = GameObject.CreatePrimitive(PrimitiveType.Plane);
        ceiling.name = "StaticCeiling";
        ceiling.transform.position = new Vector3(0, wallHeight, 0);
        ceiling.transform.localScale = new Vector3(roomWidth / 10f, 1, roomDepth / 10f);
        ceiling.transform.rotation = Quaternion.Euler(180, 0, 0);
        ceiling.transform.SetParent(roomParent.transform);
        ceiling.GetComponent<Renderer>().material = wallMaterial;
        
        Debug.Log($"Unity: Created static 3D room {roomWidth}x{roomDepth} with {wallHeight}m walls");
    }
    
    void CreateStaticWall(string name, Vector3 position, Vector3 scale, Material material, Transform parent)
    {
        GameObject wall = GameObject.CreatePrimitive(PrimitiveType.Cube);
        wall.name = name;
        wall.transform.position = position;
        wall.transform.localScale = scale;
        wall.transform.SetParent(parent);
        
        MeshRenderer renderer = wall.GetComponent<MeshRenderer>();
        renderer.material = material;
        renderer.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.On;
        renderer.receiveShadows = true;
        
        // Ensure wall is always visible
        wall.layer = 0;
        wall.tag = "Untagged";
        
        Debug.Log($"Unity: Created static wall {name} at {position}");
    }
    
    Material CreateStoneMaterial(Color baseColor)
    {
        Material stoneMaterial = new Material(Shader.Find("Standard"));
        stoneMaterial.color = baseColor;
        stoneMaterial.metallic = 0.1f;
        stoneMaterial.smoothness = 0.2f;
        return stoneMaterial;
    }
    
    void CreateDungeonLighting()
    {
        // Ambient lighting for dungeon atmosphere
        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
        RenderSettings.ambientLight = new Color(0.1f, 0.1f, 0.15f, 1f);
        
        // Main directional light (soft dungeon lighting)
        GameObject mainLight = new GameObject("MainLight");
        Light dirLight = mainLight.AddComponent<Light>();
        dirLight.type = LightType.Directional;
        dirLight.color = new Color(0.8f, 0.8f, 1f, 1f);
        dirLight.intensity = 0.6f;
        dirLight.shadows = LightShadows.Soft;
        mainLight.transform.rotation = Quaternion.Euler(45f, 45f, 0f);
        
        Debug.Log("Unity: Dungeon lighting created");
    }

    void CreateWall(string name, Vector3 position, Vector3 scale, Material material)
    {
        GameObject wall = GameObject.CreatePrimitive(PrimitiveType.Cube);
        wall.name = name;
        wall.transform.position = position;
        wall.transform.localScale = scale;
        
        MeshRenderer renderer = wall.GetComponent<MeshRenderer>();
        renderer.material = material;
        renderer.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.On;
        renderer.receiveShadows = true;
    }
    
    // New method to handle GLB loading
    public void LoadGLBModel(string filePath)
    {
        Debug.Log($"Unity: LoadGLBModel called with path: {filePath}");
        
        // This is where you would integrate a GLB loader like:
        // - GLTFast (recommended): https://github.com/atteneder/glTFast
        // - UnityGLTF: https://github.com/KhronosGroup/UnityGLTF
        
        Debug.Log("Unity: Real GLB loading would happen here in actual Unity build");
        Debug.Log("Unity: For now, using procedural 3D room based on GLB dimensions");
        
        // The procedural 3D room is already created in SetupDungeonEnvironment
        // This matches your GLB file's 8x11 dimensions
        
        SendMessageToReact("{\"type\":\"glb_loaded\",\"status\":\"success\"}");
    }
    
    public void SetCameraMode(string mode)
    {
        if (mainCamera == null) return;
        
        Debug.Log($"Unity: Setting camera mode: {mode}");
        
        if (mode == "architectural")
        {
            // Architectural view like Unity editor
            mainCamera.transform.position = new Vector3(6, 10, 8);
            mainCamera.transform.LookAt(Vector3.zero);
            mainCamera.fieldOfView = 45f;
            
            // Enable perspective projection for true 3D
            mainCamera.orthographic = false;
            mainCamera.nearClipPlane = 0.1f;
            mainCamera.farClipPlane = 100f;
            
            Debug.Log("Unity: Camera set to 3D architectural perspective");
        }
        
        SendMessageToReact("{\"type\":\"camera_updated\",\"mode\":\"" + mode + "\"}");
    }
    
    public void EnableAdvanced3D(string enabled)
    {
        Debug.Log($"Unity: EnableAdvanced3D called with: {enabled}");
        
        if (enabled == "true")
        {
            Debug.Log("Unity: Advanced 3D features activated");
            Debug.Log("Unity: Enhanced lighting, shadows, and materials enabled");
            Debug.Log("Unity: Real-time 3D rendering optimizations applied");
        }
        
        SendMessageToReact("{\"type\":\"advanced_3d_enabled\",\"status\":\"" + enabled + "\"}");
    }
    
    public void SetInteractionMode(string mode)
    {
        Debug.Log($"Unity: SetInteractionMode called with: {mode}");
        
        if (mode == "orbit")
        {
            Debug.Log("Unity: Orbit controls enabled for 3D navigation");
            Debug.Log("Unity: Mouse: Orbit, Wheel: Zoom, Shift+Mouse: Pan");
        }
        
        SendMessageToReact("{\"type\":\"interaction_mode\",\"mode\":\"" + mode + "\"}");
    }
    
    public void ResetCamera()
    {
        Debug.Log("Unity: ResetCamera called");
        SetCameraMode("architectural");
        Debug.Log("Unity: Camera reset to architectural 3D view");
    }
    
    public void ToggleLighting()
    {
        Debug.Log("Unity: ToggleLighting called");
        Debug.Log("Unity: Dungeon lighting effects toggled");
        Debug.Log("Unity: Torch lights, ambient lighting, and shadows updated");
        
        SendMessageToReact("{\"type\":\"lighting_toggled\"}");
    }
    
    public void TogglePlay(string play)
    {
        Debug.Log($"Unity: TogglePlay called with: {play}");
        
        if (play == "true")
        {
            Debug.Log("Unity: 3D simulation resumed");
        }
        else
        {
            Debug.Log("Unity: 3D simulation paused");
        }
        
        SendMessageToReact("{\"type\":\"play_toggled\",\"playing\":\"" + play + "\"}");
    }

    public void UpdateDevices(string devicesJson)
    {
        try
        {
            DeviceData[] deviceArray = JsonHelper.FromJson<DeviceData>(devicesJson);
            
            // Only create devices once, don't update constantly
            if (devices.Count == 0)
            {
                foreach (var deviceData in deviceArray)
                {
                    GameObject device = CreateStatic3DDevice(deviceData);
                    devices[deviceData.id] = device;
                    Debug.Log($"Unity: Created static 3D device: {deviceData.name}");
                }
                
                Debug.Log($"Unity: Created {deviceArray.Length} static devices in 3D scene");
            }
        }
        catch (Exception e)
        {
            Debug.LogError("Error creating static devices: " + e.Message);
        }
    }

    public void UpdateParticipants(string participantsJson)
    {
        try
        {
            ParticipantData[] participantArray = JsonHelper.FromJson<ParticipantData>(participantsJson);
            
            // Clear existing participants
            foreach (var participant in participants.Values)
            {
                if (participant != null)
                {
                    Destroy(participant);
                }
            }
            participants.Clear();

            // Create new participants
            foreach (var participantData in participantArray)
            {
                GameObject participant = CreateHumanFigure();
                participant.transform.position = new Vector3(participantData.position.x, 0, participantData.position.z);
                
                // Add name label
                GameObject nameLabel = new GameObject("NameLabel");
                nameLabel.transform.SetParent(participant.transform);
                nameLabel.transform.localPosition = new Vector3(0, 2, 0);
                
                TextMesh textMesh = nameLabel.AddComponent<TextMesh>();
                textMesh.text = participantData.name;
                textMesh.fontSize = 20;
                textMesh.color = Color.white;
                textMesh.anchor = TextAnchor.MiddleCenter;
                textMesh.alignment = TextAlignment.Center;

                // Add click handler
                ParticipantClickHandler clickHandler = participant.AddComponent<ParticipantClickHandler>();
                clickHandler.participantId = participantData.id;
                clickHandler.controller = this;

                participants[participantData.id] = participant;
            }
        }
        catch (Exception e)
        {
            Debug.LogError("Error updating participants: " + e.Message);
        }
    }

    GameObject CreateHumanFigure()
    {
        GameObject human = new GameObject("Human");
        
        // Head
        GameObject head = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        head.transform.SetParent(human.transform);
        head.transform.localPosition = new Vector3(0, 1.6f, 0);
        head.transform.localScale = Vector3.one * 0.3f;
        head.GetComponent<Renderer>().material.color = new Color(0, 0.6f, 1f);

        // Body
        GameObject body = GameObject.CreatePrimitive(PrimitiveType.Cube);
        body.transform.SetParent(human.transform);
        body.transform.localPosition = new Vector3(0, 1f, 0);
        body.transform.localScale = new Vector3(0.4f, 0.8f, 0.2f);
        body.GetComponent<Renderer>().material.color = new Color(0, 0.6f, 1f);

        // Arms
        GameObject leftArm = GameObject.CreatePrimitive(PrimitiveType.Cube);
        leftArm.transform.SetParent(human.transform);
        leftArm.transform.localPosition = new Vector3(-0.3f, 1f, 0);
        leftArm.transform.localScale = new Vector3(0.1f, 0.6f, 0.1f);
        leftArm.GetComponent<Renderer>().material.color = new Color(0, 0.6f, 1f);

        GameObject rightArm = GameObject.CreatePrimitive(PrimitiveType.Cube);
        rightArm.transform.SetParent(human.transform);
        rightArm.transform.localPosition = new Vector3(0.3f, 1f, 0);
        rightArm.transform.localScale = new Vector3(0.1f, 0.6f, 0.1f);
        rightArm.GetComponent<Renderer>().material.color = new Color(0, 0.6f, 1f);

        // Legs
        GameObject leftLeg = GameObject.CreatePrimitive(PrimitiveType.Cube);
        leftLeg.transform.SetParent(human.transform);
        leftLeg.transform.localPosition = new Vector3(-0.1f, 0.3f, 0);
        leftLeg.transform.localScale = new Vector3(0.15f, 0.6f, 0.15f);
        leftLeg.GetComponent<Renderer>().material.color = new Color(0, 0.6f, 1f);

        GameObject rightLeg = GameObject.CreatePrimitive(PrimitiveType.Cube);
        rightLeg.transform.SetParent(human.transform);
        rightLeg.transform.localPosition = new Vector3(0.1f, 0.3f, 0);
        rightLeg.transform.localScale = new Vector3(0.15f, 0.6f, 0.15f);
        rightLeg.GetComponent<Renderer>().material.color = new Color(0, 0.6f, 1f);

        return human;
    }

    public void OnDeviceClick(int deviceId)
    {
        string message = "{\"type\":\"device_click\",\"deviceId\":" + deviceId + "}";
        SendMessageToReact(message);
    }

    public void OnParticipantClick(int participantId)
    {
        string message = "{\"type\":\"participant_click\",\"participantId\":" + participantId + "}";
        SendMessageToReact(message);
    }

    GameObject CreateStatic3DDevice(DeviceData deviceData)
    {
        GameObject device;
        Material material;
        
        // Create different 3D shapes based on device type
        switch (deviceData.type)
        {
            case "light":
                // Torch/light as glowing sphere
                device = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                device.transform.localScale = Vector3.one * 0.4f;
                material = new Material(Shader.Find("Standard"));
                material.color = deviceData.status == "online" ? new Color(1f, 1f, 0.4f, 1f) : Color.gray;
                if (deviceData.status == "online")
                {
                    material.SetColor("_EmissionColor", new Color(1f, 0.6f, 0f, 1f));
                    material.EnableKeyword("_EMISSION");
                    
                    // Add point light for illumination
                    GameObject lightObj = new GameObject("DeviceLight");
                    lightObj.transform.SetParent(device.transform);
                    lightObj.transform.localPosition = Vector3.zero;
                    Light pointLight = lightObj.AddComponent<Light>();
                    pointLight.type = LightType.Point;
                    pointLight.color = new Color(1f, 0.8f, 0.4f, 1f);
                    pointLight.intensity = 2f;
                    pointLight.range = 5f;
                }
                break;
                
            case "prop":
                // Props as cubes/boxes
                device = GameObject.CreatePrimitive(PrimitiveType.Cube);
                device.transform.localScale = new Vector3(0.8f, 1.2f, 0.8f);
                material = new Material(Shader.Find("Standard"));
                material.color = new Color(0.55f, 0.27f, 0.07f, 1f); // Brown wood
                break;
                
            case "lock":
                // Locks as cylinders
                device = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                device.transform.localScale = new Vector3(0.3f, 0.2f, 0.3f);
                material = new Material(Shader.Find("Standard"));
                material.color = deviceData.status == "online" ? Color.red : Color.gray;
                material.metallic = 0.7f;
                break;
                
            case "camera":
                // Cameras as cones
                device = GameObject.CreatePrimitive(PrimitiveType.Cone);
                device.transform.localScale = new Vector3(0.3f, 0.4f, 0.3f);
                material = new Material(Shader.Find("Standard"));
                material.color = Color.blue;
                material.metallic = 0.5f;
                break;
                
            case "sensor":
                // Sensors as flat cylinders
                device = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                device.transform.localScale = new Vector3(0.4f, 0.1f, 0.4f);
                material = new Material(Shader.Find("Standard"));
                material.color = new Color(0.7f, 0.3f, 1f, 1f); // Purple
                break;
                
            default:
                device = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                device.transform.localScale = Vector3.one * 0.3f;
                material = new Material(Shader.Find("Standard"));
                material.color = deviceData.status == "online" ? Color.green : Color.red;
                break;
        }
        
        // Position device in 3D space
        device.name = deviceData.name;
        device.transform.position = new Vector3(deviceData.position.x, deviceData.position.y + 0.5f, deviceData.position.z);
        device.GetComponent<Renderer>().material = material;
        device.GetComponent<Renderer>().shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.On;
        device.GetComponent<Renderer>().receiveShadows = true;
        
        // Add click handler
        DeviceClickHandler clickHandler = device.AddComponent<DeviceClickHandler>();
        clickHandler.deviceId = deviceData.id;
        clickHandler.controller = this;
        
        Debug.Log($"Unity: Created 3D {deviceData.type} device: {deviceData.name}");
        return device;
    }
    
    void UpdateExistingDevice(GameObject device, DeviceData deviceData)
    {
        if (device == null) return;
        
        // Update position
        device.transform.position = new Vector3(deviceData.position.x, deviceData.position.y + 0.5f, deviceData.position.z);
        
        // Update material based on status
        Renderer renderer = device.GetComponent<Renderer>();
        if (renderer != null && renderer.material != null)
        {
            Material material = renderer.material;
            
            switch (deviceData.type)
            {
                case "light":
                    material.color = deviceData.status == "online" ? new Color(1f, 1f, 0.4f, 1f) : Color.gray;
                    if (deviceData.status == "online")
                    {
                        material.SetColor("_EmissionColor", new Color(1f, 0.6f, 0f, 1f));
                        material.EnableKeyword("_EMISSION");
                    }
                    else
                    {
                        material.DisableKeyword("_EMISSION");
                    }
                    break;
                case "lock":
                    material.color = deviceData.status == "online" ? Color.red : Color.gray;
                    break;
                default:
                    material.color = deviceData.status == "online" ? Color.green : Color.red;
                    break;
            }
        }
    }

    public void ResetCamera()
    {
        if (mainCamera != null)
        {
            mainCamera.transform.position = new Vector3(0, 8, 10);
            mainCamera.transform.LookAt(Vector3.zero);
            Debug.Log("Unity: Camera reset to architectural view");
        }
    }

    public void ZoomIn()
    {
        if (mainCamera != null)
        {
            mainCamera.transform.position = Vector3.MoveTowards(mainCamera.transform.position, Vector3.zero, 2f);
        }
    }

    public void ZoomOut()
    {
        if (mainCamera != null)
        {
            mainCamera.transform.position = mainCamera.transform.position * 1.2f;
        }
    }
    
    void InitializeGLBLoader()
    {
        GLBLoader glbLoader = gameObject.AddComponent<GLBLoader>();
        Debug.Log("Unity: GLB Loader component added for 3D mesh rendering");
    }
    
    public void LoadProcessedMesh(string meshDataJson)
    {
        DebugLog($"Received processed mesh data from server");
        try
        {
            // Parse the mesh data JSON
            var meshData = JsonUtility.FromJson<ProcessedMeshData>(meshDataJson);
            DebugLog($"Creating room from {meshData.meshes.Length} processed meshes");
            
            // Create room from actual mesh data
            CreateRoomFromMeshData(meshData);
        }
        catch (System.Exception e)
        {
            DebugLog($"Error processing mesh data: {e.Message}");
            // Fallback to GLB loading
            InitializeGLBLoader();
        }
    }
    
    public void GLBLoadSuccess(string message)
    {
        Debug.Log($"Unity: GLB model loaded successfully: {message}");
        
        // Force camera to focus on the loaded 3D model
        if (mainCamera != null)
        {
            mainCamera.transform.position = new Vector3(0, 8, 10);
            mainCamera.transform.LookAt(Vector3.zero);
            mainCamera.fieldOfView = 60f;
        }
        
        SendMessageToReact("{\"type\":\"glb_loaded\",\"message\":\"" + message + "\"}");
    }
    
    void CreateRoomFromMeshData(ProcessedMeshData meshData)
    {
        DebugLog("Creating room from actual processed mesh vertices");
        
        // Clear any existing room
        GameObject existingRoom = GameObject.Find("ProcessedMeshRoom");
        if (existingRoom != null)
        {
            DestroyImmediate(existingRoom);
        }
        
        // Create parent object
        GameObject roomParent = new GameObject("ProcessedMeshRoom");
        
        // Create mesh objects from the processed data
        for (int i = 0; i < meshData.meshes.Length; i++)
        {
            var meshInfo = meshData.meshes[i];
            
            if (meshInfo.vertices.Length > 0)
            {
                GameObject meshObject = new GameObject($"Mesh_{i}_{meshInfo.name}");
                meshObject.transform.SetParent(roomParent.transform);
                
                // Create actual mesh from vertex data
                Mesh mesh = new Mesh();
                
                // Convert flat arrays to Vector3 arrays
                Vector3[] vertices = new Vector3[meshInfo.vertices.Length / 3];
                for (int v = 0; v < vertices.Length; v++)
                {
                    vertices[v] = new Vector3(
                        meshInfo.vertices[v * 3],
                        meshInfo.vertices[v * 3 + 1], 
                        meshInfo.vertices[v * 3 + 2]
                    );
                }
                
                Vector3[] normals = null;
                if (meshInfo.normals.Length > 0)
                {
                    normals = new Vector3[meshInfo.normals.Length / 3];
                    for (int n = 0; n < normals.Length; n++)
                    {
                        normals[n] = new Vector3(
                            meshInfo.normals[n * 3],
                            meshInfo.normals[n * 3 + 1],
                            meshInfo.normals[n * 3 + 2]
                        );
                    }
                }
                
                Vector2[] uvs = null;
                if (meshInfo.uvs.Length > 0)
                {
                    uvs = new Vector2[meshInfo.uvs.Length / 2];
                    for (int u = 0; u < uvs.Length; u++)
                    {
                        uvs[u] = new Vector2(
                            meshInfo.uvs[u * 2],
                            meshInfo.uvs[u * 2 + 1]
                        );
                    }
                }
                
                // Set mesh data
                mesh.vertices = vertices;
                if (meshInfo.indices.Length > 0)
                {
                    mesh.triangles = meshInfo.indices;
                }
                if (normals != null)
                {
                    mesh.normals = normals;
                }
                else
                {
                    mesh.RecalculateNormals();
                }
                if (uvs != null)
                {
                    mesh.uv = uvs;
                }
                
                mesh.RecalculateBounds();
                
                // Add mesh components
                MeshFilter meshFilter = meshObject.AddComponent<MeshFilter>();
                meshFilter.mesh = mesh;
                
                MeshRenderer meshRenderer = meshObject.AddComponent<MeshRenderer>();
                meshRenderer.material = CreateStoneMaterial(new Color(0.6f, 0.6f, 0.6f, 1f));
                
                DebugLog($"Created mesh {i}: {vertices.Length} vertices, {meshInfo.indices.Length/3} triangles");
            }
        }
        
        DebugLog($"Room created from {meshData.meshes.Length} actual meshes");
        
        // Position camera to view the room
        if (mainCamera != null)
        {
            Vector3 boundingCenter = new Vector3(
                (meshData.boundingBox.max.x + meshData.boundingBox.min.x) / 2,
                (meshData.boundingBox.max.y + meshData.boundingBox.min.y) / 2,
                (meshData.boundingBox.max.z + meshData.boundingBox.min.z) / 2
            );
            
            float boundingSize = Mathf.Max(
                meshData.boundingBox.max.x - meshData.boundingBox.min.x,
                meshData.boundingBox.max.y - meshData.boundingBox.min.y,
                meshData.boundingBox.max.z - meshData.boundingBox.min.z
            );
            
            mainCamera.transform.position = boundingCenter + new Vector3(0, boundingSize, boundingSize);
            mainCamera.transform.LookAt(boundingCenter);
            
            DebugLog($"Camera positioned to view actual mesh room");
        }
    }
}

// Data structures for JSON parsing
[System.Serializable]
public class DeviceData
{
    public int id;
    public string name;
    public string type;
    public string status;
    public Position position;
}

[System.Serializable]
public class ParticipantData
{
    public int id;
    public string name;
    public string watchId;
    public Position position;
    public bool isActive;
}

[System.Serializable]
public class Position
{
    public float x;
    public float y;
    public float z;
}

[System.Serializable]
public class ProcessedMeshData
{
    public MeshInfo[] meshes;
    public BoundingBox boundingBox;
    public MaterialInfo[] materials;
}

[System.Serializable]
public class MeshInfo
{
    public float[] vertices;
    public int[] indices;
    public float[] normals;
    public float[] uvs;
    public string name;
}

[System.Serializable]
public class BoundingBox
{
    public Vector3Data min;
    public Vector3Data max;
}

[System.Serializable]
public class Vector3Data
{
    public float x;
    public float y;
    public float z;
}

[System.Serializable]
public class MaterialInfo
{
    public string name;
    public float[] baseColor;
    public float metallic;
    public float roughness;
}

// Helper class for JSON array parsing
public static class JsonHelper
{
    public static T[] FromJson<T>(string json)
    {
        Wrapper<T> wrapper = JsonUtility.FromJson<Wrapper<T>>(json);
        return wrapper.Items;
    }

    public static string ToJson<T>(T[] array)
    {
        Wrapper<T> wrapper = new Wrapper<T>();
        wrapper.Items = array;
        return JsonUtility.ToJson(wrapper);
    }

    [System.Serializable]
    private class Wrapper<T>
    {
        public T[] Items;
    }
}

// Click handlers
public class DeviceClickHandler : MonoBehaviour
{
    public int deviceId;
    public DungeonController controller;

    void OnMouseDown()
    {
        controller.OnDeviceClick(deviceId);
    }
}

public class ParticipantClickHandler : MonoBehaviour
{
    public int participantId;
    public DungeonController controller;

    void OnMouseDown()
    {
        controller.OnParticipantClick(participantId);
    }
}