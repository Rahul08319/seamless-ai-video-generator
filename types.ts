
export enum InputType {
  TEXT = 'Text',
  SCRIPT = 'Script',
  IMAGE = 'Image',
  AUDIO = 'Audio',
  MODEL = '3D Model',
}

export interface GenerationResult {
  description: string;
  imageUrl: string;
}
