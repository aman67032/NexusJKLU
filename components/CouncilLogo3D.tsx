'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function CouncilLogo3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Scene setup
        const scene = new THREE.Scene();

        // Camera setup - aspect will be updated in setSize
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
        camera.position.set(0, 0, 8); // Brought closer to reduce whitespace

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.domElement.style.display = 'block';
        container.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 0, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
        mainLight.position.set(10, 10, 10);
        scene.add(mainLight);

        const pointLight = new THREE.PointLight(0xff6600, 4);
        pointLight.position.set(-10, -10, 5);
        scene.add(pointLight);

        // Unified Set Size Function
        const setSize = () => {
            if (!container) return;
            const width = container.clientWidth;
            const height = container.clientHeight;
            if (width === 0 || height === 0) return;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        // ResizeObserver for reliable dimension tracking
        const resizeObserver = new ResizeObserver(() => setSize());
        resizeObserver.observe(container);

        // Model loading
        let model: THREE.Group | null = null;
        let wrapperGroup = new THREE.Group();
        scene.add(wrapperGroup);

        const loader = new GLTFLoader();
        loader.load(
            '/council_logo.glb',
            (gltf) => {
                model = gltf.scene;

                // Absolute Center Calculation
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                // Offset model so its geometric center is at the group's origin
                model.position.set(-center.x, -center.y, -center.z);
                wrapperGroup.add(model);

                // Fit model to view
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 5.2 / maxDim; // Increased scale for tighter fit
                wrapperGroup.scale.set(scale, scale, scale);

                setLoading(false);
                setSize(); // Final size sync
            },
            undefined,
            (err) => {
                console.error('3D Load Error:', err);
                setError(true);
                setLoading(false);
            }
        );

        // Animation loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationId);
            controls.dispose();
            renderer.dispose();
            scene.clear();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center overflow-visible">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-10 h-10 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {error && (
                <div className="text-red-500/80 text-sm font-medium">Logo asset unavailable</div>
            )}
            <div
                ref={containerRef}
                className="w-full h-full flex items-center justify-center outline-none"
            />
        </div>
    );
}
