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
        // Create floor
        GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Plane);
        floor.transform.position = Vector3.zero;
        floor.transform.localScale = new Vector3(2, 1, 2);
        floor.GetComponent<Renderer>().material.color = new Color(0.2f, 0.2f, 0.2f);

        // Create walls
        CreateWall(new Vector3(0, 0.5f, 10), new Vector3(20, 1, 1));
        CreateWall(new Vector3(0, 0.5f, -10), new Vector3(20, 1, 1));
        CreateWall(new Vector3(10, 0.5f, 0), new Vector3(1, 1, 20));
        CreateWall(new Vector3(-10, 0.5f, 0), new Vector3(1, 1, 20));

        // Add lighting
        GameObject light = new GameObject("Dungeon Light");
        Light lightComponent = light.AddComponent<Light>();
        lightComponent.type = LightType.Directional;
        lightComponent.intensity = 0.8f;
        lightComponent.color = new Color(1f, 0.8f, 0.6f);
        light.transform.rotation = Quaternion.Euler(50, -30, 0);
    }

    void CreateWall(Vector3 position, Vector3 scale)
    {
        GameObject wall = GameObject.CreatePrimitive(PrimitiveType.Cube);
        wall.transform.position = position;
        wall.transform.localScale = scale;
        wall.GetComponent<Renderer>().material.color = new Color(0.3f, 0.3f, 0.3f);
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

            // Create new devices
            foreach (var deviceData in deviceArray)
            {
                GameObject device = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                device.transform.position = new Vector3(deviceData.position.x, 0.5f, deviceData.position.z);
                device.transform.localScale = Vector3.one * 0.3f;
                
                // Set device color based on status
                Material material = deviceData.status == "online" ? deviceOnlineMaterial : deviceOfflineMaterial;
                if (material == null)
                {
                    material = new Material(Shader.Find("Standard"));
                    material.color = deviceData.status == "online" ? Color.green : Color.red;
                }
                device.GetComponent<Renderer>().material = material;

                // Add click handler
                DeviceClickHandler clickHandler = device.AddComponent<DeviceClickHandler>();
                clickHandler.deviceId = deviceData.id;
                clickHandler.controller = this;

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

    public void ResetCamera()
    {
        if (mainCamera != null)
        {
            mainCamera.transform.position = new Vector3(8, 8, 8);
            mainCamera.transform.LookAt(Vector3.zero);
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