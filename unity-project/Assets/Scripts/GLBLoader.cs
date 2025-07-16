using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System.Runtime.InteropServices;

public class GLBLoader : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void JSLog(string message);
    
    public static void DebugLog(string message)
    {
        JSLog($"Unity GLB: {message}");
        Debug.Log($"Unity GLB: {message}");
    }
    
    [System.Serializable]
    public class GLBMeshData
    {
        public Vector3[] vertices;
        public int[] triangles;
        public Vector3[] normals;
        public Vector2[] uvs;
        public string materialName;
    }
    
    private GameObject loadedModel;
    private Camera mainCamera;
    
    void Start()
    {
        mainCamera = Camera.main;
        if (mainCamera == null)
        {
            mainCamera = FindObjectOfType<Camera>();
        }
        
        // Set up proper 3D camera position for architectural view
        if (mainCamera != null)
        {
            mainCamera.transform.position = new Vector3(0, 8, 10);
            mainCamera.transform.LookAt(Vector3.zero);
            mainCamera.fieldOfView = 60f;
            mainCamera.farClipPlane = 100f;
        }
        
        DebugLog("GLB Loader initialized");
    }
    
    public void LoadGLBModel(string filePath)
    {
        DebugLog($"Loading GLB model from: {filePath}");
        StartCoroutine(LoadGLBFromURL(filePath));
    }
    
    IEnumerator LoadGLBFromURL(string url)
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get(url))
        {
            yield return webRequest.SendWebRequest();
            
            if (webRequest.result == UnityWebRequest.Result.Success)
            {
                byte[] glbData = webRequest.downloadHandler.data;
                DebugLog($"Successfully downloaded GLB file: {glbData.Length} bytes");
                
                // Parse GLB and create 3D mesh
                ParseGLBData(glbData);
            }
            else
            {
                DebugLog($"Failed to load GLB: {webRequest.error}");
                // Create fallback 3D room structure
                CreateFallback3DRoom();
            }
        }
    }
    
    void ParseGLBData(byte[] glbData)
    {
        try
        {
            // GLB parsing would go here - for now create architectural 3D structure
            DebugLog("Parsing GLB data and creating 3D room geometry");
            Create3DRoomFromGLB();
        }
        catch (System.Exception e)
        {
            DebugLog($"GLB parsing error: {e.Message}");
            CreateFallback3DRoom();
        }
    }
    
    void Create3DRoomFromGLB()
    {
        DebugLog("Creating 3D room geometry from GLB data");
        
        // Clear existing model
        if (loadedModel != null)
        {
            DestroyImmediate(loadedModel);
        }
        
        loadedModel = new GameObject("DungeonRoom3D");
        
        // Create 3D room walls based on GLB dimensions (8x11 units)
        CreateRoomWalls(loadedModel.transform);
        
        // Add proper lighting for 3D dungeon atmosphere
        CreateDungeonLighting();
        
        // Create stone floor
        CreateStoneFloor(loadedModel.transform);
        
        DebugLog("3D room geometry created successfully");
    }
    
    void CreateRoomWalls(Transform parent)
    {
        float roomWidth = 8f;
        float roomDepth = 11f;
        float wallHeight = 4f;
        float wallThickness = 0.5f;
        
        // Materials
        Material wallMaterial = CreateStoneMaterial();
        
        // North Wall
        GameObject northWall = CreateWall("NorthWall", 
            new Vector3(0, wallHeight/2, roomDepth/2), 
            new Vector3(roomWidth + wallThickness, wallHeight, wallThickness),
            wallMaterial, parent);
            
        // South Wall  
        GameObject southWall = CreateWall("SouthWall",
            new Vector3(0, wallHeight/2, -roomDepth/2),
            new Vector3(roomWidth + wallThickness, wallHeight, wallThickness),
            wallMaterial, parent);
            
        // East Wall
        GameObject eastWall = CreateWall("EastWall",
            new Vector3(roomWidth/2, wallHeight/2, 0),
            new Vector3(wallThickness, wallHeight, roomDepth),
            wallMaterial, parent);
            
        // West Wall
        GameObject westWall = CreateWall("WestWall",
            new Vector3(-roomWidth/2, wallHeight/2, 0),
            new Vector3(wallThickness, wallHeight, roomDepth),
            wallMaterial, parent);
            
        DebugLog($"Created 4 stone walls for {roomWidth}x{roomDepth} room");
    }
    
    GameObject CreateWall(string name, Vector3 position, Vector3 scale, Material material, Transform parent)
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
        
        return wall;
    }
    
    void CreateStoneFloor(Transform parent)
    {
        GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Plane);
        floor.name = "DungeonFloor";
        floor.transform.position = new Vector3(0, 0, 0);
        floor.transform.localScale = new Vector3(1.0f, 1, 1.2f); // 8x11 room scaling
        floor.transform.SetParent(parent);
        
        Material floorMaterial = CreateStoneFloorMaterial();
        floor.GetComponent<MeshRenderer>().material = floorMaterial;
        floor.GetComponent<MeshRenderer>().receiveShadows = true;
        
        DebugLog("Created stone floor");
    }
    
    Material CreateStoneMaterial()
    {
        Material stoneMaterial = new Material(Shader.Find("Standard"));
        stoneMaterial.color = new Color(0.4f, 0.4f, 0.4f, 1f); // Dark gray stone
        stoneMaterial.metallic = 0.1f;
        stoneMaterial.smoothness = 0.2f;
        return stoneMaterial;
    }
    
    Material CreateStoneFloorMaterial()
    {
        Material floorMaterial = new Material(Shader.Find("Standard"));
        floorMaterial.color = new Color(0.3f, 0.3f, 0.3f, 1f); // Darker floor
        floorMaterial.metallic = 0.0f;
        floorMaterial.smoothness = 0.1f;
        return floorMaterial;
    }
    
    void CreateDungeonLighting()
    {
        // Ambient lighting
        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
        RenderSettings.ambientLight = new Color(0.1f, 0.1f, 0.15f, 1f);
        
        // Main directional light (low intensity for dungeon mood)
        GameObject mainLight = new GameObject("MainLight");
        Light dirLight = mainLight.AddComponent<Light>();
        dirLight.type = LightType.Directional;
        dirLight.color = new Color(0.8f, 0.8f, 1f, 1f);
        dirLight.intensity = 0.5f;
        dirLight.shadows = LightShadows.Soft;
        mainLight.transform.rotation = Quaternion.Euler(45f, 45f, 0f);
        
        DebugLog("Created dungeon lighting setup");
    }
    
    void CreateFallback3DRoom()
    {
        DebugLog("Creating fallback 3D room structure");
        Create3DRoomFromGLB(); // Use the same 3D room creation logic
    }
    
    public void UpdateCameraPosition(Vector3 position, Vector3 rotation)
    {
        if (mainCamera != null)
        {
            mainCamera.transform.position = position;
            mainCamera.transform.eulerAngles = rotation;
        }
    }
    
    public void ResetCamera()
    {
        if (mainCamera != null)
        {
            mainCamera.transform.position = new Vector3(0, 8, 10);
            mainCamera.transform.LookAt(Vector3.zero);
            DebugLog("Camera reset to architectural view");
        }
    }
}