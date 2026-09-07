import { useState, useCallback, useEffect, useRef } from "react";
import {
  calculateCircleArea,
  calculateCirclePerimeter,
  circleOptions,
} from "../utils/circleUtils";
import { InteractiveCircleMapProps } from "../components/InteractiveCircleMap";
import {
  TMap,
  TCircle,
  TLatLng,
} from "../types/googleMapsTypes";
import useMapFitBounds from "./useMapFitBounds";

export const useCircleMap = ({
  setCircleState,
  useMapDrawing,
  radiusSelected,
  setRadiusSelected,
}: InteractiveCircleMapProps) => {
  const [center, setCenter] = useState<TLatLng | undefined>(undefined);
  const [radius, setRadius] = useState<number | undefined>(undefined);
  const [waitingForCenter, setWaitingForCenter] = useState<boolean>(false);

  const { drawingState, setIsDrawing, setHasDrawing, setCallbacks } =
    useMapDrawing;

  const { isDrawing, hasDrawing } = drawingState;

  const mapRef = useRef<TMap | null>(null);
  const pendingCenterRef = useRef<TLatLng | null>(null);
  const circleRef = useRef<TCircle | null>(null);

  const handleMapLoad = useCallback((map: TMap) => {
    mapRef.current = map;
  }, []);

  const updateMapCursor = useCallback((newCursor: string | null) => {
    if (mapRef.current) {
      mapRef.current.setOptions({ draggableCursor: newCursor });
    }
  }, []);

  const onCircleEdit = useCallback((editedCircle: google.maps.Circle) => {
    if (!editedCircle) return;

    const newCenter = editedCircle.getCenter();
    const newRadius = editedCircle.getRadius();

    if (newCenter && newRadius) {
      setCenter(newCenter);
      setRadius(newRadius);
    }
  }, []);

  const handleCircleComplete = useCallback(
    (circle: google.maps.Circle) => {
      if (!circle) return;

      const newCenter = circle.getCenter();
      const newRadius = circle.getRadius();

      circleRef.current = circle;
      circleRef.current.setEditable(true);
      setHasDrawing(true);

      if (newCenter && newRadius) {
        setCenter(newCenter);
        setRadius(newRadius);
      }

      circleRef.current.addListener("radius_changed", () =>
        onCircleEdit(circleRef.current!),
      );
      circleRef.current.addListener("center_changed", () =>
        onCircleEdit(circleRef.current!),
      );
    },
    [onCircleEdit, setHasDrawing],
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const { latLng } = event;

      if (!mapRef.current || !latLng || !isDrawing || circleRef.current) {
        return;
      }

      // With no preset radius, the first click selects the center and the
      // second selects the edge. This uses the supported Circle API.
      if (!waitingForCenter && !pendingCenterRef.current) {
        pendingCenterRef.current = latLng;
        return;
      }

      const circleCenter = waitingForCenter ? latLng : pendingCenterRef.current!;
      const circleRadius = waitingForCenter
        ? radiusSelected
        : google.maps.geometry.spherical.computeDistanceBetween(circleCenter, latLng);
      if (circleRadius <= 0) return;

      pendingCenterRef.current = null;
      setWaitingForCenter(false);

      const circle = new google.maps.Circle({
        ...circleOptions,
        center: circleCenter,
        radius: circleRadius,
      });

      circle.setMap(mapRef.current);
      handleCircleComplete(circle);
    },
    [handleCircleComplete, isDrawing, radiusSelected, waitingForCenter],
  );

  useEffect(() => {
    return () => {
      if (circleRef.current) {
        google.maps.event.clearInstanceListeners(circleRef.current);
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    };
  }, []);

  const startDrawing = useCallback(() => {
    setIsDrawing(true);
    pendingCenterRef.current = null;
    setWaitingForCenter(radiusSelected > 0 && !circleRef.current);
    updateMapCursor(circleRef.current ? null : "crosshair");
    if (circleRef.current) {
      circleRef.current.setEditable(true);
    }
  }, [radiusSelected, setIsDrawing, updateMapCursor]);

  const stopDrawing = useCallback(() => {
    pendingCenterRef.current = null;
    setIsDrawing(false);
    updateMapCursor(null);
    setWaitingForCenter(false);
    if (circleRef.current) {
      circleRef.current.setEditable(false);
    }
  }, [setIsDrawing, updateMapCursor]);

  const clearDrawing = useCallback(() => {
    pendingCenterRef.current = null;
    setIsDrawing(false);
    setHasDrawing(false);
    updateMapCursor(null);
    setWaitingForCenter(false);
    setRadiusSelected(0);
    setRadius(undefined);
    setCenter(undefined);
    setCircleState({
      radius: null,
      area: null,
      perimeter: null,
    });

    if (circleRef.current) {
      google.maps.event.clearInstanceListeners(circleRef.current);
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
  }, [setCircleState, setRadiusSelected, setIsDrawing, setHasDrawing, updateMapCursor]);

  useEffect(() => {
    setCallbacks({
      startDrawingCallback: startDrawing,
      stopDrawingCallback: stopDrawing,
      clearDrawingCallback: clearDrawing,
    });
  }, [clearDrawing, setCallbacks, startDrawing, stopDrawing]);

  useEffect(() => {
    if (!mapRef.current || !center || !radius) {
      setHasDrawing(false);
      return;
    }

    updateMapCursor(null);

    const area = calculateCircleArea(radius);
    const perimeter = calculateCirclePerimeter(radius);

    setCircleState({
      radius,
      area,
      perimeter,
    });

    setHasDrawing(true);
  }, [center, radius, setCircleState, setHasDrawing, updateMapCursor]);

  useEffect(() => {
    pendingCenterRef.current = null;
    if (radiusSelected === 0) {
      setWaitingForCenter(false);
      return;
    }

    if (!circleRef.current) {
      updateMapCursor("crosshair");
      setIsDrawing(true);
      setWaitingForCenter(true);
      return;
    }

    circleRef.current.setRadius(radiusSelected);
    setRadius(radiusSelected);
  }, [radiusSelected, setIsDrawing, updateMapCursor]);

  useMapFitBounds(mapRef.current, center, radius);

  return {
    isDrawing,
    mapRef,
    hasDrawing,
    waitingForCenter,
    handleMapLoad,
    handleCircleComplete,
    handleMapClick,
  };
};
