import React, { useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { Container, Row, Col, Card, Button, Form, Alert, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';
import './customizer.css';

const Customizer = ({ trackData }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  
  // STATE DECLARATIONS - Add testMode here
  const [testMode, setTestMode] = useState(true); // ← ADD THIS LINE
  const [activeTool, setActiveTool] = useState('select');
  const [textContent, setTextContent] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Vinyl template dimensions
  const VINYL_SIZE = 400;
  const VINYL_CENTER = VINYL_SIZE / 2;
  const VINYL_RADIUS = VINYL_SIZE / 2 - 20;

  // Test images for quick testing
  const testImages = [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=400&fit=crop',
  ];

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: VINYL_SIZE,
      height: VINYL_SIZE,
      backgroundColor: '#ffffff',
    });

    fabricCanvasRef.current = canvas;
    createVinylTemplate(canvas);

    return () => canvas.dispose();
  }, []);

  const createVinylTemplate = (canvas) => {
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

  // Quick load test image function
  const loadTestImage = (imageUrl) => {
    fabric.Image.fromURL(imageUrl, (img) => {
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

  // Quick add sample text
  const addSampleText = (sampleText, color = '#ffffff') => {
    const textObj = new fabric.IText(sampleText, {
      left: VINYL_CENTER,
      top: VINYL_CENTER,
      fontFamily: 'Arial',
      fill: color,
      fontSize: 24,
      originX: 'center',
      originY: 'center',
    });

    fabricCanvasRef.current.add(textObj);
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
      if (!obj.selectable) return;
      fabricCanvasRef.current.remove(obj);
    });
    fabricCanvasRef.current.renderAll();
  };

  const handleSaveDesign = async () => {
    setLoading(true);
    setMessage('');

    try {
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

  // Mock save function for testing
  const mockSaveDesign = () => {
    setLoading(true);
    setTimeout(() => {
      setMessage('✅ Design saved successfully! (Mock - Ready for Backend)');
      setLoading(false);
    }, 1500);
  };

  return (
    <Container className="customizer-container">
      {/* TEST MODE BANNER */}
      {testMode && (
        <Alert variant="warning" className="mb-3">
          <strong>TEST MODE ACTIVE</strong> - Using mock save function for demonstration
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="canvas-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Vinyl Customizer</h4>
              <ButtonGroup size="sm">
                <Button 
                  variant={testMode ? "warning" : "outline-secondary"} 
                  onClick={() => setTestMode(!testMode)}
                >
                  {testMode ? '🔄 Test Mode ON' : 'Test Mode OFF'}
                </Button>
              </ButtonGroup>
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
          {/* QUICK TEST IMAGES - Only show in test mode */}
          {testMode && (
            <Card className="mb-3">
              <Card.Header>🎨 Quick Test Images</Card.Header>
              <Card.Body>
                <p className="small text-muted mb-2">Click to add test images:</p>
                <div className="test-images-grid">
                  {testImages.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Test ${index + 1}`}
                      className="test-image-thumb"
                      onClick={() => loadTestImage(imageUrl)}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        margin: '2px',
                        border: '2px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* QUICK TEXT BUTTONS - Only show in test mode */}
          {testMode && (
            <Card className="mb-3">
              <Card.Header>✍️ Quick Text Samples</Card.Header>
              <Card.Body>
                <p className="small text-muted mb-2">One-click text samples:</p>
                <div className="d-grid gap-2">
                  <Button variant="outline-dark" size="sm" onClick={() => addSampleText('MY FAVORITE ALBUM', '#ffffff')}>
                    Add White Text
                  </Button>
                  <Button variant="outline-dark" size="sm" onClick={() => addSampleText('SUMMER HITS', '#ffd700')}>
                    Add Gold Text
                  </Button>
                  <Button variant="outline-dark" size="sm" onClick={() => addSampleText('BEST OF 2024', '#ff6b6b')}>
                    Add Red Text
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Original Image Upload Card */}
          <Card className="mb-3">
            <Card.Header>📁 Upload Custom Image</Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Select Your Image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                <Form.Text className="text-muted">
                  Choose any image from your computer
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Text Tools Card */}
          <Card className="mb-3">
            <Card.Header>📝 Add Custom Text</Card.Header>
            <Card.Body>
              <Form.Group className="mb-2">
                <Form.Label>Text Content</Form.Label>
                <Form.Control
                  type="text"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter your custom text here"
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

          {/* Save Design Card */}
          <Card>
            <Card.Header>💾 Save Design</Card.Header>
            <Card.Body>
              <Button 
                variant="success" 
                onClick={testMode ? mockSaveDesign : handleSaveDesign}
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