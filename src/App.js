import {useEffect, useRef} from 'react';
import './App.css';

const SolarSystem = () => {
  const canvasRef = useRef(null);
  

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Place les coordonnées du soleil au centre de l'écran
    const sunX = canvas.width / 2;
    const sunY = canvas.height / 2;

    // Facteur d'échelle basé sur le nouveau canvas de 1000x1000 (réduction par rapport à 1300x1300)
    const scaleFactor = 1000 / 1300;

    const planets = [
      {name: 'Mercure', distance: 60 * scaleFactor, radius: 4 * scaleFactor, speed: 0.04, angle: 0, color: 'gray'},
      {name: 'Vénus', distance: 100 * scaleFactor, radius: 6 * scaleFactor, speed: 0.015, angle: 0, color: 'yellow'},
      {name: 'Terre', distance: 150 * scaleFactor, radius: 6 * scaleFactor, speed: 0.01, angle: 0, color: 'blue'},
      {name: 'Mars', distance: 200 * scaleFactor, radius: 5 * scaleFactor, speed: 0.008, angle: 0, color: 'red'},
      {name: 'Jupiter', distance: 300 * scaleFactor, radius: 12 * scaleFactor, speed: 0.002, angle: 0, color: 'orange'},
      {name: 'Saturne', distance: 400 * scaleFactor, radius: 10 * scaleFactor, speed: 0.0015, angle: 0, color: 'brown'},
      {name: 'Uranus', distance: 500 * scaleFactor, radius: 8 * scaleFactor, speed: 0.001, angle: 0, color: 'lightblue'},
      {name: 'Neptune', distance: 600 * scaleFactor, radius: 8 * scaleFactor, speed: 0.0008, angle: 0, color: 'blue'}
    ];

    function drawPlanet(planet) {
      const x = sunX + planet.distance * Math.cos(planet.angle);
      const y = sunY + planet.distance * Math.sin(planet.angle);

      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, 2 * Math.PI);
      ctx.fillStyle = planet.color;
      ctx.fill();
      ctx.closePath();
    }

    function drawSun() {
      ctx.beginPath();
      ctx.arc(sunX, sunY, 20 * scaleFactor, 0, 2 * Math.PI);
      ctx.fillStyle = 'yellow';
      ctx.fill();
      ctx.closePath();
    }

    function updatePositions() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSun();
      planets.forEach(planet => {
        planet.angle += planet.speed;
        drawPlanet(planet);
      });
      requestAnimationFrame(updatePositions);
    }

    updatePositions();
  }, []);
  return <canvas ref={canvasRef} width={1300} height={1300} />;
};

export default function App() {
  return (
    <div className="canvas">
      <h1>The Solar System</h1>
      <SolarSystem />
    </div>
  );
}