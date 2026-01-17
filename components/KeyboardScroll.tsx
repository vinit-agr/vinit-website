"use client";

import { useScroll, useTransform, useMotionValueEvent, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 192;
const IMAGES_BASE_PATH = "/assets/Keyboard Sequence";

export default function KeyboardScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Scroll progress for the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll progress (0 to 1) to frame index (0 to FRAME_COUNT - 1)
    const currentIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // Text Animations
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4], [0, 1, 0]);
    const x2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4], [-50, 0, -50]);

    const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7], [0, 1, 0]);
    const x3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7], [50, 0, 50]);

    const opacity4 = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);
    const scale4 = useTransform(scrollYProgress, [0.8, 0.9], [0.9, 1]);

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises: Promise<void>[] = [];

            for (let i = 1; i <= FRAME_COUNT; i++) {
                const promise = new Promise<void>((resolve) => {
                    const img = new Image();
                    const fileName = i.toString().padStart(5, "0") + ".png";
                    img.src = `${IMAGES_BASE_PATH}/${fileName}`;
                    img.onload = () => {
                        loadedImages[i - 1] = img;
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${fileName}`);
                        resolve();
                    };
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            setImages(loadedImages);
            setIsLoading(false);
        };

        loadImages();
    }, []);

    // Draw frame to canvas
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.round(index))
        );

        const img = images[frameIndex];
        if (!img) return;

        // High-DPI handling
        const dpr = window.devicePixelRatio || 1;
        const canvasWidth = canvas.clientWidth * dpr;
        const canvasHeight = canvas.clientHeight * dpr;

        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
        }

        // "Contain" fit
        const imgRatio = img.width / img.height;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawHeight = canvasHeight;
            drawWidth = drawHeight * imgRatio;
            offsetX = (canvasWidth - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = canvasWidth;
            drawHeight = drawWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvasHeight - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    useMotionValueEvent(currentIndex, "change", (latest) => {
        if (!isLoading && images.length > 0) {
            renderFrame(latest);
        }
    });

    useEffect(() => {
        if (!isLoading && images.length > 0) {
            renderFrame(currentIndex.get());
        }
    }, [isLoading, images]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const handleResize = () => {
            if (!isLoading && images.length > 0) {
                renderFrame(currentIndex.get());
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isLoading, images]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-[#050505] z-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-white/20 border-t-white/90 rounded-full animate-spin" />
                        <p className="text-white/60 text-sm font-medium tracking-widest uppercase">Initializing Tars</p>
                    </div>
                </div>
            )}

            <div ref={containerRef} className="relative h-[400vh] bg-[#050505]">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-contain block"
                    />

                    {/* Text Layer - Pointer events none to allow scrolling through */}
                    <div className="absolute inset-0 pointer-events-none z-10">

                        {/* 0% - Title */}
                        <motion.div
                            style={{ opacity: opacity1, y: y1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                        >
                            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white/90 mb-4">
                                Tars. Pure Feel.
                            </h1>
                            <p className="text-xl text-white/60 max-w-md">
                                The mechanical experience, redefined.
                            </p>
                        </motion.div>

                        {/* 30% - Left Aligned */}
                        <motion.div
                            style={{ opacity: opacity2, x: x2 }}
                            className="absolute top-1/2 -translate-y-1/2 left-8 md:left-24 max-w-md"
                        >
                            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white/90 mb-2">
                                Precision Engineering.
                            </h2>
                            <p className="text-lg text-white/60">
                                Every switch calibrated for the perfect actuation.
                            </p>
                        </motion.div>

                        {/* 60% - Right Aligned */}
                        <motion.div
                            style={{ opacity: opacity3, x: x3 }}
                            className="absolute top-1/2 -translate-y-1/2 right-8 md:right-24 max-w-md text-right"
                        >
                            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white/90 mb-2">
                                Titanium Drivers.
                            </h2>
                            <p className="text-lg text-white/60">
                                Aerospace-grade materials for zero flex.
                            </p>
                        </motion.div>

                        {/* 90% - Center CTA */}
                        <motion.div
                            style={{ opacity: opacity4, scale: scale4 }}
                            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
                        >
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white/90 mb-8">
                                Tap Everything.
                            </h2>
                            <button className="px-8 py-4 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-200 transition-colors">
                                Pre-order Now
                            </button>
                        </motion.div>

                    </div>
                </div>
            </div>
        </>
    );
}
