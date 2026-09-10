/**
 * cyber-canvas.js - Dynamic 3D Cyberpunk Globe & Background Canvas
 * Multi-layer procedural rendering:
 * 1. 3D Rotating Cyberpunk Hologram Globe (orthographic / perspective wireframe parallels & meridians)
 * 2. 9 Station Orbital Nodes with elemental color coding
 * 3. Great-Circle Laser Constellation Arcs with traveling energy pulses
 * 4. Ambient digital rain, floating hex matrix dust, and atmospheric glow
 */

(function () {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.id = 'cyber-bg-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Mouse parallax tracking
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - width * 0.5) * 0.04;
    targetMouseY = (e.clientY - height * 0.5) * 0.04;
  });

  // State
  let isOverview = false;
  let activeStationId = 'tekromancy-portal';
  let globeRadius = Math.min(width, height) * 0.38;
  let targetGlobeRadius = globeRadius;
  let globeRotY = 0;
  let globeRotX = 0.22; // slight downward viewing tilt

  // Station definitions in spherical coordinates (degrees)
  const stations = [
    { id: 'manifesto', num: '01', name: 'MANIFESTO', lat: 0, lon: 0, color: '#00f0ff', glow: 'rgba(0,240,255,0.8)' },
    { id: 'station-lightning', num: '02', name: 'LIGHTNING', lat: 28, lon: 45, color: '#38bdf8', glow: 'rgba(56,189,248,0.85)' },
    { id: 'station-fire', num: '03', name: 'FIRE', lat: -22, lon: 90, color: '#ff6600', glow: 'rgba(255,102,0,0.85)' },
    { id: 'station-smoke', num: '04', name: 'SMOKE', lat: 32, lon: 135, color: '#cbd5e1', glow: 'rgba(203,213,225,0.85)' },
    { id: 'station-plasma', num: '05', name: 'PLASMA', lat: -18, lon: 180, color: '#ff00b4', glow: 'rgba(255,0,180,0.85)' },
    { id: 'station-water', num: '06', name: 'WATER', lat: 28, lon: 225, color: '#0ea5e9', glow: 'rgba(14,165,233,0.85)' },
    { id: 'station-ice', num: '07', name: 'ICE', lat: -24, lon: 270, color: '#93c5fd', glow: 'rgba(147,197,253,0.85)' },
    { id: 'station-unified', num: '08', name: 'UNIFIED', lat: 30, lon: 315, color: '#fbbf24', glow: 'rgba(251,191,36,0.85)' },
    { id: 'station-guide', num: '09', name: 'GUIDE', lat: -48, lon: 360, color: '#22ee44', glow: 'rgba(34,238,68,0.85)' }
  ];

  // Laser Constellation Traveling Pulses
  const pulseCount = 18;
  const pulses = Array.from({ length: pulseCount }, (_, i) => ({
    segIdx: i % (stations.length),
    progress: (i / pulseCount),
    speed: 0.003 + Math.random() * 0.003,
    color: stations[i % stations.length].color
  }));

  // Background Matrix Particles
  const particleCount = 70;
  const particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -0.2 - Math.random() * 0.5,
    size: 1 + Math.random() * 2,
    alpha: 0.1 + Math.random() * 0.4,
    color: Math.random() > 0.4 ? '#00f0ff' : '#ff00b4'
  }));

  // Helper 3D rotation & projection
  function project3D(latDeg, lonDeg, radius, rotX, rotY, cx, cy) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180 + rotY;

    // Unit sphere coords:
    // x = cos(lat) * sin(lon)
    // y = -sin(lat)
    // z = cos(lat) * cos(lon)
    let x = Math.cos(lat) * Math.sin(lon);
    let y = -Math.sin(lat);
    let z = Math.cos(lat) * Math.cos(lon);

    // Pitch rotation around X axis (rotX)
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;

    // Scale by radius
    return {
      x: cx + x * radius,
      y: cy + y1 * radius,
      z: z1, // > 0 is front, < 0 is back
      visible: z1 > -0.05
    };
  }

  // Draw a parallel (latitude ring)
  function drawLatitudeParallel(latDeg, radius, rotX, rotY, cx, cy, strokeStyle, lineWidth = 1) {
    ctx.beginPath();
    let first = true;
    const step = 6;
    for (let lon = 0; lon <= 360; lon += step) {
      const p = project3D(latDeg, lon, radius, rotX, rotY, cx, cy);
      if (first) {
        ctx.moveTo(p.x, p.y);
        first = false;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  // Draw a meridian (longitude ring)
  function drawLongitudeMeridian(lonDeg, radius, rotX, rotY, cx, cy, strokeStyle, lineWidth = 1) {
    ctx.beginPath();
    let first = true;
    const step = 5;
    for (let lat = -90; lat <= 90; lat += step) {
      const p = project3D(lat, lonDeg, radius, rotX, rotY, cx, cy);
      if (first) {
        ctx.moveTo(p.x, p.y);
        first = false;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  // Great-circle interpolation between two points on unit sphere
  function slerp(p1, p2, t) {
    // Convert to 3D cartesian
    const lat1 = (p1.lat * Math.PI) / 180, lon1 = (p1.lon * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180, lon2 = (p2.lon * Math.PI) / 180;

    const v1 = [Math.cos(lat1) * Math.sin(lon1), -Math.sin(lat1), Math.cos(lat1) * Math.cos(lon1)];
    const v2 = [Math.cos(lat2) * Math.sin(lon2), -Math.sin(lat2), Math.cos(lat2) * Math.cos(lon2)];

    let dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    dot = Math.max(-1, Math.min(1, dot));
    const omega = Math.acos(dot);

    if (Math.abs(omega) < 0.001) {
      return { lat: p1.lat, lon: p1.lon };
    }

    const sinOmega = Math.sin(omega);
    const s1 = Math.sin((1 - t) * omega) / sinOmega;
    const s2 = Math.sin(t * omega) / sinOmega;

    const vx = s1 * v1[0] + s2 * v2[0];
    const vy = s1 * v1[1] + s2 * v2[1];
    const vz = s1 * v1[2] + s2 * v2[2];

    const lat = -Math.asin(Math.max(-1, Math.min(1, vy))) * (180 / Math.PI);
    const lon = Math.atan2(vx, vz) * (180 / Math.PI);
    return { lat, lon };
  }

  let animationFrameId = null;

  function render() {
    // Parallax easing
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    // Radius transitions
    targetGlobeRadius = isOverview 
      ? Math.min(width, height) * 0.44 
      : Math.min(width, height) * 0.32;
    globeRadius += (targetGlobeRadius - globeRadius) * 0.05;

    // Continuous celestial axial rotation
    globeRotY += isOverview ? 0.005 : 0.003;

    ctx.clearRect(0, 0, width, height);

    const cx = width * 0.5 + mouseX;
    const cy = height * 0.5 + mouseY;

    // 1. Ambient Background Particles
    ctx.save();
    for (const pt of particles) {
      pt.x += pt.vx;
      pt.y += pt.vy;
      if (pt.y < -10) pt.y = height + 10;
      if (pt.x < -10) pt.x = width + 10;
      if (pt.x > width + 10) pt.x = -10;

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = pt.alpha * (isOverview ? 0.7 : 0.35);
      ctx.fill();
    }
    ctx.restore();

    // 2. Cyberpunk Globe Holographic Atmosphere Halo
    ctx.save();
    const haloRadius = globeRadius * 1.18;
    const haloGrad = ctx.createRadialGradient(cx, cy, globeRadius * 0.7, cx, cy, haloRadius);
    haloGrad.addColorStop(0, 'rgba(0, 240, 255, 0.02)');
    haloGrad.addColorStop(0.65, isOverview ? 'rgba(0, 240, 255, 0.08)' : 'rgba(0, 240, 255, 0.04)');
    haloGrad.addColorStop(0.88, isOverview ? 'rgba(255, 0, 180, 0.12)' : 'rgba(255, 0, 180, 0.05)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    // Outer Globe Rim Glow
    ctx.beginPath();
    ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
    ctx.strokeStyle = isOverview ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.22)';
    ctx.lineWidth = isOverview ? 2 : 1.2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = isOverview ? 20 : 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    // 3. Render 3D Wireframe Latitude Parallels
    const latLines = [-60, -45, -30, -15, 0, 15, 30, 45, 60];
    for (const lat of latLines) {
      const isEq = lat === 0;
      const stroke = isEq 
        ? (isOverview ? 'rgba(0, 240, 255, 0.55)' : 'rgba(0, 240, 255, 0.28)')
        : (isOverview ? 'rgba(0, 240, 255, 0.2)' : 'rgba(0, 240, 255, 0.1)');
      const w = isEq ? (isOverview ? 2 : 1.5) : 0.8;
      drawLatitudeParallel(lat, globeRadius, globeRotX, globeRotY, cx, cy, stroke, w);
    }

    // 4. Render 3D Wireframe Longitude Meridians
    for (let lon = 0; lon < 360; lon += 30) {
      const isPrime = lon === 0 || lon === 180;
      const stroke = isPrime 
        ? (isOverview ? 'rgba(255, 0, 180, 0.45)' : 'rgba(255, 0, 180, 0.2)')
        : (isOverview ? 'rgba(0, 240, 255, 0.16)' : 'rgba(0, 240, 255, 0.08)');
      const w = isPrime ? (isOverview ? 1.6 : 1.1) : 0.7;
      drawLongitudeMeridian(lon, globeRadius, globeRotX, globeRotY, cx, cy, stroke, w);
    }

    // 5. Great-Circle Laser Constellation Arcs between Stations
    ctx.save();
    for (let i = 0; i < stations.length; i++) {
      const s1 = stations[i];
      const s2 = stations[(i + 1) % stations.length];

      ctx.beginPath();
      const steps = 24;
      let first = true;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const pt = slerp(s1, s2, t);
        const p = project3D(pt.lat, pt.lon, globeRadius, globeRotX, globeRotY, cx, cy);

        // Alpha fade if behind the globe
        if (first) {
          ctx.moveTo(p.x, p.y);
          first = false;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }

      ctx.strokeStyle = isOverview ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.22)';
      ctx.lineWidth = isOverview ? 1.8 : 1.0;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = isOverview ? 10 : 4;
      ctx.stroke();
    }
    ctx.restore();

    // 6. Laser Data Energy Pulses Traveling Along Constellation Arcs
    ctx.save();
    for (const pulse of pulses) {
      pulse.progress += pulse.speed;
      if (pulse.progress >= 1) {
        pulse.progress = 0;
        pulse.segIdx = (pulse.segIdx + 1) % stations.length;
      }

      const s1 = stations[pulse.segIdx];
      const s2 = stations[(pulse.segIdx + 1) % stations.length];
      const pt = slerp(s1, s2, pulse.progress);
      const p = project3D(pt.lat, pt.lon, globeRadius, globeRotX, globeRotY, cx, cy);

      if (p.z > -0.2) {
        const alpha = Math.max(0.2, (p.z + 0.2) * 1.2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, isOverview ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
    }
    ctx.restore();

    // 7. Render 3D Station Nodes & Holographic Beacons
    ctx.save();
    for (const st of stations) {
      const p = project3D(st.lat, st.lon, globeRadius, globeRotX, globeRotY, cx, cy);
      const isActive = st.id === activeStationId;

      // Depth fade: fully opaque on front hemisphere, faded on back hemisphere
      const depthAlpha = p.z > 0 ? 1 : Math.max(0.18, 1 + p.z * 1.5);
      const nodeRadius = isActive ? (isOverview ? 7 : 6) : (isOverview ? 4.5 : 3.5);

      // Back hemisphere nodes drawn muted
      ctx.beginPath();
      ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = st.color;
      ctx.globalAlpha = depthAlpha;
      ctx.shadowColor = st.color;
      ctx.shadowBlur = isActive ? 22 : (isOverview ? 12 : 6);
      ctx.fill();

      // Outer ripple on active node
      if (isActive || isOverview) {
        ctx.beginPath();
        const pulseSize = nodeRadius + (Math.sin(Date.now() * 0.006 + st.lat) + 1) * 3;
        ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
        ctx.strokeStyle = st.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = depthAlpha * 0.7;
        ctx.stroke();
      }

      // Station Label Callouts (always crisp on front hemisphere, or in overview)
      if (p.z > 0.1 || (isOverview && p.z > -0.3)) {
        ctx.font = isOverview 
          ? "600 11px 'JetBrains Mono', monospace" 
          : "500 9.5px 'JetBrains Mono', monospace";
        ctx.fillStyle = st.color;
        ctx.globalAlpha = depthAlpha * (isOverview ? 0.95 : 0.75);
        ctx.shadowBlur = 8;
        const text = `[${st.num}] ${st.name}`;
        ctx.fillText(text, p.x + 10, p.y - 6);
      }
    }
    ctx.restore();

    // 8. Overview Equatorial Degree Ticker Ring
    if (isOverview) {
      ctx.save();
      const tickerRadius = globeRadius * 1.08;
      ctx.beginPath();
      ctx.arc(cx, cy, tickerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.28)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 12]);
      ctx.stroke();

      // 4 Cardinal Compass Points
      const cardinals = [
        { label: '000° PRIME MERIDIAN', angle: 0 },
        { label: '090° EAST CYBERSPACE', angle: Math.PI * 0.5 },
        { label: '180° ANTIPODE ORBIT', angle: Math.PI },
        { label: '270° WEST CYBERSPACE', angle: Math.PI * 1.5 }
      ];
      ctx.setLineDash([]);
      ctx.font = "600 9px 'Orbitron', sans-serif";
      ctx.fillStyle = 'rgba(0, 240, 255, 0.65)';
      ctx.textAlign = 'center';
      for (const card of cardinals) {
        const ax = cx + Math.cos(card.angle + globeRotY * 0.4) * (tickerRadius + 18);
        const ay = cy + Math.sin(card.angle + globeRotY * 0.4) * (tickerRadius + 18);
        ctx.fillText(card.label, ax, ay);
      }
      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);

  // Global Controller Interface
  window.cyberCanvas = {
    setOverview(enabled) {
      isOverview = !!enabled;
    },
    setActiveStation(id) {
      activeStationId = id;
    },
    destroy() {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  };
})();
