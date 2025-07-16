using UnityEngine;
using System.Runtime.InteropServices;
using System;
using System.Collections.Generic;

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

        // Create realistic dungeon room based on GLB dimensions (8x11 units)
        Create3DRoomStructure();
        
        // Add proper dungeon lighting
        CreateDungeonLighting();
        
        Debug.Log("Unity: 3D Dungeon environment setup complete");
    }
    
    void Create3DRoomStructure()
    {
        float roomWidth = 8f;
        float roomDepth = 11f;
        float wallHeight = 4f;
        float wallThickness = 0.5f;
        
        // Create stone floor
        GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Plane);
        floor.name = "DungeonFloor";
        floor.transform.position = Vector3.zero;
        floor.transform.localScale = new Vector3(roomWidth / 10f, 1, roomDepth / 10f);
        Material floorMaterial = CreateStoneMaterial(new Color(0.3f, 0.3f, 0.3f, 1f));
        floor.GetComponent<Renderer>().material = floorMaterial;
        floor.GetComponent<Renderer>().receiveShadows = true;
        
        // Create stone walls
        Material wallMaterial = CreateStoneMaterial(new Color(0.4f, 0.4f, 0.4f, 1f));
        
        // North Wall
        CreateWall("NorthWall", 
            new Vector3(0, wallHeight/2, roomDepth/2), 
            new Vector3(roomWidth + wallThickness, wallHeight, wallThickness),
            wallMaterial);
            
        // South Wall  
        CreateWall("SouthWall",
            new Vector3(0, wallHeight/2, -roomDepth/2),
            new Vector3(roomWidth + wallThickness, wallHeight, wallThickness),
            wallMaterial);
            
        // East Wall
        CreateWall("EastWall",
            new Vector3(roomWidth/2, wallHeight/2, 0),
            new Vector3(wallThickness, wallHeight, roomDepth),
            wallMaterial);
            
        // West Wall
        CreateWall("WestWall",
            new Vector3(-roomWidth/2, wallHeight/2, 0),
            new Vector3(wallThickness, wallHeight, roomDepth),
            wallMaterial);
            
        Debug.Log($"Unity: Created 3D room {roomWidth}x{roomDepth} with {wallHeight}m walls");
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

    public void UpdateDevices(string devicesJson)
    {
        try
        {
            DeviceData[] deviceArray = JsonHelper.FromJson<DeviceData>(devicesJson);
            
            // Clear existing devices
            foreach (var device in devices.Values)
            {
                if (device != null)
                {
                    Destroy(device);
                }
            }
            devices.Clear();

            // Create new devices with proper 3D representation
            foreach (var deviceData in deviceArray)
            {
                GameObject device = Create3DDevice(deviceData);
                devices[deviceData.id] = device;
            }
        }
        catch (Exception e)
        {
            Debug.LogError("Error updating devices: " + e.Message);
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

    GameObject Create3DDevice(DeviceData deviceData)
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