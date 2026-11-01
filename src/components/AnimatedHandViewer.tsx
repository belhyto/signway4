import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

interface AnimatedHandViewerProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

export function AnimatedHandViewer({ videoRef }: AnimatedHandViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationFrame = 0;
    let mixer: THREE.AnimationMixer | null = null;
    let animationDuration = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x526078, 2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(2, 4, 5);
    scene.add(keyLight);

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(container);

    const loader = new GLTFLoader();
    loader.load(
      '/hand_animation.glb',
      (gltf) => {
        if (disposed) return;

        const model = gltf.scene;
        scene.add(model);

        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        const largestDimension = Math.max(size.x, size.y, size.z, 0.01);
        model.position.sub(center);
        model.rotation.x = -Math.PI / 2;

        const fieldOfView = THREE.MathUtils.degToRad(camera.fov);
        const distance = (largestDimension / 2 / Math.tan(fieldOfView / 2)) * 1.35;
        camera.position.set(0, 0, distance);
        camera.lookAt(0, 0, 0);
        camera.near = Math.max(distance / 100, 0.01);
        camera.far = distance * 100;
        camera.updateProjectionMatrix();

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixer?.clipAction(clip).play();
            animationDuration = Math.max(animationDuration, clip.duration);
          });
        }
      },
      undefined,
      (error) => {
        console.error('AnimatedHandViewer: failed to load hand model', error);
      }
    );

    const renderFrame = () => {
      const video = videoRef.current;
      if (mixer && animationDuration > 0) {
        const videoDuration = video?.duration;
        const progress = videoDuration && Number.isFinite(videoDuration)
          ? THREE.MathUtils.clamp(video.currentTime / videoDuration, 0, 1)
          : 0;
        mixer.setTime(progress * animationDuration);
      }
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(renderFrame);
    };
    renderFrame();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      mixer?.stopAllAction();
      renderer.dispose();
      renderer.domElement.remove();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, [videoRef]);

  return (
    <div
      ref={containerRef}
      className="min-h-0 w-full flex-1 overflow-hidden rounded-xl bg-black/20"
      style={{ flex: '1 1 0%', minHeight: 0 }}
      role="img"
      aria-label="Animated 3D hand synchronized with the sign video"
    />
  );
}