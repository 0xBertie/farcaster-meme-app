export interface TextConfig {
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  textAlign: string;
  top: number;
  left: number;
}

export const DEFAULT_FONTS = [
  'Impact',
  'Arial Black',
  'Comic Sans MS',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New'
];

export const DEFAULT_TOP_TEXT: Partial<TextConfig> = {
  fontSize: 48,
  fontFamily: 'Impact',
  fill: 'white',
  stroke: 'black',
  strokeWidth: 2,
  textAlign: 'center',
  top: 20
};

export const DEFAULT_BOTTOM_TEXT: Partial<TextConfig> = {
  fontSize: 48,
  fontFamily: 'Impact',
  fill: 'white',
  stroke: 'black',
  strokeWidth: 2,
  textAlign: 'center'
};

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas to Blob failed'));
    }, 'image/png');
  });
}
