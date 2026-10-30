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
  fontSizeMode: "px" | "percentage";
  fontFamily: string;
  fontWeight:
    "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  italic: boolean;
  underline: boolean;
  color: string;
  opacity: number;
  position: WatermarkPosition;
  margin: number;
  rotation: number;
  imageSizeMode: ImageSizeMode;
  imageSizeValue: number;
  imageOpacity: number;
  imageBlendMode: ImageBlendMode;
};

export type ImageSizeMode = "percentage" | "pixels";

export type ImageBlendMode =
  | "source-over"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";
