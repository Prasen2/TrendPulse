import { useEffect, useRef, useCallback } from 'react';
import { z } from 'zod';
import * as THREE from 'three';
import { HotspotSchema, getCategoryColor, latLngToVector3 } from '../types/hotspot';

/**
 * Zod schema for Globe props
 */
export const GlobePropsSchema = z.object({
  radius: z.number().min(50).max(500).describe('Sphere radius in pixels'),
  color: z.string().describe('Globe color (hex format, e.g. #4a9eff)'),
  opacity: z.number().min(0).max(1).describe('Globe opacity (0 = transparent, 1 = opaque)'),
  wireframe: z.boolean().describe('Render as wireframe or solid'),
  rotationSpeed: z.number().min(0).max(0.01).describe('Rotation speed in radians per frame'),
  rotationEnabled: z.boolean().describe('Enable/disable automatic rotation'),
  interactionEnabled: z.boolean().describe('Allow user to interact with globe'),
  resumeDelayMs: z.number().min(0).max(10000).describe('Delay before resuming auto-rotation'),
  hotspots: z.array(HotspotSchema).describe('Trend hotspots to display'),
  onInteractionStart: z.function().args().returns(z.void()).optional(),
  onInteractionEnd: z.function().args().returns(z.void()).optional(),
  hoveredCategory: z.string().optional().describe('Currently hovered category for highlighting'),
});

export type GlobeProps = z.infer<typeof GlobePropsSchema>;

export function Globe({ 
  radius, 
  color, 
  opacity, 
  wireframe,
  rotationSpeed,
  rotationEnabled,
  interactionEnabled,
  hotspots,
  onInteractionStart,
  onInteractionEnd,
  hoveredCategory
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    sphere: THREE.Mesh;
    hotspotsGroup: THREE.Group;
    stars: THREE.Points | null;
    clock: THREE.Clock;
  } | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Interaction state
  const interactionStateRef = useRef({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    currentRotation: { x: 0, y: 0 },
  });

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    
    // Dark space-like background
    scene.background = new THREE.Color(0x050810);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      2000
    );
    camera.position.z = radius * 3;

    // Renderer with better quality
    const renderer = new THREE.WebGLRenderer({ 
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Add subtle ambient light for depth
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Create star field background
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      // Random position in sphere around the globe
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const distance = radius * 4 + Math.random() * radius * 2;
      
      starPositions[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = distance * Math.cos(phi);
      
      // Subtle blue-white color variation
      const colorVariation = 0.8 + Math.random() * 0.2;
      starColors[i * 3] = colorVariation * 0.9;
      starColors[i * 3 + 1] = colorVariation * 0.95;
      starColors[i * 3 + 2] = colorVariation;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Sphere geometry - reduced segments for cleaner wireframe
    const geometry = new THREE.SphereGeometry(
      radius,
      32, // Reduced from 64 for lighter wireframe
      32
    );

    // Improved wireframe material with glow
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.25, // Reduced opacity for background role
      wireframe: wireframe,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add subtle outer glow to wireframe
    const glowGeometry = new THREE.SphereGeometry(radius * 1.01, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.1,
      wireframe: true,
      side: THREE.BackSide
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    sphere.add(glowMesh);

    // Create group for hotspots
    const hotspotsGroup = new THREE.Group();
    sphere.add(hotspotsGroup);

    // Clock for animations
    const clock = new THREE.Clock();

    // Store references
    sceneRef.current = { scene, camera, renderer, sphere, hotspotsGroup, stars, clock };

    // Initial render
    renderer.render(scene, camera);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      sceneRef.current.camera.aspect = newWidth / newHeight;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (sceneRef.current) {
        // Dispose geometries and materials
        starsGeometry.dispose();
        starsMaterial.dispose();
        geometry.dispose();
        material.dispose();
        glowGeometry.dispose();
        glowMaterial.dispose();
        
        sceneRef.current.renderer.dispose();
        sceneRef.current.scene.clear();
        if (container.contains(sceneRef.current.renderer.domElement)) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, []);

  // Render hotspots with improved visuals
  useEffect(() => {
    if (!sceneRef.current) return;

    const { hotspotsGroup, renderer, scene, camera } = sceneRef.current;

    // Clear existing hotspots
    while (hotspotsGroup.children.length > 0) {
      const child = hotspotsGroup.children[0];
      hotspotsGroup.remove(child);
      
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    // Render new hotspots with improved design
    hotspots.forEach((hotspot) => {
      const position = latLngToVector3(hotspot.lat, hotspot.lng, radius);
      const categoryColor = getCategoryColor(hotspot.category);

      // Calculate node size based on intensity (trend score)
      // Larger nodes = more popular trends
      const minSize = 2;
      const maxSize = 8;
      const nodeSize = minSize + (hotspot.intensity * (maxSize - minSize));

      // Core node with emissive glow
      const nodeGeometry = new THREE.SphereGeometry(nodeSize, 16, 16);

      // Add emissive property for self-illumination
      const emissiveMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(categoryColor),
        emissive: new THREE.Color(categoryColor),
        emissiveIntensity: hotspot.intensity * 0.8,
        transparent: true,
        opacity: 0.95,
      });

      const node = new THREE.Mesh(nodeGeometry, emissiveMaterial);
      node.position.set(position.x, position.y, position.z);
      
      // Store metadata for animations
      node.userData = {
        hotspotId: hotspot.id,
        category: hotspot.category,
        intensity: hotspot.intensity,
        baseSize: nodeSize,
        pulsePhase: Math.random() * Math.PI * 2, // Random phase for pulse
        floatPhase: Math.random() * Math.PI * 2, // Random phase for float
      };

      // Outer glow layers for premium effect
      const glowSize1 = nodeSize * 1.5;
      const glowGeometry1 = new THREE.SphereGeometry(glowSize1, 12, 12);
      const glowMaterial1 = new THREE.MeshBasicMaterial({
        color: new THREE.Color(categoryColor),
        transparent: true,
        opacity: 0.3 * hotspot.intensity,
        side: THREE.BackSide,
      });
      const glow1 = new THREE.Mesh(glowGeometry1, glowMaterial1);
      glow1.position.copy(node.position);

      // Second glow layer for depth
      const glowSize2 = nodeSize * 2;
      const glowGeometry2 = new THREE.SphereGeometry(glowSize2, 12, 12);
      const glowMaterial2 = new THREE.MeshBasicMaterial({
        color: new THREE.Color(categoryColor),
        transparent: true,
        opacity: 0.15 * hotspot.intensity,
        side: THREE.BackSide,
      });
      const glow2 = new THREE.Mesh(glowGeometry2, glowMaterial2);
      glow2.position.copy(node.position);

      // Add to scene (order matters for rendering)
      hotspotsGroup.add(glow2);
      hotspotsGroup.add(glow1);
      hotspotsGroup.add(node);
    });

    if (!rotationEnabled || rotationSpeed === 0) {
      renderer.render(scene, camera);
    }
  }, [hotspots, radius, rotationEnabled, rotationSpeed]);

  // Animation loop with pulse and float effects
  useEffect(() => {
    if (!sceneRef.current) return;

    const { sphere, renderer, scene, camera, hotspotsGroup, stars, clock } = sceneRef.current;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (!rotationEnabled || rotationSpeed === 0) {
      renderer.render(scene, camera);
      return;
    }

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Auto-rotate sphere
      if (!interactionStateRef.current.isDragging) {
        sphere.rotation.y += rotationSpeed;
      }

      // Animate star field (very slow rotation for parallax)
      if (stars) {
        stars.rotation.y = elapsedTime * 0.01;
      }

      // Animate hotspot nodes
      hotspotsGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData.hotspotId) {
          const { intensity, pulsePhase, floatPhase } = child.userData;

          // Pulse effect for high-intensity trends (intensity > 0.6)
          if (intensity > 0.6) {
            const pulseSpeed = 2;
            const pulseAmount = 0.15;
            const pulse = 1 + Math.sin(elapsedTime * pulseSpeed + pulsePhase) * pulseAmount;
            child.scale.setScalar(pulse);

            // Pulse emissive intensity
            if (child.material instanceof THREE.MeshStandardMaterial) {
              const emissivePulse = intensity * 0.6 + Math.sin(elapsedTime * pulseSpeed + pulsePhase) * 0.2;
              child.material.emissiveIntensity = Math.max(0.4, emissivePulse);
            }
          }

          // Subtle floating motion (noise-like movement)
          const floatSpeed = 1;
          const floatAmount = 0.3;
          const floatOffset = Math.sin(elapsedTime * floatSpeed + floatPhase) * floatAmount;
          
          // Apply float to position (radial direction)
          const direction = child.position.clone().normalize();
          const floatPosition = child.position.clone().add(direction.multiplyScalar(floatOffset));
          child.position.copy(floatPosition);
        }
      });

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [rotationSpeed, rotationEnabled]);

  // Update sphere visual properties
  useEffect(() => {
    if (!sceneRef.current) return;

    const { sphere, renderer, scene, camera } = sceneRef.current;

    if (sphere.geometry instanceof THREE.SphereGeometry) {
      const currentRadius = sphere.geometry.parameters.radius;
      if (currentRadius !== radius) {
        sphere.geometry.dispose();
        sphere.geometry = new THREE.SphereGeometry(radius, 32, 32);
        camera.position.z = radius * 3;
      }
    }

    if (sphere.material instanceof THREE.MeshBasicMaterial) {
      sphere.material.color = new THREE.Color(color);
      sphere.material.opacity = Math.min(opacity, 0.3); // Cap at 0.3 for background role
      sphere.material.transparent = true;
      sphere.material.wireframe = wireframe;
    }

    if (!rotationEnabled || rotationSpeed === 0) {
      renderer.render(scene, camera);
    }
  }, [radius, color, opacity, wireframe, rotationEnabled, rotationSpeed]);

  // Category hover highlighting
  useEffect(() => {
    if (!sceneRef.current) return;

    const { hotspotsGroup, renderer, scene, camera } = sceneRef.current;

    hotspotsGroup.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.userData.category) {
        const isHighlighted = hoveredCategory === child.userData.category;
        const isDimmed = hoveredCategory && hoveredCategory !== child.userData.category;

        if (child.material instanceof THREE.MeshStandardMaterial) {
          if (isHighlighted) {
            child.material.emissiveIntensity = child.userData.intensity * 1.2;
            child.scale.setScalar(1.2);
          } else if (isDimmed) {
            child.material.emissiveIntensity = child.userData.intensity * 0.3;
            child.material.opacity = 0.4;
          } else {
            child.material.emissiveIntensity = child.userData.intensity * 0.8;
            child.material.opacity = 0.95;
            child.scale.setScalar(1);
          }
        }
      }
    });

    if (!rotationEnabled || rotationSpeed === 0) {
      renderer.render(scene, camera);
    }
  }, [hoveredCategory, rotationEnabled, rotationSpeed]);

  // Interaction handlers
  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactionEnabled || !sceneRef.current) return;

    interactionStateRef.current.isDragging = true;
    interactionStateRef.current.previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };

    onInteractionStart?.();
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [interactionEnabled, onInteractionStart]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactionEnabled || !sceneRef.current || !interactionStateRef.current.isDragging) return;

    const { sphere, renderer, scene, camera } = sceneRef.current;
    const { previousMousePosition } = interactionStateRef.current;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    const rotationSensitivity = 0.005;
    
    sphere.rotation.y += deltaX * rotationSensitivity;
    sphere.rotation.x += deltaY * rotationSensitivity;

    const maxXRotation = Math.PI / 2;
    sphere.rotation.x = Math.max(-maxXRotation, Math.min(maxXRotation, sphere.rotation.x));

    interactionStateRef.current.previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };

    interactionStateRef.current.currentRotation = {
      x: sphere.rotation.x,
      y: sphere.rotation.y,
    };

    renderer.render(scene, camera);
  }, [interactionEnabled]);

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactionEnabled || !interactionStateRef.current.isDragging) return;

    interactionStateRef.current.isDragging = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onInteractionEnd?.();
  }, [interactionEnabled, onInteractionEnd]);

  const handlePointerLeave = useCallback(() => {
    if (!interactionEnabled || !interactionStateRef.current.isDragging) return;

    interactionStateRef.current.isDragging = false;
    onInteractionEnd?.();
  }, [interactionEnabled, onInteractionEnd]);

  return (
    <div 
      ref={containerRef}
      className="globe-container"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactionEnabled ? (interactionStateRef.current.isDragging ? 'grabbing' : 'grab') : 'default',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    />
  );
}