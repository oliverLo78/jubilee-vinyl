import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const Customizer = () => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    // Initialize the Fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      height: 500,
      width: 500,
      backgroundColor: '#f5f5f5',
    });

    fabricCanvasRef.current = canvas;

    // Clean up on component unmount
    return () => {
      canvas.dispose();
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target.result;
      fabric.Image.fromURL(data, (img) => {
        img.scaleToWidth(fabricCanvasRef.current.width);
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    const text = new fabric.IText('Add Text', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fill: '#000000',
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };

  const handleSave = async () => {
    // Generate the final image data and send to the backend
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'jpeg',
      quality: 0.8,
    });
    // Call the API
    // await axios.post('/api/save-design', { designData: dataURL, ... });
    alert('Design saved!');
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={addText}>Add Text</button>
      <button onClick={handleSave}>Save Design</button>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Customizer;
