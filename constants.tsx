
import React from 'react';
import { InputType } from './types';
import TextIcon from './components/icons/TextIcon';
import ScriptIcon from './components/icons/ScriptIcon';
import ImageIcon from './components/icons/ImageIcon';
import AudioIcon from './components/icons/AudioIcon';
import ModelIcon from './components/icons/ModelIcon';

export const TABS = [
  { id: InputType.TEXT, label: 'Text', icon: <TextIcon /> },
  { id: InputType.SCRIPT, label: 'Script', icon: <ScriptIcon /> },
  { id: InputType.IMAGE, label: 'Image', icon: <ImageIcon /> },
  { id: InputType.AUDIO, label: 'Audio', icon: <AudioIcon /> },
  { id: InputType.MODEL, label: '3D Model', icon: <ModelIcon /> },
];
