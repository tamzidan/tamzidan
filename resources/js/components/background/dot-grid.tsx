import { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

const throttle = (func: Function, limit: number) => {
    let lastCall = 0;
    return function (this: any, ...args: any[]) {
        const now = performance.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func.apply(this, args);
        }
    };
};

function hexToRgb(hex: string) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return { r: 0, g: 0, b: 0 };
    return {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16),
    };
}

interface Dot {
    cx: number;
    cy: number;
    xOffset: number;
    yOffset: number;
    _inertiaApplied: boolean;
}

interface DotGridProps {
    dotSize?: number;
    gap?: number;
    baseColor?: string;
    activeColor?: string;
    proximity?: number;
    shockRadius?: number;
    shockStrength?: number;
    resistance?: number;
    returnDuration?: number;
}

const DotGrid: React.FC<DotGridProps> = ({
    dotSize = 5,
    gap = 25,
    baseColor = '#060010',
    activeColor = '#888888',
    proximity = 120,
    shockRadius = 250,
    shockStrength = 5,
    resistance = 750,
    returnDuration = 1.5,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dotsRef = useRef<Dot[]>([]);
    const pointerRef = useRef({ x: 0, y: 0 });

    const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
    const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

    const circlePath = useMemo(() => {
        if (typeof window === 'undefined' || !window.Path2D) return null;
        const p = new Path2D();
        p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
        return p;
    }, [dotSize]);

    const buildGrid = useCallback(() => {
        const wrap = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const { width, height } = wrap.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);

        const cols = Math.floor((width + gap) / (dotSize + gap));
        const rows = Math.floor((height + gap) / (dotSize + gap));
        const cell = dotSize + gap;
        const gridW = cell * cols - gap;
        const gridH = cell * rows - gap;
        const extraX = width - gridW;
        const extraY = height - gridH;
        const startX = extraX / 2 + dotSize / 2;
        const startY = extraY / 2 + dotSize / 2;

        const dots: Dot[] = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = startX + x * cell;
                const cy = startY + y * cell;
                dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
            }
        }
        dotsRef.current = dots;
    }, [dotSize, gap]);

    useEffect(() => {
        if (!circlePath) return;
        let rafId: number;
        const proxSq = proximity * proximity;

        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const { x: px, y: py } = pointerRef.current;

            for (const dot of dotsRef.current) {
                const ox = dot.cx + dot.xOffset;
                const oy = dot.cy + dot.yOffset;
                const dx = dot.cx - px;
                const dy = dot.cy - py;
                const dsq = dx * dx + dy * dy;

                let style = `rgb(${baseRgb.r},${baseRgb.g},${baseRgb.b})`;
                if (dsq <= proxSq) {
                    const dist = Math.sqrt(dsq);
                    const t = 1 - dist / proximity;
                    const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
                    const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
                    const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
                    style = `rgb(${r},${g},${b})`;
                }

                ctx.save();
                ctx.translate(ox, oy);
                ctx.fillStyle = style;
                ctx.fill(circlePath);
                ctx.restore();
            }
            rafId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(rafId);
    }, [proximity, activeRgb, baseRgb, circlePath]);

    useEffect(() => {
        buildGrid();
        let ro: ResizeObserver | null = null;
        if ('ResizeObserver' in window) {
            ro = new ResizeObserver(buildGrid);
            if (wrapperRef.current) ro.observe(wrapperRef.current);
        } else {
            window.addEventListener('resize', buildGrid);
        }
        return () => {
            if (ro && wrapperRef.current) ro.unobserve(wrapperRef.current);
            else window.removeEventListener('resize', buildGrid);
        };
    }, [buildGrid]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            pointerRef.current.x = e.clientX - rect.left;
            pointerRef.current.y = e.clientY - rect.top;
        };

        const onClick = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            for (const dot of dotsRef.current) {
                const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
                if (dist < shockRadius && !dot._inertiaApplied) {
                    dot._inertiaApplied = true;
                    gsap.killTweensOf(dot);
                    const falloff = Math.max(0, 1 - dist / shockRadius);
                    const pushX = (dot.cx - cx) * shockStrength * falloff;
                    const pushY = (dot.cy - cy) * shockStrength * falloff;

                    gsap.to(dot, {
                        xOffset: pushX,
                        yOffset: pushY,
                        duration: 0.1,
                        onComplete: () => {
                            gsap.to(dot, {
                                xOffset: 0,
                                yOffset: 0,
                                duration: returnDuration,
                                ease: 'elastic.out(1,0.75)',
                                onComplete: () => {
                                    dot._inertiaApplied = false;
                                },
                            });
                        },
                    });
                }
            }
        };

        const throttledMove = throttle(onMove, 16);
        window.addEventListener('mousemove', throttledMove as EventListener, { passive: true });
        window.addEventListener('click', onClick);

        return () => {
            window.removeEventListener('mousemove', throttledMove as EventListener);
            window.removeEventListener('click', onClick);
        };
    }, [resistance, returnDuration, shockRadius, shockStrength]);

    return (
        <div ref={wrapperRef} className="w-full h-full absolute inset-0 z-0">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default DotGrid;
