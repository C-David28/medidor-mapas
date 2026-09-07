import { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import PolylineMap from "./PolylineMap";
import CircleMap from "./CircleMap";
import { useMapMode } from "../hooks/useMapMode";
import { libraries } from "../utils/googleMapProps";
import Icon from "./Icon";

export default function MainPage() {
  const { mode, handleModeChange } = useMapMode();
  const [showGuide, setShowGuide] = useState(false);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const modeSelector = (
    <div className="mode-selector" role="group" aria-label="Tipo de medición">
      <button
        className={`mode-option ${mode === "area" ? "is-selected" : ""}`}
        aria-pressed={mode === "area"}
        onClick={() => handleModeChange("area")}
      >
        <span className="mode-icon">
          <Icon name="route" />
        </span>
        <span>
          <strong>Distancia y área</strong>
          <small>Traza un recorrido o un perímetro</small>
        </span>
        <span className="mode-radio">
          {mode === "area" && <Icon name="check" />}
        </span>
      </button>
      <button
        className={`mode-option ${mode === "radius" ? "is-selected" : ""}`}
        aria-pressed={mode === "radius"}
        onClick={() => handleModeChange("radius")}
      >
        <span className="mode-icon">
          <Icon name="radius" />
        </span>
        <span>
          <strong>Radio y cobertura</strong>
          <small>Mide alrededor de un punto</small>
        </span>
        <span className="mode-radio">
          {mode === "radius" && <Icon name="check" />}
        </span>
      </button>
    </div>
  );
  const viewProps = {
    modeSelector,
    mapReady: isLoaded,
    mapError: Boolean(loadError),
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#measurement">
        Ir a las herramientas de medición
      </a>
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark">
              <Icon name="map" />
            </span>
            <span className="brand-name">
              Atlas<span className="brand-dot">.</span>
            </span>
            <span className="brand-divider" />
            <span className="brand-caption">Medición geográfica</span>
          </div>
          <button
            className={`help-button ${showGuide ? "is-open" : ""}`}
            onClick={() => setShowGuide(!showGuide)}
            aria-expanded={showGuide}
            aria-controls="quick-guide"
          >
            <Icon name={showGuide ? "close" : "help"} />
            {showGuide ? "Cerrar guía" : "Guía rápida"}
          </button>
        </div>
      </header>
      <main className="app-main" id="measurement" tabIndex={-1}>
        <div className="page-heading">
          <div>
            <div className="eyebrow">
              <span /> EXPLORA CON PERSPECTIVA
            </div>
            <h1>Cada punto cuenta.</h1>
            <p>
              Traza distancias, calcula áreas y descubre el alcance de cada
              lugar.
            </p>
          </div>
          <div className="workspace-label">
            <Icon name="layers" />
            <span>Tu espacio de medición</span>
          </div>
        </div>
        {showGuide && (
          <section
            className="quick-guide"
            id="quick-guide"
            aria-label="Guía rápida"
          >
            <div>
              <span>01</span>
              <h2>Elige tu herramienta</h2>
              <p>
                Usa distancia y área para recorridos, o radio para zonas de
                cobertura. Cambiar de herramienta reinicia la medición.
              </p>
            </div>
            <div>
              <span>02</span>
              <h2>Marca sobre el mapa</h2>
              <p>
                Pulsa Comenzar trazado y añade puntos. En Radio, elige una
                medida y marca el centro, o dibuja con dos clics.
              </p>
            </div>
            <div>
              <span>03</span>
              <h2>Consulta y ajusta</h2>
              <p>
                Lee los resultados en el panel. Arrastra los controles para
                editar; cierra un recorrido sobre su primer punto para calcular
                el área.
              </p>
            </div>
          </section>
        )}
        {mode === "radius" ? (
          <CircleMap {...viewProps} />
        ) : (
          <PolylineMap {...viewProps} />
        )}
        <footer className="app-footer">
          <span>Hecho para explorar, diseñado para medir.</span>
          <span>
            <span className="footer-dot" /> Distancias · Superficies · Cobertura
          </span>
        </footer>
      </main>
    </div>
  );
}
