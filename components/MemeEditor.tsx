"use client";

import { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { useDropzone } from 'react-dropzone';
import { ChromePicker } from 'react-color';
import { DEFAULT_FONTS, DEFAULT_TOP_TEXT, DEFAULT_BOTTOM_TEXT } from '@/lib/memeEditor';
import { initializeSdk } from '@/lib/sdk';
import { uploadImage, createMeme } from '@/lib/db';

export default function MemeEditor() {
  const [canvas, setCanvas] = useState<any>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState('Impact');
  const [textColor, setTextColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 600,
        backgroundColor: '#f0f0f0'
      });
      setCanvas(fabricCanvas);
    }
  }, [canvas]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      fabric.Image.fromURL(result, (img: any) => {
        canvas.clear();

        const scale = Math.min(600 / (img.width || 1), 600 / (img.height || 1));
        img.scale(scale);
        img.set({ selectable: false });

        canvas.setWidth(img.getScaledWidth());
        canvas.setHeight(img.getScaledHeight());
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

        setImageLoaded(true);
        updateTexts();
      });
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    maxFiles: 1
  });

  const updateTexts = () => {
    if (!canvas || !imageLoaded) return;

    const objects = canvas.getObjects();
    objects.forEach((obj: any) => canvas.remove(obj));

    if (topText) {
      const top = new fabric.Text(topText.toUpperCase(), {
        ...DEFAULT_TOP_TEXT,
        fontSize,
        fontFamily,
        fill: textColor,
        left: (canvas.width || 300) / 2,
        originX: 'center'
      } as any);
      canvas.add(top);
    }

    if (bottomText) {
      const bottom = new fabric.Text(bottomText.toUpperCase(), {
        ...DEFAULT_BOTTOM_TEXT,
        fontSize,
        fontFamily,
        fill: textColor,
        left: (canvas.width || 300) / 2,
        top: (canvas.height || 300) - fontSize - 30,
        originX: 'center'
      } as any);
      canvas.add(bottom);
    }

    canvas.renderAll();
  };

  useEffect(() => {
    updateTexts();
  }, [topText, bottomText, fontSize, fontFamily, textColor]);

  const handleSave = async () => {
    if (!canvas || !imageLoaded) return;

    setSaving(true);
    try {
      const user = await initializeSdk();

      // ИСПРАВЛЕНИЕ: используем toDataURL без параметров или с type assertion
      const dataURL = canvas.toDataURL({ format: 'png' });
      const blob = await (await fetch(dataURL)).blob();
      const file = new File([blob], `meme_${Date.now()}.png`, { type: 'image/png' });

      const { url, error: uploadError } = await uploadImage(file, user.fid);

      if (uploadError || !url) {
        alert('Failed to upload image');
        return;
      }

      await createMeme({
        creator_fid: user.fid,
        image_url: url,
        prompt: `${topText} / ${bottomText}`,
        source: 'user',
        vote_count: 0,
        total_earned: 0
      });

      alert('✅ Meme saved successfully!');
      window.location.href = '/';

    } catch (error) {
      console.error(error);
      alert('Error saving meme');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">🎨 Meme Editor</h2>

      {!imageLoaded ? (
        <div {...getRootProps()} 
          className={`border-4 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}`}>
          <input {...getInputProps()} />
          <p className="text-xl mb-2">📤 Drop your image here</p>
          <p className="text-gray-500">or click to select</p>
        </div>
      ) : (
        <div className="space-y-4">
          <canvas ref={canvasRef} className="border-2 border-gray-300 mx-auto rounded" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Top Text</label>
              <input type="text" value={topText} onChange={(e) => setTopText(e.target.value)}
                className="w-full p-2 border rounded" placeholder="TOP TEXT" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bottom Text</label>
              <input type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)}
                className="w-full p-2 border rounded" placeholder="BOTTOM TEXT" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Font Size</label>
              <input type="range" min="20" max="80" value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full" />
              <span className="text-sm">{fontSize}px</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Font</label>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}
                className="w-full p-2 border rounded">
                {DEFAULT_FONTS.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="relative">
                <button onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full p-2 border rounded flex items-center justify-between">
                  <span style={{ backgroundColor: textColor }} className="w-6 h-6 rounded border" />
                  <span>{textColor}</span>
                </button>
                {showColorPicker && (
                  <div className="absolute z-10 mt-2">
                    <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                    <ChromePicker color={textColor} onChange={(color) => setTextColor(color.hex)} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => { setImageLoaded(false); setTopText(''); setBottomText(''); }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg">
              🔄 New Image
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg disabled:opacity-50">
              {saving ? 'Saving...' : '💾 Save & Post'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
