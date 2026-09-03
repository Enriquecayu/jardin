import { useState, memo, useRef } from 'react';

const tiposFlores = [
  // Colores originales
  { id: 'amarilla', colorPetalo: '#FEF3C7', strokePetalo: '#FDE68A', centro1: '#B45309', centro2: '#F59E0B', bgBtn: '#F59E0B' },
  { id: 'rosa', colorPetalo: '#FCE7F3', strokePetalo: '#FBCFE8', centro1: '#9D174D', centro2: '#EC4899', bgBtn: '#EC4899' },
  { id: 'celeste', colorPetalo: '#E0F2FE', strokePetalo: '#BAE6FD', centro1: '#0369A1', centro2: '#0EA5E9', bgBtn: '#0EA5E9' },
  { id: 'lavanda', colorPetalo: '#EDE9FE', strokePetalo: '#DDD6FE', centro1: '#5B21B6', centro2: '#8B5CF6', bgBtn: '#8B5CF6' },

  // 4 Nuevas variantes
  { id: 'naranja', colorPetalo: '#FFEDD5', strokePetalo: '#FDBA74', centro1: '#C2410C', centro2: '#F97316', bgBtn: '#F97316' },
  { id: 'roja', colorPetalo: '#FECACA', strokePetalo: '#FCA5A5', centro1: '#991B1B', centro2: '#EF4444', bgBtn: '#EF4444' },
  { id: 'verde', colorPetalo: '#DCFCE7', strokePetalo: '#BBF7D0', centro1: '#166534', centro2: '#22C55E', bgBtn: '#22C55E' },
  { id: 'violeta', colorPetalo: '#F3E8FF', strokePetalo: '#E9D5FF', centro1: '#6B21A8', centro2: '#A855F7', bgBtn: '#A855F7' }
];

const Flower = memo(({ x, y, tipo, size, rotation }) => (
  <div className="flower" style={{ left: `${x - size / 2}px`, top: `${y - size / 2}px`, width: `${size}px`, height: `${size}px`, transform: `rotate(${rotation}deg)` }}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M50 15 C 60 10, 70 20, 65 30 C 75 25, 85 35, 80 45 C 90 45, 90 55, 80 55 C 85 65, 75 75, 65 70 C 70 80, 60 90, 50 85 C 40 90, 30 80, 35 70 C 25 75, 15 65, 20 55 C 10 55, 10 45, 20 45 C 15 35, 25 25, 35 30 C 30 20, 40 10, 50 15 Z" fill={tipo.colorPetalo} stroke={tipo.strokePetalo} strokeWidth="1" />
      <circle cx="50" cy="50" r="16" fill={tipo.centro1} />
      <circle cx="50" cy="50" r="12" fill={tipo.centro2} />
    </svg>
  </div>
));

export default function App() {
  const [flores, setFlores] = useState([]);
  const [colorSeleccionado, setColorSeleccionado] = useState(tiposFlores[0]);
  const [esBorrador, setEsBorrador] = useState(false);
  const isDrawing = useRef(false);

  const interactuar = (x, y) => {
    if (esBorrador) {
      // Borrar flores cercanas (rango de 40px)
      setFlores(prev => prev.filter(f => Math.hypot(f.x - x, f.y - y) > 40));
    } else {
      // Plantar flor
      const nuevaFlor = {
        id: Date.now() + Math.random(), x, y,
        tipo: colorSeleccionado,
        size: Math.random() * 30 + 30,
        rotation: Math.random() * 360
      };
      setFlores(prev => [...prev, nuevaFlor]);
    }
  };

  const handlePointerDown = (e) => {
    isDrawing.current = true;
    interactuar(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current) return;
    interactuar(e.clientX, e.clientY);
  };

  return (
    <div className="container" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={() => isDrawing.current = false} onPointerLeave={() => isDrawing.current = false}>

      {/* Frase más grande y centrada en la pantalla */}
      <div className="frase-jardin" onClick={(e) => e.stopPropagation()}>
        <p>EL JARDIN DE AYLEN</p>
        <p>Este es tu propio jardín secreto; tómate el tiempo de ilustrarlo y llenarlo de vida a tu manera.</p>
      </div>

      <div className="toolbar" onClick={(e) => e.stopPropagation()}>
        {tiposFlores.map((t) => (
          <button key={t.id} className={`color-btn ${!esBorrador && colorSeleccionado.id === t.id ? 'active' : ''}`} style={{ backgroundColor: t.bgBtn }} onClick={() => { setEsBorrador(false); setColorSeleccionado(t); }} />
        ))}
        <button className={`color-btn ${esBorrador ? 'active' : ''}`} style={{ backgroundColor: '#fff', color: '#000' }} onClick={() => setEsBorrador(true)}>
          🧽
        </button>
      </div>
      {flores.map((f) => <Flower key={f.id} {...f} />)}
    </div>
  );
}