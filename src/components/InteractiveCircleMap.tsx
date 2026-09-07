import { GoogleMap } from "@react-google-maps/api";
import { CircleState } from "./CircleMap";
import { UseMapDrawing } from "../hooks/useMapDrawing";
import { useCircleMap } from "../hooks/useCircleMap";
import { googleMapProps } from "../utils/googleMapProps";

export interface InteractiveCircleMapProps {
  setCircleState: React.Dispatch<React.SetStateAction<CircleState>>;
  useMapDrawing: UseMapDrawing;
  radiusSelected: number;
  setRadiusSelected: React.Dispatch<React.SetStateAction<number>>;
}

const InteractiveCircleMap = ({
  setCircleState,
  useMapDrawing,
  radiusSelected,
  setRadiusSelected,
}: InteractiveCircleMapProps) => {
  const {
    handleMapLoad,
    handleMapClick,
  } = useCircleMap({
    setCircleState,
    useMapDrawing,
    radiusSelected,
    setRadiusSelected,
  });

  return (
    <>
      <GoogleMap
        {...googleMapProps}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
      />
    </>
  );
};

export default InteractiveCircleMap;
