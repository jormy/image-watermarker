export type WatermarkPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type WatermarkSettings = {
  type: "text" | "image";
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  opacity: number;
  position: WatermarkPosition;
  margin: number;
  rotation: number;
};
