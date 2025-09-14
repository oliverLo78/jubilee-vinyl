import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";  
import { CREATE_VINYL_ORDER } from "../../utils/mutations";
import { QUERY_ME, QUERY_ORDERS } from "../../utils/queries";
import Auth from "../../utils/auth";
import { useSpotify } from "../../utils/SpotifyContext";

const VinylOrderForm = () => {
  const location = useLocation();
  const { spotifyToken } = useSpotify();
  const trackData = location.state?.trackData;

  // State should be at the top
  const [formState, setFormState] = useState({
    trackId: trackData?.id || '',
    trackName: trackData?.name || '',
    artistName: trackData?.artist || '',
    albumImage: trackData?.image || '',
    albumName: trackData?.album || '',
    previewUrl: trackData?.previewUrl || '',
    vinylColor: 'black',
    vinylSize: '12inch',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });

      const [createVinylOrder, { error, loading }] = useMutation(CREATE_VINYL_ORDER, {
        update(cache, { data: { createVinylOrder } }) {
          try {
            // Update orders query cache
            const { orders } = cache.readQuery({ query: QUERY_ORDERS });
              cache.writeQuery({
                query: QUERY_ORDERS,
                data: { orders: [createVinylOrder, ...orders] },
              });
                } catch (e) {
                  console.error(e);
                }

            // Update me object's cache
            const { me } = cache.readQuery({ query: QUERY_ME });
              cache.writeQuery({
                  query: QUERY_ME,
                  data: { me: { ...me, vinylOrders: [...me.vinylOrders, createVinylOrder] } },
                });
              },
            });


      const handleFormSubmit = async (event) => {
        event.preventDefault();

          if (!spotifyToken) {
            alert('Please connect your Spotify account first');
              return;
          }

          try {
            const { data } = await createVinylOrder({
              variables: {
                input: {
                  trackId: formState.trackId || 'default-track-id', // You'll get this from props/context
                  trackName: formState.trackName || 'Custom Track', // You'll get this from props/context
                  artistName: formState.artistName || 'Unknown Artist', // You'll get this from props/context
                  vinylColor: formState.vinylColor,
                  vinylSize: formState.vinylSize,
                  price: calculatePrice(formState.vinylSize, formState.vinylColor),
                  shippingAddress: formState.shippingAddress
                }
              }
            });

            // Reset form or redirect to success page
            setFormState({
              vinylColor: 'black',
              vinylSize: '12inch',
              shippingAddress: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'US'
              }
            });

            alert('Vinyl order created successfully!');

            } catch (err) {
              console.error('Order creation error:', err);
            }
          };

          const handleChange = (event) => {
            const { name, value } = event.target;
    
            if (name.startsWith('shipping.')) {
              const field = name.split('.')[1];
              setFormState({
                ...formState,
                shippingAddress: {
                  ...formState.shippingAddress,
                  [field]: value
                }
              });
            } else {
              setFormState({
                ...formState,
                [name]: value
              });
            }
          };

          const calculatePrice = (size, color) => {
            // Your pricing logic here
            const basePrice = size === '12inch' ? 29.99 : 19.99;
            const colorPremium = color === 'multicolor' ? 5.00 : 0;
            return basePrice + colorPremium;
          };

          // Early returns should be at the end, before the main return
          if (!trackData) {
            return (
              <Alert variant="warning" className="text-center">
                <h4>No Track Selected</h4>
                <p>Please go back to search and select a track to create a vinyl.</p>
                <Link to="/search" className="btn btn-primary">
                  Back to Search
                </Link>
              </Alert>
            );
          }
        
          if (!Auth.loggedIn()) {
            return (
              <Alert variant="info" className="text-center">
                <p>You need to be logged in to create a vinyl order.</p>
                <Link to="/login" className="btn btn-primary me-2">Login</Link>
                <Link to="/signup" className="btn btn-outline-primary">Signup</Link>
              </Alert>
            );
          }

          if (!spotifyToken) {
            return (
              <Alert variant="warning" className="text-center">
                <p>Please connect your Spotify account to create vinyl orders.</p>
                <Button variant="primary" onClick={() => window.location.href = '/auth/spotify'}>
                  Connect Spotify
                </Button>
              </Alert>
            );
          }

          return (
            <div className="vinyl-order-form">
            <h2 className="text-center mb-4">Create Your Custom Vinyl</h2>
            
            {/* Track Preview Section */}
            <Card className="mb-4">
              <Card.Header>
                <h5>Selected Track</h5>
              </Card.Header>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={3}>
                    <img 
                      src={trackData.image} 
                      alt={trackData.name}
                      className="img-fluid rounded"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col md={9}>
                    <h6>{trackData.name}</h6>
                    <p className="text-muted mb-1">by {trackData.artist}</p>
                    <p className="text-muted small">from {trackData.album}</p>
                    {trackData.previewUrl && (
                      <audio controls src={trackData.previewUrl} className="w-100">
                        Your browser does not support audio preview.
                      </audio>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Form onSubmit={handleFormSubmit}>
            {/* Vinyl Customization Section */}
            <Card className="mb-4">
              <Card.Header>
                <h5>Vinyl Customization</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Vinyl Color</Form.Label>
                      <Form.Select 
                        name="vinylColor" 
                        value={formState.vinylColor} 
                        onChange={handleChange}
                      >
                      <option value="black">Classic Black</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="clear">Clear</option>
                      <option value="multicolor">Multicolor (+$5.00)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vinyl Size</Form.Label>
                  <Form.Select 
                    name="vinylSize" 
                    value={formState.vinylSize} 
                    onChange={handleChange}
                  >
                    <option value="12inch">12-inch LP ($29.99)</option>
                    <option value="7inch">7-inch Single ($19.99)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
              <strong>Total: ${calculatePrice(formState.vinylSize, formState.vinylColor).toFixed(2)}</strong>
            </div>
          </Card.Body>
        </Card>

        {/* Shipping Information Section */}
        <Card className="mb-4">
          <Card.Header>
            <h5>Shipping Information</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="shipping.street"
                    value={formState.shippingAddress.street}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="shipping.city"
                    value={formState.shippingAddress.city}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="shipping.state"
                    value={formState.shippingAddress.state}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>ZIP Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="shipping.zipCode"
                    value={formState.shippingAddress.zipCode}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="shipping.country"
                    value={formState.shippingAddress.country}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

         {/* Submit Button */}
        <div className="text-center">
          <Button 
            type="submit" 
            variant="success" 
            size="lg"
            disabled={loading}
          >
            {loading ? 'Creating Order...' : 'Create Vinyl Order - $' + calculatePrice(formState.vinylSize, formState.vinylColor).toFixed(2)}
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="mt-3">
            Error: {error.message}
          </Alert>
        )}
      </Form>
    </div>
  );
};

export default VinylOrderForm;
