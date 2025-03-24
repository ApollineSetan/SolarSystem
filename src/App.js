import { useEffect, useRef, useState } from 'react';
import './App.css';

// Fonction pour récupérer les informations depuis l'API NASA
const fetchPlanetInfo = async (planetName) => {
  const apiKey = 'pEhmjJ9kK6F19N0YutMTYlTZjXf3ff3BwCwlwUdr'; // Ta clé API
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data;
};

const SolarSystem = () => {
  const canvasRef = useRef(null);
  const [activePlanet, setActivePlanet] = useState(null);
  const [planetInfo, setPlanetInfo] = useState('');

  // useEffect pour dessiner le système solaire
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const sunX = canvas.width / 2;
    const sunY = canvas.height / 2;
    const scaleFactor = 1000 / 1300;

    const planets = [
      { name: 'Mercure', distance: 60 * scaleFactor, radius: 4 * scaleFactor, speed: 0.02, angle: 0, color: 'gray' },
      { name: 'Vénus', distance: 100 * scaleFactor, radius: 6 * scaleFactor, speed: 0.0075, angle: 0, color: 'yellow' },
      { name: 'Terre', distance: 150 * scaleFactor, radius: 6 * scaleFactor, speed: 0.005, angle: 0, color: 'blue', hasMoon: true },
      { name: 'Mars', distance: 200 * scaleFactor, radius: 5 * scaleFactor, speed: 0.004, angle: 0, color: 'red' },
      { name: 'Jupiter', distance: 300 * scaleFactor, radius: 12 * scaleFactor, speed: 0.001, angle: 0, color: 'orange' },
      { name: 'Saturne', distance: 400 * scaleFactor, radius: 10 * scaleFactor, speed: 0.00075, angle: 0, color: 'brown' },
      { name: 'Uranus', distance: 500 * scaleFactor, radius: 8 * scaleFactor, speed: 0.0005, angle: 0, color: 'lightblue' },
      { name: 'Neptune', distance: 600 * scaleFactor, radius: 8 * scaleFactor, speed: 0.0004, angle: 0, color: 'blue' }
    ];

    // Dessin des planètes, orbites, et animations
    function drawOrbit(planet, isActive) {
      ctx.beginPath();
      ctx.arc(sunX, sunY, planet.distance, 0, 2 * Math.PI);
      ctx.strokeStyle = isActive ? 'white' : 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();
      ctx.closePath();
    }

    function drawPlanet(planet) {
      const x = sunX + planet.distance * Math.cos(planet.angle);
      const y = sunY + planet.distance * Math.sin(planet.angle);
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, 2 * Math.PI);
      ctx.fillStyle = planet.color;
      ctx.fill();
      ctx.closePath();

      if (planet.hasMoon) {
        drawMoon(x, y, planet);
      }
    }

    function drawMoon(earthX, earthY, planet) {
      const moonDistance = 20 * scaleFactor;
      const moonX = earthX + moonDistance * Math.cos(planet.angle * 12);
      const moonY = earthY + moonDistance * Math.sin(planet.angle * 12);
      ctx.beginPath();
      ctx.arc(moonX, moonY, 2 * scaleFactor, 0, 2 * Math.PI);
      ctx.fillStyle = 'gray';
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
      planets.forEach((planet) => {
        planet.angle += planet.speed;
        const isActive = activePlanet && activePlanet.name === planet.name;
        drawOrbit(planet, isActive);
        drawPlanet(planet);
      });
      requestAnimationFrame(updatePositions);
    }

    updatePositions();
  }, [activePlanet]);

  // Fonction pour afficher ou fermer les informations d'une planète
  const togglePlanetInfo = async (planet) => {
    if (activePlanet && activePlanet.name === planet.name) {
      setActivePlanet(null);
      setPlanetInfo('');
    } else {
      setActivePlanet(planet);
      const info = await fetchPlanetInfo(planet.name);
      setPlanetInfo({
        explanation: info.explanation,
        imageURL: info.url
    }); // Affiche l'explication du jour pour l'APOD (Astronomy Picture of the Day)
    }
  };

  const planetsList = [
    { name: 'Mercure' },
    { name: 'Vénus' },
    { name: 'Terre' },
    { name: 'Mars' },
    { name: 'Jupiter' },
    { name: 'Saturne' },
    { name: 'Uranus' },
    { name: 'Neptune' }
  ];

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} width={1000} height={1000} />
      <div className="planets-list">
        <h2>Liste des planètes</h2>
        <ul>
          {planetsList.map((planet) => (
            <li key={planet.name} className="planet-item">
              <button className="planet-button" onClick={() => togglePlanetInfo(planet)}>
                {planet.name}
              </button>
              {activePlanet && activePlanet.name === planet.name && (
                <div className="planet-info-card">
                  <div>{planetInfo.explanation}</div>
                  {planetInfo.imageURL && (
                    <img src={planetInfo.imageURL} alt={planetInfo.title} className="planet-image" />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="canvas">
      <h1>Système Solaire</h1>
      <SolarSystem />
    </div>
  );
}
