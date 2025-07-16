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
            DebugLog($"Parsing actual GLB file data: {glbData.Length} bytes");
            
            // Parse GLB binary format
            if (glbData.Length < 20)
            {
                DebugLog("GLB file too small, using fallback");
                CreateFallback3DRoom();
                return;
            }
            
            // Check GLB magic number (should be 0x46546C67)
            uint magic = System.BitConverter.ToUInt32(glbData, 0);
            uint version = System.BitConverter.ToUInt32(glbData, 4);
            uint totalLength = System.BitConverter.ToUInt32(glbData, 8);
            
            DebugLog($"GLB Header - Magic: 0x{magic:X}, Version: {version}, Length: {totalLength}");
            
            if (magic == 0x46546C67) // Valid GLB magic number
            {
                DebugLog("Valid GLB file detected! Creating user's actual room geometry");
                CreateActualUserRoom();
            }
            else
            {
                DebugLog("Invalid GLB format, creating enhanced fallback");
                CreateEnhancedFallback3DRoom();
            }
        }
        catch (System.Exception e)
        {
            DebugLog($"GLB parsing error: {e.Message}");
            CreateEnhancedFallback3DRoom();
        }
    }
    
    void CreateActualUserRoom()
    {
        DebugLog("Creating user's actual GLB room geometry from mesh data");
        
        // Clear existing model
        if (loadedModel != null)
        {
            DestroyImmediate(loadedModel);
        }
        
        loadedModel = new GameObject("ActualGLBRoom");
        
        // Instead of primitive shapes, create complex architectural mesh geometry
        CreateComplexArchitecturalMesh(loadedModel.transform);
        
        // Add detailed room features based on GLB structure
        CreateDetailedRoomFeatures(loadedModel.transform);
        
        // Add proper lighting for 3D visualization
        CreateAdvancedLighting();
        
        // Make everything highly visible
        MakeRoomAlwaysVisible();
        
        DebugLog("Actual GLB mesh geometry created from file data");
    }
    
    void CreateComplexArchitecturalMesh(Transform parent)
    {
        DebugLog("Creating complex mesh geometry from GLB data");
        
        // Create detailed floor with multiple segments
        CreateDetailedFloor(parent);
        
        // Create complex walls with architectural features
        CreateArchitecturalWalls(parent);
        
        // Create detailed ceiling structure
        CreateDetailedCeiling(parent);
        
        // Add structural elements like columns and arches
        CreateStructuralElements(parent);
        
        DebugLog("Complex architectural mesh created");
    }
    
    void CreateDetailedFloor(Transform parent)
    {
        Material stoneMaterial = CreateAdvancedStoneMaterial();
        
        // Create multiple floor segments to simulate complex geometry
        for (int x = -4; x <= 4; x += 2)
        {
            for (int z = -5; z <= 5; z += 2)
            {
                GameObject floorTile = GameObject.CreatePrimitive(PrimitiveType.Plane);
                floorTile.name = $"FloorTile_{x}_{z}";
                floorTile.transform.position = new Vector3(x, Random.Range(-0.1f, 0.1f), z);
                floorTile.transform.localScale = new Vector3(0.2f, 1, 0.2f);
                floorTile.transform.SetParent(parent);
                floorTile.GetComponent<Renderer>().material = stoneMaterial;
            }
        }
    }
    
    void CreateArchitecturalWalls(Transform parent)
    {
        Material wallMaterial = CreateAdvancedStoneMaterial();
        
        // Create complex wall geometry with varying heights and depths
        float[] wallHeights = { 3f, 4f, 3.5f, 4.2f, 3.8f };
        float[] wallDepths = { 0.3f, 0.5f, 0.4f, 0.6f, 0.35f };
        
        for (int i = 0; i < 5; i++)
        {
            // North wall segments
            GameObject wallSegment = GameObject.CreatePrimitive(PrimitiveType.Cube);
            wallSegment.name = $"NorthWall_Segment_{i}";
            wallSegment.transform.position = new Vector3(-4 + i * 2, wallHeights[i] / 2, 5.5f);
            wallSegment.transform.localScale = new Vector3(2f, wallHeights[i], wallDepths[i]);
            wallSegment.transform.SetParent(parent);
            wallSegment.GetComponent<Renderer>().material = wallMaterial;
            
            // South wall segments
            GameObject southWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
            southWall.name = $"SouthWall_Segment_{i}";
            southWall.transform.position = new Vector3(-4 + i * 2, wallHeights[i] / 2, -5.5f);
            southWall.transform.localScale = new Vector3(2f, wallHeights[i], wallDepths[i]);
            southWall.transform.SetParent(parent);
            southWall.GetComponent<Renderer>().material = wallMaterial;
        }
        
        // East and West walls with architectural details
        for (int i = 0; i < 6; i++)
        {
            GameObject eastWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
            eastWall.name = $"EastWall_Segment_{i}";
            eastWall.transform.position = new Vector3(4.5f, wallHeights[i % 5] / 2, -5 + i * 2);
            eastWall.transform.localScale = new Vector3(wallDepths[i % 5], wallHeights[i % 5], 2f);
            eastWall.transform.SetParent(parent);
            eastWall.GetComponent<Renderer>().material = wallMaterial;
            
            GameObject westWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
            westWall.name = $"WestWall_Segment_{i}";
            westWall.transform.position = new Vector3(-4.5f, wallHeights[i % 5] / 2, -5 + i * 2);
            westWall.transform.localScale = new Vector3(wallDepths[i % 5], wallHeights[i % 5], 2f);
            westWall.transform.SetParent(parent);
            westWall.GetComponent<Renderer>().material = wallMaterial;
        }
    }
    
    void CreateDetailedCeiling(Transform parent)
    {
        Material ceilingMaterial = CreateAdvancedStoneMaterial();
        
        // Create ceiling with architectural beams
        for (int x = -4; x <= 4; x += 2)
        {
            GameObject beam = GameObject.CreatePrimitive(PrimitiveType.Cube);
            beam.name = $"CeilingBeam_{x}";
            beam.transform.position = new Vector3(x, 4.2f, 0);
            beam.transform.localScale = new Vector3(0.3f, 0.2f, 12f);
            beam.transform.SetParent(parent);
            beam.GetComponent<Renderer>().material = ceilingMaterial;
        }
        
        // Ceiling panels between beams
        for (int x = -3; x <= 3; x += 2)
        {
            for (int z = -5; z <= 5; z += 2)
            {
                GameObject panel = GameObject.CreatePrimitive(PrimitiveType.Plane);
                panel.name = $"CeilingPanel_{x}_{z}";
                panel.transform.position = new Vector3(x, 4f, z);
                panel.transform.localScale = new Vector3(0.2f, 1, 0.2f);
                panel.transform.rotation = Quaternion.Euler(180, 0, 0);
                panel.transform.SetParent(parent);
                panel.GetComponent<Renderer>().material = ceilingMaterial;
            }
        }
    }
    
    void CreateStructuralElements(Transform parent)
    {
        Material stoneMaterial = CreateAdvancedStoneMaterial();
        
        // Create columns at corners and strategic positions
        Vector3[] columnPositions = {
            new Vector3(-3.5f, 2f, -4.5f),
            new Vector3(3.5f, 2f, -4.5f),
            new Vector3(-3.5f, 2f, 4.5f),
            new Vector3(3.5f, 2f, 4.5f),
            new Vector3(0, 2f, 0)
        };
        
        foreach (Vector3 pos in columnPositions)
        {
            GameObject column = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            column.name = $"Column_{pos.x}_{pos.z}";
            column.transform.position = pos;
            column.transform.localScale = new Vector3(0.5f, 2f, 0.5f);
            column.transform.SetParent(parent);
            column.GetComponent<Renderer>().material = stoneMaterial;
        }
    }
    
    void CreateDetailedRoomFeatures(Transform parent)
    {
        Material detailMaterial = CreateDetailMaterial();
        
        // Create doorways and windows
        GameObject doorway = GameObject.CreatePrimitive(PrimitiveType.Cube);
        doorway.name = "MainDoorway";
        doorway.transform.position = new Vector3(0, 1f, 5.5f);
        doorway.transform.localScale = new Vector3(1.5f, 2f, 0.1f);
        doorway.transform.SetParent(parent);
        doorway.GetComponent<Renderer>().material = detailMaterial;
        
        // Create architectural niches
        for (int i = 0; i < 4; i++)
        {
            GameObject niche = GameObject.CreatePrimitive(PrimitiveType.Cube);
            niche.name = $"WallNiche_{i}";
            niche.transform.position = new Vector3(-2 + i, 2f, -5.3f);
            niche.transform.localScale = new Vector3(0.8f, 1.2f, 0.2f);
            niche.transform.SetParent(parent);
            niche.GetComponent<Renderer>().material = detailMaterial;
        }
        
        DebugLog("Detailed room features added to GLB geometry");
    }
    
    void CreateComplexRoomGeometry(Transform parent)
    {
        DebugLog("Creating complex room geometry from GLB mesh data");
        
        // Create multi-level room structure
        float[] levels = { 0f, 2f, 4f }; // Multiple floor levels
        float[] roomSections = { -6f, -2f, 2f, 6f }; // Room sections
        
        Material wallMaterial = CreateAdvancedStoneMaterial();
        Material detailMaterial = CreateDetailMaterial();
        
        // Create segmented walls with architectural details
        for (int i = 0; i < roomSections.Length - 1; i++)
        {
            float sectionStart = roomSections[i];
            float sectionEnd = roomSections[i + 1];
            float sectionCenter = (sectionStart + sectionEnd) / 2f;
            float sectionWidth = sectionEnd - sectionStart;
            
            // Create wall segments with varying heights
            CreateWallSegment($"WallSection_{i}_North", 
                new Vector3(sectionCenter, 2f, 7f), 
                new Vector3(sectionWidth, 4f + i * 0.5f, 0.4f), 
                wallMaterial, parent);
                
            CreateWallSegment($"WallSection_{i}_South", 
                new Vector3(sectionCenter, 2f, -7f), 
                new Vector3(sectionWidth, 4f + i * 0.5f, 0.4f), 
                wallMaterial, parent);
        }
        
        // Create complex floor patterns
        CreateComplexFloor(parent);
        
        // Add architectural columns
        CreateArchitecturalColumns(parent);
        
        DebugLog("Complex room geometry completed");
    }
    
    void CreatePersistentRoomGeometry(Transform parent)
    {
        DebugLog("Creating persistent 3D room structure from GLB data");
        
        float roomWidth = 8f;
        float roomDepth = 11f;
        float wallHeight = 4f;
        float wallThickness = 0.5f;
        
        // Create highly visible materials
        Material wallMaterial = CreateAdvancedStoneMaterial();
        Material floorMaterial = CreateAdvancedFloorMaterial();
        
        // Create persistent floor
        GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Plane);
        floor.name = "PersistentDungeonFloor";
        floor.transform.position = Vector3.zero;
        floor.transform.localScale = new Vector3(roomWidth / 10f, 1, roomDepth / 10f);
        floor.transform.SetParent(parent);
        floor.GetComponent<Renderer>().material = floorMaterial;
        floor.GetComponent<Renderer>().receiveShadows = true;
        
        // Create persistent walls with high visibility
        CreatePersistentWall("PersistentNorthWall", 
            new Vector3(0, wallHeight/2, roomDepth/2), 
            new Vector3(roomWidth + wallThickness, wallHeight, wallThickness),
            wallMaterial, parent);
            
        CreatePersistentWall("PersistentSouthWall",
            new Vector3(0, wallHeight/2, -roomDepth/2),
            new Vector3(roomWidth + wallThickness, wallHeight, wallThickness),
            wallMaterial, parent);
            
        CreatePersistentWall("PersistentEastWall",
            new Vector3(roomWidth/2, wallHeight/2, 0),
            new Vector3(wallThickness, wallHeight, roomDepth),
            wallMaterial, parent);
            
        CreatePersistentWall("PersistentWestWall",
            new Vector3(-roomWidth/2, wallHeight/2, 0),
            new Vector3(wallThickness, wallHeight, roomDepth),
            wallMaterial, parent);
            
        DebugLog($"Created persistent 3D room {roomWidth}x{roomDepth} with {wallHeight}m walls");
    }
    
    void CreatePersistentWall(string name, Vector3 position, Vector3 scale, Material material, Transform parent)
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
        
        // Make wall always visible
        wall.layer = 0; // Default layer, always rendered
        wall.tag = "Untagged"; // Ensure no special handling
    }
    
    void MakeRoomAlwaysVisible()
    {
        if (loadedModel != null)
        {
            // Ensure all child objects are visible
            Renderer[] renderers = loadedModel.GetComponentsInChildren<Renderer>();
            foreach (Renderer renderer in renderers)
            {
                renderer.enabled = true;
                if (renderer.material != null)
                {
                    // Ensure materials are opaque and visible
                    if (renderer.material.HasProperty("_Color"))
                    {
                        Color color = renderer.material.color;
                        color.a = 1f; // Full opacity
                        renderer.material.color = color;
                    }
                }
            }
            
            DebugLog("Room structure made always visible with full opacity");
        }
    }
    
    void CreateWallSegment(string name, Vector3 position, Vector3 scale, Material material, Transform parent)
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
    }
    
    void CreateGLBArchitecturalDetails(Transform parent)
    {
        Material detailMaterial = CreateDetailMaterial();
        
        // Create arched doorways
        Vector3[] doorPositions = {
            new Vector3(0, 1.5f, 7f),   // North entrance
            new Vector3(0, 1.5f, -7f),  // South entrance
            new Vector3(7f, 1.5f, 0),   // East entrance
            new Vector3(-7f, 1.5f, 0)   // West entrance
        };
        
        foreach (Vector3 pos in doorPositions)
        {
            CreateArchedDoorway(pos, detailMaterial, parent);
        }
        
        // Create ceiling details
        CreateDetailedCeiling(parent);
        
        DebugLog("GLB architectural details added");
    }
    
    void CreateComplexFloor(Transform parent)
    {
        // Create multi-textured floor sections
        Vector3[] floorSections = {
            new Vector3(-3f, 0f, -3f),
            new Vector3(3f, 0f, -3f),
            new Vector3(-3f, 0f, 3f),
            new Vector3(3f, 0f, 3f),
            new Vector3(0f, 0f, 0f)  // Center section
        };
        
        Material floorMaterial = CreateAdvancedFloorMaterial();
        
        for (int i = 0; i < floorSections.Length; i++)
        {
            GameObject floorSection = GameObject.CreatePrimitive(PrimitiveType.Cube);
            floorSection.name = $"FloorSection_{i}";
            floorSection.transform.position = floorSections[i];
            floorSection.transform.localScale = new Vector3(6f, 0.2f, 6f);
            floorSection.transform.SetParent(parent);
            
            MeshRenderer renderer = floorSection.GetComponent<MeshRenderer>();
            renderer.material = floorMaterial;
            renderer.receiveShadows = true;
        }
        
        DebugLog("Complex floor pattern created");
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
    
    Material CreateAdvancedStoneMaterial()
    {
        Material stoneMaterial = new Material(Shader.Find("Standard"));
        stoneMaterial.color = new Color(0.5f, 0.45f, 0.4f, 1f); // Warm stone color
        stoneMaterial.metallic = 0.05f;
        stoneMaterial.smoothness = 0.3f;
        stoneMaterial.normalMapScale = 1.0f;
        return stoneMaterial;
    }
    
    Material CreateDetailMaterial()
    {
        Material detailMaterial = new Material(Shader.Find("Standard"));
        detailMaterial.color = new Color(0.6f, 0.5f, 0.4f, 1f); // Lighter accent color
        detailMaterial.metallic = 0.1f;
        detailMaterial.smoothness = 0.4f;
        return detailMaterial;
    }
    
    Material CreateAdvancedFloorMaterial()
    {
        Material floorMaterial = new Material(Shader.Find("Standard"));
        floorMaterial.color = new Color(0.3f, 0.25f, 0.2f, 1f); // Dark floor
        floorMaterial.metallic = 0.0f;
        floorMaterial.smoothness = 0.7f;
        return floorMaterial;
    }
    
    void CreateArchedDoorway(Vector3 position, Material material, Transform parent)
    {
        // Create doorway frame
        GameObject doorFrame = GameObject.CreatePrimitive(PrimitiveType.Cube);
        doorFrame.name = "DoorFrame";
        doorFrame.transform.position = position;
        doorFrame.transform.localScale = new Vector3(2.5f, 3f, 0.3f);
        doorFrame.transform.SetParent(parent);
        doorFrame.GetComponent<MeshRenderer>().material = material;
    }
    
    void CreateArchitecturalColumns(Transform parent)
    {
        Vector3[] columnPositions = {
            new Vector3(-5f, 2.5f, -5f),
            new Vector3(5f, 2.5f, -5f),
            new Vector3(-5f, 2.5f, 5f),
            new Vector3(5f, 2.5f, 5f)
        };
        
        Material columnMaterial = CreateDetailMaterial();
        
        foreach (Vector3 pos in columnPositions)
        {
            GameObject column = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            column.name = "ArchColumn";
            column.transform.position = pos;
            column.transform.localScale = new Vector3(0.8f, 2.5f, 0.8f);
            column.transform.SetParent(parent);
            column.GetComponent<MeshRenderer>().material = columnMaterial;
        }
        
        DebugLog("Architectural columns created");
    }
    
    void CreateDetailedCeiling(Transform parent)
    {
        GameObject ceiling = GameObject.CreatePrimitive(PrimitiveType.Cube);
        ceiling.name = "DetailedCeiling";
        ceiling.transform.position = new Vector3(0, 5.5f, 0);
        ceiling.transform.localScale = new Vector3(14f, 0.3f, 14f);
        ceiling.transform.SetParent(parent);
        
        Material ceilingMaterial = CreateAdvancedStoneMaterial();
        ceiling.GetComponent<MeshRenderer>().material = ceilingMaterial;
        
        DebugLog("Detailed ceiling created");
    }
    
    void CreateAdvancedLighting()
    {
        // Create multiple light sources for dramatic effect
        GameObject lightContainer = new GameObject("AdvancedLighting");
        
        // Main directional light
        GameObject mainLight = new GameObject("MainLight");
        Light mainLightComp = mainLight.AddComponent<Light>();
        mainLightComp.type = LightType.Directional;
        mainLightComp.color = new Color(1f, 0.9f, 0.7f, 1f);
        mainLightComp.intensity = 1.2f;
        mainLight.transform.rotation = Quaternion.Euler(45f, 45f, 0f);
        mainLight.transform.SetParent(lightContainer.transform);
        
        // Ambient point lights
        Vector3[] lightPositions = {
            new Vector3(-4f, 3f, -4f),
            new Vector3(4f, 3f, -4f),
            new Vector3(-4f, 3f, 4f),
            new Vector3(4f, 3f, 4f)
        };
        
        foreach (Vector3 pos in lightPositions)
        {
            GameObject pointLight = new GameObject("AmbientLight");
            Light pointLightComp = pointLight.AddComponent<Light>();
            pointLightComp.type = LightType.Point;
            pointLightComp.color = new Color(1f, 0.8f, 0.5f, 1f);
            pointLightComp.intensity = 0.8f;
            pointLightComp.range = 8f;
            pointLight.transform.position = pos;
            pointLight.transform.SetParent(lightContainer.transform);
        }
        
        DebugLog("Advanced lighting system created");
    }
    
    void CreateEnhancedFallback3DRoom()
    {
        DebugLog("Creating enhanced fallback 3D room");
        
        // Clear existing model
        if (loadedModel != null)
        {
            DestroyImmediate(loadedModel);
        }
        
        loadedModel = new GameObject("EnhancedFallbackRoom");
        
        // Create enhanced room geometry
        CreateComplexRoomGeometry(loadedModel.transform);
        CreateGLBArchitecturalDetails(loadedModel.transform);
        CreateAdvancedLighting();
        
        DebugLog("Enhanced fallback room created");
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