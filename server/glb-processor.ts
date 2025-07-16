import { promises as fs } from 'fs';
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import path from 'path';

export interface MeshData {
  vertices: number[];
  indices: number[];
  normals: number[];
  uvs: number[];
  name: string;
}

export interface ProcessedGLB {
  meshes: MeshData[];
  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
  materials: Array<{
    name: string;
    baseColor: number[];
    metallic: number;
    roughness: number;
  }>;
}

export class GLBProcessor {
  private io: NodeIO;

  constructor() {
    this.io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  }

  async processGLBFile(filePath: string): Promise<ProcessedGLB> {
    try {
      console.log(`Processing GLB file: ${filePath}`);
      
      // Read the GLB file
      const glbBuffer = await fs.readFile(filePath);
      console.log(`GLB file size: ${glbBuffer.length} bytes`);
      
      // Parse with gltf-transform
      const document = await this.io.readBinary(glbBuffer);
      
      // Extract mesh data
      const meshes: MeshData[] = [];
      const materials: any[] = [];
      let boundingBox = {
        min: { x: Infinity, y: Infinity, z: Infinity },
        max: { x: -Infinity, y: -Infinity, z: -Infinity }
      };

      // Process each mesh in the document
      const gltfMeshes = document.getRoot().listMeshes();
      console.log(`Found ${gltfMeshes.length} meshes in GLB`);

      for (let i = 0; i < gltfMeshes.length; i++) {
        const mesh = gltfMeshes[i];
        const primitives = mesh.listPrimitives();

        for (let j = 0; j < primitives.length; j++) {
          const primitive = primitives[j];
          const meshData = await this.extractPrimitiveData(primitive);
          
          if (meshData) {
            meshes.push({
              ...meshData,
              name: `${mesh.getName() || 'Mesh'}_${i}_${j}`
            });

            // Update bounding box
            for (let k = 0; k < meshData.vertices.length; k += 3) {
              const x = meshData.vertices[k];
              const y = meshData.vertices[k + 1];
              const z = meshData.vertices[k + 2];
              
              boundingBox.min.x = Math.min(boundingBox.min.x, x);
              boundingBox.min.y = Math.min(boundingBox.min.y, y);
              boundingBox.min.z = Math.min(boundingBox.min.z, z);
              boundingBox.max.x = Math.max(boundingBox.max.x, x);
              boundingBox.max.y = Math.max(boundingBox.max.y, y);
              boundingBox.max.z = Math.max(boundingBox.max.z, z);
            }
          }

          // Extract material data
          const material = primitive.getMaterial();
          if (material) {
            const baseColorFactor = material.getBaseColorFactor();
            const metallicFactor = material.getMetallicFactor();
            const roughnessFactor = material.getRoughnessFactor();
            
            materials.push({
              name: material.getName() || `Material_${materials.length}`,
              baseColor: baseColorFactor,
              metallic: metallicFactor,
              roughness: roughnessFactor
            });
          }
        }
      }

      console.log(`Extracted ${meshes.length} mesh primitives`);
      console.log(`Bounding box:`, boundingBox);

      return {
        meshes,
        boundingBox,
        materials
      };

    } catch (error) {
      console.error('Error processing GLB file:', error);
      throw error;
    }
  }

  private async extractPrimitiveData(primitive: any): Promise<MeshData | null> {
    try {
      // Get vertex positions
      const positionAccessor = primitive.getAttribute('POSITION');
      const vertices = positionAccessor ? Array.from(positionAccessor.getArray()) : [];

      // Get indices
      const indexAccessor = primitive.getIndices();
      const indices = indexAccessor ? Array.from(indexAccessor.getArray()) : [];

      // Get normals
      const normalAccessor = primitive.getAttribute('NORMAL');
      const normals = normalAccessor ? Array.from(normalAccessor.getArray()) : [];

      // Get UVs
      const uvAccessor = primitive.getAttribute('TEXCOORD_0');
      const uvs = uvAccessor ? Array.from(uvAccessor.getArray()) : [];

      console.log(`Primitive data: ${vertices.length/3} vertices, ${indices.length/3} triangles`);

      if (vertices.length === 0) {
        console.warn('No vertex data found in primitive');
        return null;
      }

      return {
        vertices,
        indices,
        normals,
        uvs,
        name: 'Primitive'
      };

    } catch (error) {
      console.error('Error extracting primitive data:', error);
      return null;
    }
  }
}