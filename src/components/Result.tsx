import { formatAreaMeasure, formatLinearMeasure } from "../utils/formatters";
import type { PolylineState } from "./PolylineMap";
import type { CircleState } from "./CircleMap";
import Icon from "./Icon";

interface ResultProps {
  circleState?: CircleState;
  polylineState?: PolylineState;
  hasDrawing?: boolean;
}

export default function Result({
  circleState,
  polylineState,
  hasDrawing = false,
}: ResultProps) {
  const mainValue = circleState
    ? circleState.radius
    : polylineState?.totalDistance;
  const area = circleState ? circleState.area : polylineState?.area;
  return (
    <section className="results-panel" aria-labelledby="results-title">
      <div className="section-label">
        <span className="step-number">02</span> RESULTADOS
      </div>
      <div className="results-heading">
        <h2 id="results-title">Tu medición</h2>
        <span
          className={`result-indicator ${hasDrawing ? "has-result" : ""}`}
        />
      </div>
      <dl className="measurement-values" aria-live="polite" aria-atomic="true">
        <div className="primary-metric">
          <dt>
            <Icon name={circleState ? "radius" : "route"} />
            {circleState ? "Radio del círculo" : "Distancia total"}
          </dt>
          <dd>
            {hasDrawing && mainValue != null ? (
              formatLinearMeasure(mainValue)
            ) : (
              <>
                <span className="empty-measure">—</span>
                <small> m</small>
              </>
            )}
          </dd>
        </div>
        <div className="secondary-metric">
          <dt>
            <Icon name="area" />
            Área {circleState ? "de cobertura" : "del polígono"}
          </dt>
          <dd>
            {hasDrawing && area != null && area > 0
              ? formatAreaMeasure(area)
              : "—"}
          </dd>
        </div>
        {circleState && (
          <div className="secondary-metric">
            <dt>
              <Icon name="radius" />
              Perímetro
            </dt>
            <dd>
              {hasDrawing && circleState.perimeter != null
                ? formatLinearMeasure(circleState.perimeter)
                : "—"}
            </dd>
          </div>
        )}
      </dl>
      <p className="result-hint">
        {!hasDrawing
          ? "Los resultados aparecerán al dibujar sobre el mapa."
          : !circleState && !area
            ? "Cierra el trazado sobre el primer punto para calcular el área."
            : "La medición se actualiza al ajustar tu dibujo."}
      </p>
    </section>
  );
}
