import type { ReactNode } from "react";
import Icon from "./Icon";

export interface WorkspaceViewProps {
  modeSelector: ReactNode;
  mapReady: boolean;
  mapError: boolean;
}

interface Props extends WorkspaceViewProps {
  mode: "area" | "radius";
  isDrawing: boolean;
  hasDrawing: boolean;
  controls: ReactNode;
  results: ReactNode;
  children: ReactNode;
}

export default function MeasurementWorkspace({
  modeSelector,
  mapReady,
  mapError,
  mode,
  isDrawing,
  hasDrawing,
  controls,
  results,
  children,
}: Props) {
  const radius = mode === "radius";
  return (
    <div className="workspace">
      <aside
        className="workspace-sidebar"
        aria-label="Herramientas y resultados"
      >
        <section className="tool-panel" aria-labelledby="tools-title">
          <div className="section-label">
            <span className="step-number">01</span> CONFIGURA TU MEDICIÓN
          </div>
          <h2 id="tools-title">¿Qué quieres medir?</h2>
          <p className="muted tool-description">
            Elige una herramienta para comenzar.
          </p>
          {modeSelector}
          <div className="tool-controls">{controls}</div>
        </section>
        {results}
        <div className="sidebar-note">
          <Icon name="layers" />
          <p>
            Medidas sobre el terreno.
            <br />
            <span>Resultados estimados en unidades métricas.</span>
          </p>
        </div>
      </aside>
      <section className="map-panel" aria-labelledby="map-title">
        <div className="map-toolbar">
          <div className="map-toolbar-title">
            <span className="map-title-icon">
              <Icon name="map" />
            </span>
            <div>
              <h2 id="map-title">Lienzo de medición</h2>
              <p>
                {radius
                  ? "Círculos y zonas de cobertura"
                  : "Recorridos y superficies"}
              </p>
            </div>
          </div>
          <span
            className={`status-badge ${isDrawing && mapReady ? "status-badge--active" : ""}`}
            role="status"
          >
            <span />
            {mapError
              ? "Mapa no disponible"
              : !mapReady
                ? "Cargando"
                : isDrawing
                  ? "Dibujando"
                  : hasDrawing
                    ? "Medición lista"
                    : "Exploración"}
          </span>
        </div>
        <div className="map-canvas">
          {mapReady ? (
            children
          ) : (
            <div
              className="map-placeholder"
              role={mapError ? "alert" : "status"}
            >
              <div
                className={`placeholder-icon ${mapError ? "" : "is-loading"}`}
              >
                <Icon name="map" />
              </div>
              <h3>
                {mapError ? "No pudimos cargar el mapa" : "Preparando tu mapa"}
              </h3>
              <p>
                {mapError
                  ? "Comprueba tu conexión e inténtalo de nuevo."
                  : "En un momento podrás empezar a explorar."}
              </p>
              {mapError && (
                <button
                  className="action-button action-button--primary"
                  onClick={() => window.location.reload()}
                >
                  Volver a intentar <Icon name="arrow" />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="map-caption">
          <Icon name={isDrawing ? "pen" : "pointer"} />
          <p>
            {isDrawing
              ? radius
                ? "Marca el centro del círculo y define su radio. Arrastra sus controles para ajustarlo."
                : "Añade puntos con un clic. Para calcular un área, cierra el recorrido sobre el primer punto."
              : "Arrastra para explorar el mapa y usa el zoom para acercarte a tu zona de interés."}
          </p>
          <span className="map-caption-tag">
            {radius ? "RADIO" : "DISTANCIA Y ÁREA"}
          </span>
        </div>
      </section>
    </div>
  );
}
