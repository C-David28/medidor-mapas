import { useState } from "react";
import InteractivePolylineMap from "./InteractivePolylineMap";
import Result from "./Result";
import { useMapDrawing } from "../hooks/useMapDrawing";
import MeasurementWorkspace, {
  WorkspaceViewProps,
} from "./MeasurementWorkspace";
import Icon from "./Icon";

export interface PolylineState {
  totalDistance: number | null;
  area: number | null;
}

export default function PolylineMap(viewProps: WorkspaceViewProps) {
  const [polylineState, setPolylineState] = useState<PolylineState>({
    totalDistance: null,
    area: null,
  });
  const mapDrawing = useMapDrawing();
  const { isDrawing, hasDrawing } = mapDrawing.drawingState;

  return (
    <MeasurementWorkspace
      {...viewProps}
      mode="area"
      isDrawing={isDrawing}
      hasDrawing={hasDrawing}
      controls={
        <>
          <div className="control-heading">
            <span>TRAZADO LIBRE</span>
            <Icon name="pen" />
          </div>
          <p className="control-description">
            Conecta puntos para medir una distancia. Cierra el trazado para
            obtener el área.
          </p>
          <button
            onClick={mapDrawing.handleStartDrawing}
            disabled={isDrawing || !viewProps.mapReady}
            className="action-button action-button--primary"
          >
            <Icon name="pen" />
            {isDrawing
              ? "Trazado en curso"
              : hasDrawing
                ? "Continuar trazado"
                : "Comenzar trazado"}
            <Icon name="arrow" />
          </button>
          <div className="secondary-actions">
            <button
              onClick={mapDrawing.handleStopDrawing}
              disabled={!isDrawing}
              className="action-button"
            >
              <Icon name="stop" />
              Finalizar
            </button>
            <button
              onClick={mapDrawing.handleClearDrawing}
              disabled={!hasDrawing}
              className="action-button action-button--clear"
            >
              <Icon name="trash" />
              Limpiar
            </button>
          </div>
        </>
      }
      results={<Result polylineState={polylineState} hasDrawing={hasDrawing} />}
    >
      <InteractivePolylineMap
        setPolylineState={setPolylineState}
        useMapDrawing={mapDrawing}
      />
    </MeasurementWorkspace>
  );
}
