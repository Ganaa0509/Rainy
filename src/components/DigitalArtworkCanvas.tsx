import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SceneSettings } from '../types/artwork';

interface Raindrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  thickness: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface FallingLeaf {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  angle: number;
  angularSpeed: number;
  oscillation: number;
}

interface DigitalArtworkCanvasProps {
  settings: SceneSettings;
  aspectRatio: '3:4' | '16:9' | '9:16' | '1:1';
  zoom: number;
  panOffset: { x: number; y: number };
  onResetZoom?: () => void;
  onCanvasClick?: (normX: number, normY: number) => void;
  isInspecting?: boolean;
}

export const DigitalArtworkCanvas: React.FC<DigitalArtworkCanvasProps> = ({
  settings,
  aspectRatio,
  zoom,
  panOffset,
  onCanvasClick,
  isInspecting = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Particles state refs for 60fps performance
  const raindropsRef = useRef<Raindrop[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const leavesRef = useRef<FallingLeaf[]>([]);
  const timeRef = useRef<number>(0);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Internal logical canvas dimensions (high-res 1800 x 2400 for 3:4, etc.)
  const getLogicalDimensions = useCallback(() => {
    switch (aspectRatio) {
      case '16:9':
        return { width: 2560, height: 1440 };
      case '9:16':
        return { width: 1440, height: 2560 };
      case '1:1':
        return { width: 2000, height: 2000 };
      case '3:4':
      default:
        return { width: 1800, height: 2400 };
    }
  }, [aspectRatio]);

  // Initialize rain particles
  useEffect(() => {
    const { width, height } = getLogicalDimensions();
    const count = Math.floor((settings.rainIntensity / 100) * 450);
    const drops: Raindrop[] = [];

    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * (width + 400) - 200,
        y: Math.random() * height,
        length: 18 + Math.random() * 26,
        speed: 18 + Math.random() * 22,
        opacity: 0.15 + Math.random() * 0.45,
        thickness: 0.8 + Math.random() * 1.4,
      });
    }
    raindropsRef.current = drops;
  }, [settings.rainIntensity, getLogicalDimensions]);

  // Initialize falling autumn leaves
  useEffect(() => {
    const { width, height } = getLogicalDimensions();
    const leafColors = [
      '#f59e0b', // amber gold
      '#d97706', // deep gold
      '#ea580c', // burnt orange
      '#ca8a04', // mustard yellow
      '#84cc16', // lime green accent
      '#ef4444', // vibrant red accent
    ];
    const leaves: FallingLeaf[] = [];
    const leafCount = Math.floor((settings.fallingLeavesSpeed / 100) * 35);

    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 5 + Math.random() * 9,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        speedY: 1.2 + Math.random() * 2.2,
        speedX: 0.6 + Math.random() * 1.8,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.08,
        oscillation: Math.random() * Math.PI * 2,
      });
    }
    leavesRef.current = leaves;
  }, [settings.fallingLeavesSpeed, getLogicalDimensions]);

  // Main Drawing & Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      timeRef.current += 0.02;
      const t = timeRef.current;

      const { width: W, height: H } = getLogicalDimensions();
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.save();

      // Pan & Zoom transform
      if (zoom !== 1 || panOffset.x !== 0 || panOffset.y !== 0) {
        ctx.translate(W / 2, H / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-W / 2 + panOffset.x, -H / 2 + panOffset.y);
      }

      // --- Color Grading Factors ---
      const tealIntensity = settings.tealHueDepth / 100;
      const orangeGlow = settings.orangeGlowStrength / 100;
      const mistAmt = settings.mistDensity / 100;
      const wetness = settings.wetReflectionGloss / 100;
      const lampPwr = settings.lampLuminance / 100;

      // 1. SKY & ATMOSPHERE (Moody teal-grey overcast with misty depth)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.7);
      // Modern Teal harmony: deep slate-teal transitioning to foggy silver-teal
      const skyTopR = Math.round(18 + (1 - tealIntensity) * 20);
      const skyTopG = Math.round(44 + tealIntensity * 36);
      const skyTopB = Math.round(58 + tealIntensity * 42);

      const skyMidR = Math.round(140 - tealIntensity * 40);
      const skyMidG = Math.round(175 - tealIntensity * 10);
      const skyMidB = Math.round(185 + tealIntensity * 15);

      skyGrad.addColorStop(0, `rgb(${skyTopR}, ${skyTopG}, ${skyTopB})`);
      skyGrad.addColorStop(0.35, `rgb(${Math.round(skyTopR * 0.6 + skyMidR * 0.4)}, ${Math.round(skyTopG * 0.6 + skyMidG * 0.4)}, ${Math.round(skyTopB * 0.6 + skyMidB * 0.4)})`);
      skyGrad.addColorStop(0.65, `rgb(${skyMidR}, ${skyMidG}, ${skyMidB})`);
      skyGrad.addColorStop(1, `rgb(${skyMidR + 15}, ${skyMidG + 15}, ${skyMidB + 15})`);

      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Subtle atmospheric cloud ripples in sky
      ctx.save();
      ctx.globalAlpha = 0.22 * mistAmt;
      const mistPatternGrad = ctx.createRadialGradient(W * 0.35, H * 0.2, 50, W * 0.35, H * 0.2, W * 0.8);
      mistPatternGrad.addColorStop(0, '#75a8b8');
      mistPatternGrad.addColorStop(0.5, '#487d8d');
      mistPatternGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = mistPatternGrad;
      ctx.fillRect(0, 0, W, H * 0.6);
      ctx.restore();

      // 2. BACKGROUND: SKYSCRAPER UNDER CONSTRUCTION IN MISTY BACKGROUND
      ctx.save();
      const bldgX = W * 0.08;
      const bldgY = H * 0.12;
      const bldgW = W * 0.22;
      const bldgH = H * 0.68;

      // Mist haze enveloping skyscraper
      ctx.globalAlpha = 0.45 + (1 - mistAmt) * 0.35;

      // Skyscraper core & facade
      const bldgGrad = ctx.createLinearGradient(bldgX, bldgY, bldgX + bldgW, bldgY + bldgH);
      bldgGrad.addColorStop(0, `rgba(50, 88, 100, 0.7)`);
      bldgGrad.addColorStop(1, `rgba(75, 115, 128, 0.5)`);
      ctx.fillStyle = bldgGrad;
      ctx.fillRect(bldgX, bldgY, bldgW, bldgH);

      // Structural steel grid / concrete framework
      ctx.strokeStyle = `rgba(32, 65, 75, 0.65)`;
      ctx.lineWidth = 1.8;
      const floors = 38;
      const columns = 10;
      for (let f = 0; f < floors; f++) {
        const fy = bldgY + (f / floors) * bldgH;
        ctx.beginPath();
        ctx.moveTo(bldgX, fy);
        ctx.lineTo(bldgX + bldgW, fy);
        ctx.stroke();
      }
      for (let c = 0; c < columns; c++) {
        const cx = bldgX + (c / columns) * bldgW;
        ctx.beginPath();
        ctx.moveTo(cx, bldgY);
        ctx.lineTo(cx, bldgY + bldgH);
        ctx.stroke();
      }

      // Top exposed structural columns under construction
      ctx.strokeStyle = `rgba(28, 55, 65, 0.75)`;
      ctx.lineWidth = 2.2;
      for (let sc = 0; sc < columns; sc += 2) {
        const scx = bldgX + (sc / columns) * bldgW + 5;
        ctx.beginPath();
        ctx.moveTo(scx, bldgY);
        ctx.lineTo(scx, bldgY - 45 - Math.sin(sc * 1.5) * 15);
        ctx.stroke();
      }

      // CONSTRUCTION CRANES ON TOP OF SKYSCRAPER
      // Crane 1 (Left tall tower crane with lattice boom)
      const crane1BaseX = bldgX + bldgW * 0.28;
      const crane1BaseY = bldgY;
      const crane1Height = 110;

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = `rgba(30, 58, 68, 0.85)`;
      // Tower mast
      ctx.beginPath();
      ctx.moveTo(crane1BaseX, crane1BaseY);
      ctx.lineTo(crane1BaseX, crane1BaseY - crane1Height);
      ctx.stroke();

      // Mast lattice diagonals
      ctx.lineWidth = 1;
      for (let m = 0; m < 6; m++) {
        const my = crane1BaseY - (m / 6) * crane1Height;
        ctx.beginPath();
        ctx.moveTo(crane1BaseX - 3, my);
        ctx.lineTo(crane1BaseX + 3, my - 15);
        ctx.stroke();
      }

      // Crane 1 Jib (reaching left-upwards)
      const jibAngle = -0.45;
      const jibLen = 130;
      const topX = crane1BaseX;
      const topY = crane1BaseY - crane1Height;
      const jibEndX = topX - Math.cos(jibAngle) * jibLen;
      const jibEndY = topY + Math.sin(jibAngle) * jibLen;

      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.lineTo(jibEndX, jibEndY);
      ctx.stroke();

      // Counter-jib with counterweight
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.lineTo(topX + 45, topY + 12);
      ctx.stroke();
      // Counterweight block
      ctx.fillStyle = `rgba(35, 65, 75, 0.9)`;
      ctx.fillRect(topX + 38, topY + 8, 14, 10);

      // Crane hoist cables
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(30, 58, 68, 0.6)`;
      ctx.beginPath();
      ctx.moveTo(jibEndX * 0.6 + topX * 0.4, jibEndY * 0.6 + topY * 0.4);
      ctx.lineTo(jibEndX * 0.6 + topX * 0.4, topY + 60);
      ctx.stroke();

      // Crane 2 (Right tower crane)
      const crane2BaseX = bldgX + bldgW * 0.72;
      const crane2BaseY = bldgY;
      const crane2Height = 85;
      const top2X = crane2BaseX;
      const top2Y = crane2BaseY - crane2Height;

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = `rgba(35, 68, 78, 0.8)`;
      ctx.beginPath();
      ctx.moveTo(crane2BaseX, crane2BaseY);
      ctx.lineTo(top2X, top2Y);
      ctx.stroke();

      // Crane 2 Jib (horizontal reaching right)
      ctx.beginPath();
      ctx.moveTo(top2X, top2Y);
      ctx.lineTo(top2X + 90, top2Y - 15);
      ctx.stroke();
      // Counter-jib
      ctx.beginPath();
      ctx.moveTo(top2X, top2Y);
      ctx.lineTo(top2X - 35, top2Y + 8);
      ctx.stroke();

      // Red Aviation Warning Lights blinking atop cranes
      const blink = Math.sin(t * 3) > 0.1 ? 0.9 : 0.2;
      ctx.fillStyle = `rgba(239, 68, 68, ${blink})`;
      ctx.beginPath();
      ctx.arc(topX, topY, 4, 0, Math.PI * 2);
      ctx.arc(top2X, top2Y, 3.5, 0, Math.PI * 2);
      ctx.arc(bldgX + bldgW * 0.5, bldgY - 40, 3, 0, Math.PI * 2);
      ctx.fill();

      // Adjacent modern glass tower in distance (soft teal reflection)
      const adjX = W * 0.35;
      const adjW = W * 0.32;
      const adjH = H * 0.55;
      const adjY = H * 0.18;
      ctx.fillStyle = `rgba(60, 100, 115, 0.28)`;
      ctx.fillRect(adjX, adjY, adjW, adjH);
      // Subtle vertical mullions
      ctx.strokeStyle = `rgba(75, 120, 135, 0.35)`;
      ctx.lineWidth = 1;
      for (let m = 0; m < 14; m++) {
        const mx = adjX + (m / 14) * adjW;
        ctx.beginPath();
        ctx.moveTo(mx, adjY);
        ctx.lineTo(mx, adjY + adjH);
        ctx.stroke();
      }

      ctx.restore();

      // 3. MIDGROUND: DISTANT PARK VEGETATION & FOG
      ctx.save();
      const horizonY = H * 0.68;

      // Soft layered background foliage silhouettes
      const bgTreeColors = [
        'rgba(40, 80, 85, 0.5)',
        'rgba(65, 105, 95, 0.55)',
        'rgba(145, 135, 70, 0.45)',
        'rgba(175, 145, 60, 0.5)',
      ];

      for (let i = 0; i < 22; i++) {
        const tx = W * 0.05 + (i / 22) * W * 0.9;
        const ty = horizonY - 60 + Math.sin(i * 1.8) * 35;
        const rad = 45 + Math.cos(i * 2.3) * 25;
        ctx.fillStyle = bgTreeColors[i % bgTreeColors.length];
        ctx.beginPath();
        ctx.arc(tx, ty, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mist wash over distant trees
      const mistWash = ctx.createLinearGradient(0, horizonY - 120, 0, horizonY + 20);
      mistWash.addColorStop(0, `rgba(160, 195, 205, ${0.4 * mistAmt})`);
      mistWash.addColorStop(1, `rgba(175, 205, 215, ${0.8 * mistAmt})`);
      ctx.fillStyle = mistWash;
      ctx.fillRect(0, horizonY - 120, W, 140);

      // The distant cross-street with parked white car (as in reference photograph!)
      const vanishingX = W * 0.485;
      const vanishingY = horizonY;

      // White car silhouette in mist
      const carX = vanishingX + 22;
      const carY = vanishingY - 18;
      ctx.fillStyle = 'rgba(235, 243, 245, 0.85)';
      ctx.beginPath();
      // Aerodynamic car profile
      ctx.moveTo(carX - 22, carY + 8);
      ctx.lineTo(carX - 18, carY + 3);
      ctx.lineTo(carX - 10, carY - 2);
      ctx.lineTo(carX + 12, carY - 2);
      ctx.lineTo(carX + 22, carY + 3);
      ctx.lineTo(carX + 26, carY + 8);
      ctx.closePath();
      ctx.fill();
      // Car tires
      ctx.fillStyle = 'rgba(30, 45, 50, 0.85)';
      ctx.beginPath();
      ctx.arc(carX - 13, carY + 9, 3.5, 0, Math.PI * 2);
      ctx.arc(carX + 16, carY + 9, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 4. WET SIDEWALK & PAVING STONES (True 1-point perspective)
      ctx.save();
      const pathTopLeftX = W * 0.44;
      const pathTopRightX = W * 0.54;
      const pathTopY = horizonY;
      const pathBottomLeftX = -W * 0.05;
      const pathBottomRightX = W * 0.82;
      const pathBottomY = H * 1.05;

      // Base wet paving surface gradient
      const pavementGrad = ctx.createLinearGradient(0, pathTopY, 0, pathBottomY);
      pavementGrad.addColorStop(0, '#5a737a'); // misty cool teal grey
      pavementGrad.addColorStop(0.3, '#43555c');
      pavementGrad.addColorStop(0.7, '#2b373d');
      pavementGrad.addColorStop(1, '#1b2327'); // rich wet dark slate

      ctx.beginPath();
      ctx.moveTo(pathTopLeftX, pathTopY);
      ctx.lineTo(pathTopRightX, pathTopY);
      ctx.lineTo(pathBottomRightX, pathBottomY);
      ctx.lineTo(pathBottomLeftX, pathBottomY);
      ctx.closePath();
      ctx.fillStyle = pavementGrad;
      ctx.fill();

      // Clip to sidewalk path for rendering paving grid & reflections
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pathTopLeftX, pathTopY);
      ctx.lineTo(pathTopRightX, pathTopY);
      ctx.lineTo(pathBottomRightX, pathBottomY);
      ctx.lineTo(pathBottomLeftX, pathBottomY);
      ctx.closePath();
      ctx.clip();

      // --- WET REFLECTIONS (Fresnel glow of lamps, autumn trees, and sky) ---
      // Sky teal reflection across center wet groove
      const skyReflGrad = ctx.createLinearGradient(0, pathTopY, 0, pathBottomY);
      skyReflGrad.addColorStop(0, `rgba(165, 205, 215, ${0.45 * wetness})`);
      skyReflGrad.addColorStop(0.5, `rgba(110, 160, 175, ${0.35 * wetness})`);
      skyReflGrad.addColorStop(1, `rgba(60, 105, 120, ${0.25 * wetness})`);

      ctx.fillStyle = skyReflGrad;
      ctx.fillRect(0, pathTopY, W, pathBottomY - pathTopY);

      // Warm Golden Amber Reflection from right Street Lamp & Canopy
      const lampReflX = W * 0.62;
      const lampReflGrad = ctx.createRadialGradient(lampReflX, H * 0.85, 20, lampReflX, H * 0.85, W * 0.45);
      lampReflGrad.addColorStop(0, `rgba(245, 158, 11, ${0.48 * wetness * lampPwr * orangeGlow})`);
      lampReflGrad.addColorStop(0.35, `rgba(217, 119, 6, ${0.28 * wetness * lampPwr * orangeGlow})`);
      lampReflGrad.addColorStop(0.7, `rgba(180, 83, 9, ${0.12 * wetness * orangeGlow})`);
      lampReflGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = lampReflGrad;
      ctx.fillRect(0, pathTopY, W, pathBottomY - pathTopY);

      // Left Lamp reflection
      const leftLampReflX = W * 0.24;
      const leftLampReflGrad = ctx.createRadialGradient(leftLampReflX, H * 0.82, 15, leftLampReflX, H * 0.82, W * 0.28);
      leftLampReflGrad.addColorStop(0, `rgba(251, 191, 36, ${0.38 * wetness * lampPwr * orangeGlow})`);
      leftLampReflGrad.addColorStop(0.5, `rgba(217, 119, 6, ${0.18 * wetness * orangeGlow})`);
      leftLampReflGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = leftLampReflGrad;
      ctx.fillRect(0, pathTopY, W, pathBottomY - pathTopY);

      // Paving Stone Grid: Longitudinal lines converging to vanishing point
      const numLongLines = 14;
      ctx.lineWidth = 1.2;
      for (let i = 0; i <= numLongLines; i++) {
        const u = i / numLongLines;
        const topX = pathTopLeftX + u * (pathTopRightX - pathTopLeftX);
        const botX = pathBottomLeftX + u * (pathBottomRightX - pathBottomLeftX);

        ctx.strokeStyle = `rgba(18, 28, 32, 0.4)`;
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(botX, pathBottomY);
        ctx.stroke();

        // Wet specular shine along tile edges
        ctx.strokeStyle = `rgba(180, 220, 235, ${0.15 * wetness})`;
        ctx.beginPath();
        ctx.moveTo(topX + 0.8, topY);
        ctx.lineTo(botX + 0.8, pathBottomY);
        ctx.stroke();
      }

      // Transverse lines (perspective spaced paving stones)
      const numTransLines = 55;
      for (let j = 1; j <= numTransLines; j++) {
        // Perspective easing: spacing increases toward foreground
        const v = Math.pow(j / numTransLines, 2.7);
        const y = pathTopY + v * (pathBottomY - pathTopY);

        const leftX = pathTopLeftX + v * (pathBottomLeftX - pathTopLeftX);
        const rightX = pathTopRightX + v * (pathBottomRightX - pathTopRightX);

        // Groove shadow
        ctx.strokeStyle = `rgba(15, 24, 28, ${0.35 + v * 0.35})`;
        ctx.lineWidth = 1 + v * 2.2;
        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(rightX, y);
        ctx.stroke();

        // Wet reflection highlight on upper rim of stone tile
        ctx.strokeStyle = `rgba(200, 235, 245, ${(0.1 + v * 0.25) * wetness})`;
        ctx.lineWidth = 0.8 + v * 1.2;
        ctx.beginPath();
        ctx.moveTo(leftX, y - 1);
        ctx.lineTo(rightX, y - 1);
        ctx.stroke();
      }

      // Wet Fallen Leaves on Pavement (glistening in puddles)
      const pavementLeaves = [
        { u: 0.45, v: 0.85, rot: 0.4, col: '#f59e0b', s: 14 },
        { u: 0.62, v: 0.78, rot: 1.2, col: '#ea580c', s: 12 },
        { u: 0.35, v: 0.92, rot: 2.1, col: '#d97706', s: 16 },
        { u: 0.52, v: 0.65, rot: -0.8, col: '#fbbf24', s: 10 },
        { u: 0.72, v: 0.88, rot: 0.9, col: '#b45309', s: 15 },
        { u: 0.28, v: 0.74, rot: -1.4, col: '#ca8a04', s: 11 },
        { u: 0.58, v: 0.52, rot: 0.3, col: '#ea580c', s: 8 },
        { u: 0.42, v: 0.44, rot: 2.5, col: '#f59e0b', s: 7 },
        { u: 0.65, v: 0.38, rot: -0.5, col: '#d97706', s: 6 },
        { u: 0.38, v: 0.88, rot: 1.7, col: '#84cc16', s: 12 }, // fresh fallen lime leaf
        { u: 0.78, v: 0.95, rot: 0.2, col: '#ef4444', s: 15 }, // red leaf
      ];

      pavementLeaves.forEach((pl) => {
        const lx = pathBottomLeftX + pl.u * (pathBottomRightX - pathBottomLeftX);
        const ly = pathTopY + pl.v * (pathBottomY - pathTopY);

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(pl.rot);

        // Water film shadow around wet leaf
        ctx.fillStyle = 'rgba(10, 18, 22, 0.4)';
        ctx.beginPath();
        ctx.ellipse(1.5, 2, pl.s, pl.s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();

        // Leaf blade
        ctx.fillStyle = pl.col;
        ctx.beginPath();
        ctx.ellipse(0, 0, pl.s, pl.s * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wet glossy sheen on leaf surface
        ctx.fillStyle = `rgba(255, 255, 255, ${0.45 * wetness})`;
        ctx.beginPath();
        ctx.ellipse(-pl.s * 0.25, -pl.s * 0.15, pl.s * 0.4, pl.s * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Dynamic Water Ripple Rings on Puddles
      if (settings.showRipples) {
        ripplesRef.current.forEach((r) => {
          ctx.save();
          ctx.beginPath();
          // Elliptical perspective ripple
          ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.38, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(185, 225, 240, ${r.opacity * wetness * 0.85})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();

          // Secondary subtle inner ring
          if (r.radius > 8) {
            ctx.beginPath();
            ctx.ellipse(r.x, r.y, r.radius * 0.65, r.radius * 0.65 * 0.38, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(220, 245, 255, ${r.opacity * wetness * 0.45})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      ctx.restore(); // end sidewalk clip
      ctx.restore();

      // 5. LEFT RAISED PLANTER & MANICURED HEDGE (as in reference image)
      ctx.save();
      const curbTopX = pathTopLeftX;
      const curbTopY = pathTopY;
      const curbBotX = pathBottomLeftX;
      const curbBotY = pathBottomY;
      const curbWidth = W * 0.12;

      // Granite curb edge face
      ctx.fillStyle = '#2d3e44';
      ctx.beginPath();
      ctx.moveTo(curbTopX, curbTopY);
      ctx.lineTo(curbTopX - 18, curbTopY);
      ctx.lineTo(curbBotX - curbWidth, curbBotY);
      ctx.lineTo(curbBotX, curbBotY);
      ctx.closePath();
      ctx.fill();

      // Granite curb polished top surface (wet reflection)
      const graniteTopGrad = ctx.createLinearGradient(0, curbTopY, 0, curbBotY);
      graniteTopGrad.addColorStop(0, '#536d75');
      graniteTopGrad.addColorStop(1, '#1e292d');
      ctx.fillStyle = graniteTopGrad;
      ctx.beginPath();
      ctx.moveTo(curbTopX - 18, curbTopY);
      ctx.lineTo(curbTopX - 32, curbTopY);
      ctx.lineTo(curbBotX - curbWidth - 40, curbBotY);
      ctx.lineTo(curbBotX - curbWidth, curbBotY);
      ctx.closePath();
      ctx.fill();

      // Wet highlight rim on curb
      ctx.strokeStyle = `rgba(195, 230, 240, ${0.45 * wetness})`;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(curbTopX, curbTopY);
      ctx.lineTo(curbBotX, curbBotY);
      ctx.stroke();

      // Manicured Green Hedge atop raised curb
      const hedgeGrad = ctx.createLinearGradient(0, H * 0.5, 0, H * 0.9);
      hedgeGrad.addColorStop(0, '#365314'); // olive moss
      hedgeGrad.addColorStop(0.5, '#1e3a1d');
      hedgeGrad.addColorStop(1, '#0f2411'); // deep shadowy base

      // Hedge layered volume
      ctx.fillStyle = hedgeGrad;
      ctx.beginPath();
      ctx.moveTo(curbTopX - 25, curbTopY - 20);
      for (let hx = 0; hx <= 20; hx++) {
        const u = hx / 20;
        const hpx = (curbTopX - 25) + u * ((curbBotX - curbWidth - 30) - (curbTopX - 25));
        const basePy = (curbTopY - 20) + u * (H * 0.88 - (curbTopY - 20));
        const bump = Math.sin(hx * 1.7 + t * 0.5) * (8 + u * 18);
        ctx.lineTo(hpx - 15, basePy - 45 - bump);
      }
      ctx.lineTo(curbBotX - curbWidth - 120, H * 0.95);
      ctx.lineTo(curbTopX - 150, curbTopY);
      ctx.closePath();
      ctx.fill();

      // Golden autumn leaves scattered on green hedge
      for (let hl = 0; hl < 18; hl++) {
        const hlu = hl / 18;
        const hlx = (curbTopX - 45) + hlu * ((curbBotX - curbWidth - 50) - (curbTopX - 45));
        const hly = (curbTopY - 10) + hlu * (H * 0.82 - (curbTopY - 10)) - Math.sin(hl * 2) * 15;
        ctx.fillStyle = hl % 3 === 0 ? '#f59e0b' : hl % 3 === 1 ? '#d97706' : '#ea580c';
        ctx.beginPath();
        ctx.ellipse(hlx, hly, 8 + hlu * 8, 4 + hlu * 4, hl * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 6. RIGHT TREES, TRUNKS & VIBRANT AUTUMN CANOPY (The signature golden framing)
      ctx.save();
      // Main Elm / Birch Tree Trunk (Right foreground)
      const trunkBaseX = W * 0.76;
      const trunkBaseY = H * 0.88;

      // Dark wet textured bark gradient
      const trunkGrad = ctx.createLinearGradient(trunkBaseX - 35, 0, trunkBaseX + 60, 0);
      trunkGrad.addColorStop(0, '#101618');
      trunkGrad.addColorStop(0.35, '#222d30');
      trunkGrad.addColorStop(0.7, '#182124');
      trunkGrad.addColorStop(1, '#0b1012');

      ctx.fillStyle = trunkGrad;
      ctx.beginPath();
      ctx.moveTo(trunkBaseX - 30, trunkBaseY);
      // Trunk curve upward
      ctx.bezierCurveTo(trunkBaseX - 35, H * 0.72, trunkBaseX - 45, H * 0.55, trunkBaseX - 25, H * 0.38);
      // Main split branches
      ctx.lineTo(trunkBaseX + 35, H * 0.35);
      ctx.bezierCurveTo(trunkBaseX + 25, H * 0.55, trunkBaseX + 45, H * 0.72, trunkBaseX + 50, trunkBaseY);
      ctx.closePath();
      ctx.fill();

      // Secondary tree trunk behind
      ctx.fillStyle = '#172225';
      ctx.beginPath();
      ctx.moveTo(trunkBaseX - 65, trunkBaseY - 20);
      ctx.bezierCurveTo(trunkBaseX - 80, H * 0.68, trunkBaseX - 90, H * 0.52, trunkBaseX - 70, H * 0.42);
      ctx.lineTo(trunkBaseX - 52, H * 0.42);
      ctx.bezierCurveTo(trunkBaseX - 68, H * 0.55, trunkBaseX - 58, H * 0.7, trunkBaseX - 45, trunkBaseY - 18);
      ctx.closePath();
      ctx.fill();

      // Organic Branches spreading into canopy
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#1b2528';
      ctx.lineCap = 'round';

      // Branch 1: Arching Left across the path
      ctx.beginPath();
      ctx.moveTo(trunkBaseX - 25, H * 0.42);
      ctx.bezierCurveTo(trunkBaseX - 180, H * 0.32, W * 0.42, H * 0.28, W * 0.28, H * 0.18);
      ctx.stroke();

      // Branch 2: Center Arching
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(trunkBaseX - 30, H * 0.45);
      ctx.bezierCurveTo(trunkBaseX - 120, H * 0.38, W * 0.55, H * 0.32, W * 0.48, H * 0.12);
      ctx.stroke();

      // Branch 3: Right top canopy
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(trunkBaseX + 20, H * 0.4);
      ctx.bezierCurveTo(trunkBaseX + 80, H * 0.28, W * 0.88, H * 0.22, W * 0.98, H * 0.12);
      ctx.stroke();

      // Sub-twigs
      ctx.lineWidth = 3.5;
      const twigs = [
        { sx: W * 0.45, sy: H * 0.26, ex: W * 0.38, ey: H * 0.2 },
        { sx: W * 0.52, sy: H * 0.22, ex: W * 0.58, ey: H * 0.14 },
        { sx: W * 0.34, sy: H * 0.21, ex: W * 0.25, ey: H * 0.24 },
        { sx: W * 0.65, sy: H * 0.3, ex: W * 0.62, ey: H * 0.22 },
        { sx: W * 0.82, sy: H * 0.24, ex: W * 0.85, ey: H * 0.16 },
      ];
      twigs.forEach((tw) => {
        ctx.beginPath();
        ctx.moveTo(tw.sx, tw.sy);
        ctx.lineTo(tw.ex, tw.ey);
        ctx.stroke();
      });

      // --- AUTUMN FOLIAGE CANOPY CLUSTERS ---
      // Thousands of vibrant leaves rendered in organic layered clusters
      const canopyClusters = [
        // Main giant golden canopy framing right and top-center
        { cx: W * 0.72, cy: H * 0.28, r: W * 0.38, count: 85, baseHue: 'gold' },
        { cx: W * 0.52, cy: H * 0.22, r: W * 0.32, count: 65, baseHue: 'lime-gold' },
        { cx: W * 0.35, cy: H * 0.18, r: W * 0.26, count: 50, baseHue: 'lemon' },
        { cx: W * 0.88, cy: H * 0.35, r: W * 0.28, count: 45, baseHue: 'amber' },
        { cx: W * 0.22, cy: H * 0.25, r: W * 0.2, count: 35, baseHue: 'lime' },
        { cx: W * 0.62, cy: H * 0.42, r: W * 0.25, count: 40, baseHue: 'deep-gold' },
      ];

      const getFoliageColor = (type: string, seed: number) => {
        const rand = (Math.sin(seed * 99.7) + 1) * 0.5;
        if (type === 'lime' || (type === 'lime-gold' && rand < 0.35)) {
          return rand > 0.5 ? '#84cc16' : '#a3e635'; // vivid lime accents
        }
        if (type === 'amber' || rand > 0.8) {
          return rand > 0.9 ? '#ea580c' : '#d97706'; // rich orange amber
        }
        if (type === 'lemon' || rand < 0.25) {
          return '#facc15'; // bright lemon
        }
        return '#f59e0b'; // signature autumn gold
      };

      canopyClusters.forEach((cl, clIdx) => {
        for (let i = 0; i < cl.count; i++) {
          const angle = Math.sin(i * 1.3 + clIdx) * Math.PI * 2;
          const dist = Math.sqrt((i + 0.5) / cl.count) * cl.r;
          // Leaf swaying slightly in breeze
          const windSway = Math.sin(t * 1.5 + i * 0.3) * (settings.windSpeed * 0.25);
          const lx = cl.cx + Math.cos(angle) * dist + windSway;
          const ly = cl.cy + Math.sin(angle) * dist * 0.72;

          const leafRadius = 14 + ((i * 7) % 18);
          const col = getFoliageColor(cl.baseHue, clIdx * 100 + i);

          // Leaf cluster droplet / circle
          ctx.save();
          ctx.translate(lx, ly);
          ctx.rotate((i * 0.4) + windSway * 0.05);

          // Subtle shadow on underside
          ctx.fillStyle = 'rgba(20, 30, 25, 0.15)';
          ctx.beginPath();
          ctx.ellipse(2, 3, leafRadius, leafRadius * 0.65, 0, 0, Math.PI * 2);
          ctx.fill();

          // Leaf body
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.ellipse(0, 0, leafRadius, leafRadius * 0.65, 0, 0, Math.PI * 2);
          ctx.fill();

          // Rain gloss highlight on leaf surface
          if (i % 3 === 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.35 * wetness})`;
            ctx.beginPath();
            ctx.ellipse(-leafRadius * 0.25, -leafRadius * 0.15, leafRadius * 0.4, leafRadius * 0.2, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      });

      // Fiery Orange-Red Autumn Bush (Foreground Right, as in reference photo)
      const bushX = W * 0.92;
      const bushY = H * 0.85;
      const bushLeaves = [
        '#ef4444', '#dc2626', '#f97316', '#ea580c', '#fb923c', '#b91c1c'
      ];
      for (let bi = 0; bi < 42; bi++) {
        const bAngle = (bi / 42) * Math.PI * 2;
        const bDist = Math.pow(Math.sin(bi * 1.7) * 0.5 + 0.5, 0.7) * (W * 0.16);
        const bx = bushX + Math.cos(bAngle) * bDist;
        const by = bushY + Math.sin(bAngle) * bDist * 0.75;
        ctx.fillStyle = bushLeaves[bi % bushLeaves.length];
        ctx.beginPath();
        ctx.ellipse(bx, by, 16, 10, bi * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 7. BLACK MINIMALIST STREET LAMPS (Signature element of the scene)
      // We render a series of black lamps receding along the path:
      // 1. Right foreground iconic lamp
      // 2. Left midground lamp
      // 3. Receding distant lamps
      const renderStreetLamp = (
        baseX: number,
        baseY: number,
        height: number,
        lampScale: number,
        hasLanternGlow: boolean
      ) => {
        ctx.save();
        const postW = 10 * lampScale;
        const headH = 50 * lampScale;
        const headW = 44 * lampScale;
        const capW = 58 * lampScale;
        const lampTopY = baseY - height;

        // Warm Volumetric Light Bloom
        if (hasLanternGlow) {
          const glowGrad = ctx.createRadialGradient(
            baseX, lampTopY + headH * 0.4,
            headW * 0.3,
            baseX, lampTopY + headH * 0.4,
            headW * 6.5
          );
          glowGrad.addColorStop(0, `rgba(255, 240, 180, ${0.85 * lampPwr * orangeGlow})`);
          glowGrad.addColorStop(0.2, `rgba(245, 158, 11, ${0.45 * lampPwr * orangeGlow})`);
          glowGrad.addColorStop(0.55, `rgba(217, 119, 6, ${0.15 * lampPwr * orangeGlow})`);
          glowGrad.addColorStop(1, 'transparent');

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(baseX, lampTopY + headH * 0.4, headW * 6.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Cast shadow of post on wet ground
        ctx.fillStyle = 'rgba(12, 20, 24, 0.5)';
        ctx.beginPath();
        ctx.ellipse(baseX, baseY, postW * 2.2, postW * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tall Black Cylindrical Post
        const postGrad = ctx.createLinearGradient(baseX - postW / 2, 0, baseX + postW / 2, 0);
        postGrad.addColorStop(0, '#1c1f22');
        postGrad.addColorStop(0.3, '#353a3e'); // wet highlight on metal
        postGrad.addColorStop(0.7, '#1f2326');
        postGrad.addColorStop(1, '#0e1113');

        ctx.fillStyle = postGrad;
        ctx.fillRect(baseX - postW / 2, lampTopY + headH, postW, height - headH);

        // Flanged circular mounting collar at base
        ctx.fillStyle = '#181b1e';
        ctx.beginPath();
        ctx.ellipse(baseX, baseY - 2, postW * 1.5, postW * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // LANTERN HEAD
        // Top flared rain cap (iconic conical disc)
        ctx.fillStyle = '#1e2225';
        ctx.beginPath();
        ctx.moveTo(baseX - capW / 2, lampTopY + 10 * lampScale);
        ctx.lineTo(baseX, lampTopY);
        ctx.lineTo(baseX + capW / 2, lampTopY + 10 * lampScale);
        ctx.lineTo(baseX + capW / 2 - 4, lampTopY + 15 * lampScale);
        ctx.lineTo(baseX - capW / 2 + 4, lampTopY + 15 * lampScale);
        ctx.closePath();
        ctx.fill();

        // Wet rim shine on cap
        ctx.strokeStyle = `rgba(180, 220, 235, ${0.4 * wetness})`;
        ctx.lineWidth = 1.2 * lampScale;
        ctx.beginPath();
        ctx.moveTo(baseX - capW / 2, lampTopY + 10 * lampScale);
        ctx.lineTo(baseX, lampTopY);
        ctx.lineTo(baseX + capW / 2, lampTopY + 10 * lampScale);
        ctx.stroke();

        // Luminous Frosted Inner Diffuser Cylinder (Glowing warm light)
        const innerDiffuserGrad = ctx.createLinearGradient(
          baseX - headW * 0.35, 0, baseX + headW * 0.35, 0
        );
        innerDiffuserGrad.addColorStop(0, '#fef3c7');
        innerDiffuserGrad.addColorStop(0.5, '#ffffff');
        innerDiffuserGrad.addColorStop(1, '#fde68a');

        ctx.fillStyle = innerDiffuserGrad;
        ctx.fillRect(
          baseX - headW * 0.35,
          lampTopY + 15 * lampScale,
          headW * 0.7,
          headH - 18 * lampScale
        );

        // Horizontal Minimalist Black Slats / Louvers (Japanese / Nordic architectural design)
        const numSlats = 5;
        ctx.fillStyle = '#121517';
        for (let s = 0; s < numSlats; s++) {
          const slatY = lampTopY + (17 + s * 6.5) * lampScale;
          ctx.fillRect(baseX - headW * 0.42, slatY, headW * 0.84, 2.5 * lampScale);
        }

        // Lower support collar
        ctx.fillStyle = '#181b1e';
        ctx.fillRect(baseX - headW * 0.4, lampTopY + headH - 4 * lampScale, headW * 0.8, 5 * lampScale);

        ctx.restore();
      };

      // 1. Right Prominent Street Lamp (exact match to photo foreground)
      renderStreetLamp(W * 0.885, H * 0.74, 380, 1.15, true);

      // 2. Left Prominent Street Lamp (on the garden curb border)
      renderStreetLamp(W * 0.175, H * 0.65, 290, 0.88, true);

      // 3. Receding Street Lamps along the sidewalk into the distance
      renderStreetLamp(W * 0.28, H * 0.68, 175, 0.52, true);
      renderStreetLamp(W * 0.365, H * 0.68, 115, 0.35, true);
      renderStreetLamp(W * 0.395, H * 0.68, 85, 0.26, false);
      renderStreetLamp(W * 0.645, H * 0.76, 210, 0.62, true);

      // 8. FALLING RAINDROPS PARTICLES (Real-time dynamic streaks)
      if (settings.showRaindrops && settings.rainIntensity > 0) {
        ctx.save();
        const windTilt = (settings.windSpeed - 15) * 0.28;

        raindropsRef.current.forEach((drop) => {
          // Update drop position
          drop.y += drop.speed;
          drop.x += windTilt;

          // Splash at ground
          if (drop.y > H * 0.65) {
            // Check if drop is over the wet pavement
            if (Math.random() < 0.08 && ripplesRef.current.length < 45) {
              ripplesRef.current.push({
                x: drop.x,
                y: drop.y,
                radius: 1.5,
                maxRadius: 10 + Math.random() * 16,
                opacity: 0.85,
                speed: 0.55 + Math.random() * 0.4,
              });
            }
          }

          // Reset drop at top
          if (drop.y > H + 50) {
            drop.y = -50;
            drop.x = Math.random() * (W + 400) - 200;
          }

          // Draw rain streak
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - windTilt * 0.6, drop.y - drop.length);
          ctx.strokeStyle = `rgba(215, 238, 248, ${drop.opacity * 0.65})`;
          ctx.lineWidth = drop.thickness;
          ctx.lineCap = 'round';
          ctx.stroke();
        });

        // Update ripple rings
        for (let ri = ripplesRef.current.length - 1; ri >= 0; ri--) {
          const r = ripplesRef.current[ri];
          r.radius += r.speed;
          r.opacity -= 0.022;
          if (r.opacity <= 0 || r.radius >= r.maxRadius) {
            ripplesRef.current.splice(ri, 1);
          }
        }

        ctx.restore();
      }

      // 9. DRIFTING AUTUMN LEAVES IN RAIN
      if (settings.fallingLeavesSpeed > 0) {
        ctx.save();
        leavesRef.current.forEach((lf) => {
          lf.oscillation += 0.04;
          lf.angle += lf.angularSpeed;
          lf.y += lf.speedY * (settings.fallingLeavesSpeed / 50);
          lf.x += (lf.speedX + Math.sin(lf.oscillation) * 1.5) * (settings.windSpeed / 25);

          if (lf.y > H + 20) {
            lf.y = -20;
            lf.x = Math.random() * W;
          }

          ctx.save();
          ctx.translate(lf.x, lf.y);
          ctx.rotate(lf.angle);
          ctx.fillStyle = lf.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, lf.size, lf.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        ctx.restore();
      }

      // 10. ATMOSPHERIC FOG / MIST DRIFT OVERLAY
      if (settings.showMistLayer && mistAmt > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const mistGrad = ctx.createLinearGradient(0, H * 0.35, 0, H * 0.85);
        mistGrad.addColorStop(0, `rgba(140, 185, 200, ${0.12 * mistAmt})`);
        mistGrad.addColorStop(0.5, `rgba(180, 215, 225, ${0.18 * mistAmt})`);
        mistGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, H * 0.3, W, H * 0.6);
        ctx.restore();
      }

      // 11. VIGNETTE & CINEMATIC COLOR POST-PROCESS
      ctx.save();
      const vignetteGrad = ctx.createRadialGradient(
        W / 2, H / 2, Math.min(W, H) * 0.45,
        W / 2, H / 2, Math.max(W, H) * 0.78
      );
      vignetteGrad.addColorStop(0, 'transparent');
      vignetteGrad.addColorStop(0.7, `rgba(10, 22, 28, ${0.28 * tealIntensity})`);
      vignetteGrad.addColorStop(1, `rgba(5, 12, 16, ${0.62 * tealIntensity})`);
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      ctx.restore(); // end canvas restore
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [settings, aspectRatio, zoom, panOffset, getLogicalDimensions]);

  // Handle Interactive Clicks on Canvas (Spawns ripples & triggers hotspot check)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const normX = clickX / rect.width;
    const normY = clickY / rect.height;

    const { width: W, height: H } = getLogicalDimensions();
    const logicalX = normX * W;
    const logicalY = normY * H;

    // Spawn water ripple interactive splash
    ripplesRef.current.push({
      x: logicalX,
      y: logicalY,
      radius: 3,
      maxRadius: 38,
      opacity: 0.95,
      speed: 1.2,
    });
    ripplesRef.current.push({
      x: logicalX,
      y: logicalY,
      radius: 1,
      maxRadius: 24,
      opacity: 0.85,
      speed: 0.8,
    });

    if (onCanvasClick) {
      onCanvasClick(normX, normY);
    }
  };

  // Interactive mouse ripples when moving across wet pavement
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    setCursorPos({ x: mx * 100, y: my * 100 });

    // If moving on lower half (the wet pavement)
    if (my > 0.65 && Math.random() < 0.25) {
      const { width: W, height: H } = getLogicalDimensions();
      ripplesRef.current.push({
        x: mx * W,
        y: my * H,
        radius: 2,
        maxRadius: 18,
        opacity: 0.7,
        speed: 0.7,
      });
    }
  };

  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '16:9':
        return 'aspect-video max-h-[82vh]';
      case '9:16':
        return 'aspect-[9/16] max-h-[86vh]';
      case '1:1':
        return 'aspect-square max-h-[82vh]';
      case '3:4':
      default:
        return 'aspect-[3/4] max-h-[86vh]';
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full p-2 select-none overflow-hidden"
    >
      <div
        className={`relative ${getAspectRatioClasses()} w-full max-w-full rounded-2xl overflow-hidden shadow-2xl shadow-teal-950/40 border border-teal-500/20 bg-slate-950 transition-all duration-300 group`}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setCursorPos(null)}
          className={`w-full h-full object-contain cursor-pointer ${
            isInspecting ? 'cursor-crosshair' : 'cursor-default'
          }`}
          style={{ imageRendering: 'auto' }}
        />

        {/* Dynamic Water Reflection Sheen Indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none z-10">
          <div className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-teal-500/30 text-teal-300 text-xs font-mono flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 -ml-2.5" />
            <span>8K RENDER • 60 FPS</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-mono shadow-lg">
            TEAL & ORANGE HARMONY
          </div>
        </div>

        {/* Interactive Click Water Hint */}
        <div className="absolute bottom-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 text-xs flex items-center gap-2 shadow-xl">
            <svg className="w-4 h-4 text-teal-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>Click pavement to create water ripples</span>
          </div>
        </div>
      </div>
    </div>
  );
};
