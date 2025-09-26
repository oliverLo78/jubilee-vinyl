// client/src/components/Customizer/Customizer.js
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Customizer.css'

const Customizer = ({ trackData }) => {
const canvasRef = useRef(null);
const fabricCanvasRef = useRef(null);
const [activeTool, setActiveTool] = useState('select');
const [textContent, setTextContent] = useState('');
const [textColor, setTextColor] = useState('#000000');
const [fontFamily, setFontFamily] = useState('Arial');
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');

// Vinyl template dimensions (circular)
const VINYL_SIZE = 400;
const VINYL_CENTER = VINYL_SIZE / 2;
const VINYL_RADIUS = VINYL_SIZE / 2 - 20;

useEffect(() => {
  // Initialize the Fabric canvas
  const canvas = new fabric.Canvas(canvasRef.current, {
    height: VINYL_SIZE,
    width: VINY_SIZE,
    backgroundColor: '#ffffff',
  });

  fabricCanvasRef.current = canvas;

  // Create vinyl template (circle with center hole)
  createVinylTemplate(canvas);

  

  // Clean up on component unmount
  return () => canvas.dispose();   
  }, []);

  const createVinylTemplate = (canvas) => {
    // Main vinyl disc
    const vinylDisc = new fabric.Circle({
      left: 10,
      top: 10,
      radius: VINYL_RADIUS,
      fill: '#000000',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });

    // Center hole
    const centerHole = new fabric.Circle({
      left: VINYL_CENTER,
      top: VINYL_CENTER,
      radius: 15,
      fill: '#ffffff',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });

    canvas.add(vinylDisc);
    canvas.add(centerHole);
    canvas.renderAll();
  };

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (f) => {
    fabric.Image.fromURL(f.target.result, (img) => {
      // Scale image to fit within vinyl bounds
      const scale = Math.min(
        (VINYL_RADIUS * 2 - 10) / img.width,
        (VINYL_RADIUS * 2 - 10) / img.height
      );
        
      img.scale(scale);
      img.set({
        left: VINYL_CENTER,
        top: VINYL_CENTER,
        originX: 'center',
        originY: 'center',
        clipPath: new fabric.Circle({
          radius: VINYL_RADIUS - 5,
          originX: 'center',
          originY: 'center',
        }),
      });

      fabricCanvasRef.current.add(img);
      fabricCanvasRef.current.renderAll();
    });
  };
  reader.readAsDataURL(file);
};

const addText = () => {
   if (!textContent.trim()) return;

  const text = new fabric.IText(textContent, {
    left: VINYL_CENTER,
    top: VINYL_CENTER,
    fontFamily: fontFamily,
    fill: textColor,
    fontSize: 20,
    originX: 'center',
    originY: 'center',
   });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    setTextContent('');
    fabricCanvasRef.current.renderAll();
  };

 const addTrackInfo = () => {
    if (!trackData) return;

    const trackText = new fabric.Text(`${trackData.name}\nby ${trackData.artist}`, {
      left: VINYL_CENTER,
      top: VINYL_RADIUS + 50,
      fontFamily: 'Arial',
      fill: '#ffffff',
      fontSize: 14,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    fabricCanvasRef.current.add(trackText);
    fabricCanvasRef.current.renderAll();
  };

const clearCanvas = () => {
    fabricCanvasRef.current.getObjects().forEach(obj => {
      if (!obj.selectable) return; // Keep template elements
      fabricCanvasRef.current.remove(obj);
    });
    fabricCanvasRef.current.renderAll();
  };

const handleSaveDesign = async () => {
  setLoading(true);
  setMessage('');

  try {
    // Export canvas as image
    const imageData = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1.0,
    });

    const designData = {
      imageData,
      trackInfo: trackData,
      designSettings: {
        textColor,
        fontFamily,
      },
      timestamp: new Date().toISOString(),
    };

    // Save to backend
    const response = await axios.post('/api/designs/save', designData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('id_token')}`,
      },
    });

    setMessage('Design saved successfully!');
      
  } catch (error) {
    setMessage('Error saving design: ' + error.message);
  } finally {
    setLoading(false);
  }
};

return (
    <Container className="customizer-container">
      <Row>
        <Col lg={8}>
          <Card className="canvas-card">
            <Card.Header>
              <h4>Vinyl Customizer</h4>
              {trackData && (
                <div className="track-info">
                  Designing for: <strong>{trackData.name}</strong> by {trackData.artist}
                </div>
              )}
            </Card.Header>
            <Card.Body className="text-center">
              <canvas ref={canvasRef} className="vinyl-canvas" />
              
              <div className="canvas-controls mt-3">
                <Button variant="outline-primary" size="sm" onClick={clearCanvas}>
                  Clear Design
                </Button>
                {trackData && (
                  <Button variant="outline-info" size="sm" onClick={addTrackInfo} className="ms-2">
                    Add Track Info
                  </Button>
                )}
              </div>
            </Card.Body>
            </Card>
        </Col>

        <Col lg={4}>
          {/* Image Upload */}
          <Card className="mb-3">
            <Card.Header>Upload Image</Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Select Image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                <Form.Text className="text-muted">
                  Upload album art or custom image for your vinyl
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Text Tools */}
          <Card className="mb-3">
            <Card.Header>Add Text</Card.Header>
            <Card.Body>
              <Form.Group className="mb-2">
                <Form.Label>Text Content</Form.Label>
                <Form.Control
                  type="text"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter text for your vinyl"
                />
              </Form.Group>

               <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Font</Form.Label>
                    <Form.Select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" onClick={addText} className="w-100 mt-2">
                Add Text to Vinyl
              </Button>
            </Card.Body>
          </Card>

          {/* Save Design */}
          <Card>
            <Card.Header>Save Design</Card.Header>
            <Card.Body>
              <Button 
                variant="success" 
                onClick={handleSaveDesign} 
                disabled={loading}
                className="w-100"
              >
                {loading ? 'Saving...' : 'Save Vinyl Design'}
              </Button>
              
              {message && (
                <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mt-2">
                  {message}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Customizer;
  

