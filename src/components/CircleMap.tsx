import { useState } from "react";
import Result from "./Result";
import { radiusOptions } from "../utils/circleUtils";
import InteractiveCircleMap from "./InteractiveCircleMap";
import { useMapDrawing } from "../hooks/useMapDrawing";
import MeasurementWorkspace, {
  WorkspaceViewProps,
} from "./MeasurementWorkspace";
import Icon from "./Icon";

export interface CircleState {
  radius: number | null;
  area: number | null;
  perimeter: number | null;
}

export default function CircleMap(viewProps: WorkspaceViewProps) {
  const [radiusSelected, setRadiusSelected] = useState(0);
  const [circleState, setCircleState] = useState<CircleState>({
    radius: null,
    area: null,
    perimeter: null,
  });
  const mapDrawing = useMapDrawing();
  const { isDrawing, hasDrawing } = mapDrawing.drawingState;

  return (
    <MeasurementWorkspace
      {...viewProps}
      mode="radius"
      isDrawing={isDrawing}
      hasDrawing={hasDrawing}
      controls={
        <>
          <label className="control-heading" htmlFor="radius-select">
            RADIO DEL CÍRCULO <Icon name="radius" />
          </label>
          <select
            id="radius-select"
            className="radius-select"
            value={radiusSelected}
            onChange={(event) => setRadiusSelected(Number(event.target.value))}
            disabled={!viewProps.mapReady || (hasDrawing && !isDrawing)}
            aria-describedby="radius-description"
          >
            <option value={0}>Personalizado · dibujar en el mapa</option>
            {radiusOptions
              .filter((option) => option.value > 0)
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
          <p className="control-description" id="radius-description">
            {hasDrawing
              ? "Pulsa Editar círculo para ajustar sus controles o cambiar el radio."
              : radiusSelected > 0
              ? "Haz clic en el mapa para colocar el centro del círculo con el radio elegido."
              : "Pulsa Dibujar círculo. Marca primero el centro y después un punto en el borde."}
          </p>
          <button
            className="action-button action-button--primary"
            onClick={mapDrawing.handleStartDrawing}
            disabled={isDrawing || !viewProps.mapReady}
          >
            <Icon name="pen" />
            {isDrawing
              ? "Edición en curso"
              : hasDrawing
                ? "Editar círculo"
                : "Dibujar círculo"}
            <Icon name="arrow" />
          </button>
          <div className="secondary-actions">
            <button
              className="action-button"
              onClick={mapDrawing.handleStopDrawing}
              disabled={!isDrawing}
            >
              <Icon name="stop" />
              {hasDrawing ? "Finalizar" : "Cancelar"}
            </button>
            <button
              className="action-button action-button--clear"
              onClick={mapDrawing.handleClearDrawing}
              disabled={!hasDrawing}
            >
              <Icon name="trash" />
              Limpiar
            </button>
          </div>
        </>
      }
      results={<Result circleState={circleState} hasDrawing={hasDrawing} />}
    >
      <InteractiveCircleMap
        setCircleState={setCircleState}
        useMapDrawing={mapDrawing}
        radiusSelected={radiusSelected}
        setRadiusSelected={setRadiusSelected}
      />
    </MeasurementWorkspace>
  );
}
