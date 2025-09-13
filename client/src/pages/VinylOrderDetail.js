import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { QUERY_SINGLE_ORDER } from '../utils/queries';

const VinylOrderDetail = () => {
  const { orderId } = useParams();

  const { loading, error, data } = useQuery(QUERY_SINGLE_ORDER, {
    variables: { orderId: orderId },
  });

  const order = data?.order || {};

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading order details...</p>
      </Container>
    );
  }

   if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Error Loading Order</h4>
          <p>{error.message}</p>
          <Link to="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </Alert>
      </Container>
    );
  }

  if (!order._id) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>Order Not Found</h4>
          <p>The requested order could not be found.</p>
          <Link to="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </Alert>
      </Container>
    );
  }

  // Function to get status badge color
  const getStatusVariant = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'secondary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container className="py-5">
      {/* Header with Back Button */}
      <Row className="mb-4">
        <Col>
          <Link to="/orders" className="btn btn-outline-secondary mb-3">
            ← Back to Orders
          </Link>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Order Details</h1>
            <Badge bg={getStatusVariant(order.status)} className="fs-6">
              {order.status?.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted">Order placed on {formatDate(order.orderDate)}</p>
        </Col>
      </Row>

      <Row>
        {/* Left Column - Order Information */}
        <Col lg={8}>
          {/* Track Information Card */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Track Information</h5>
            </Card.Header>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3}>
                  {order.albumImage && (
                    <img 
                      src={order.albumImage} 
                      alt={order.trackName}
                      className="img-fluid rounded"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                  )}
                </Col>
                <Col md={9}>
                  <h4>{order.trackName}</h4>
                  <p className="text-muted mb-1">by {order.artistName}</p>
                  {order.albumName && (
                    <p className="text-muted">from {order.albumName}</p>
                  )}
                  {order.previewUrl && (
                    <audio controls src={order.previewUrl} className="w-100 mt-2">
                      Your browser does not support audio playback.
                    </audio>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Vinyl Customization Card */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Vinyl Customization</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <strong>Color:</strong>
                  <br />
                  <span className="text-capitalize">{order.vinylColor}</span>
                </Col>
                <Col md={6}>
                  <strong>Size:</strong>
                  <br />
                  <span>{order.vinylSize}</span>
                </Col>
              </Row>
            </Card.Body>
          </Card>

           {/* Shipping Information Card */}
          {order.shippingAddress && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Shipping Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <strong>Address:</strong>
                    <br />
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    <br />
                    {order.shippingAddress.country}
                  </Col>
                  <Col md={6}>
                    {order.estimatedDelivery && (
                      <>
                        <strong>Estimated Delivery:</strong>
                        <br />
                        {formatDate(order.estimatedDelivery)}
                      </>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Right Column - Order Summary */}
        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Vinyl Price:</span>
                <span>${order.price?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>$5.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total:</span>
                <span className="text-primary">
                  ${(order.price + 5)?.toFixed(2)}
                </span>
              </div>
              
              <div className="mt-4">
                <strong>Order ID:</strong>
                <br />
                <small className="text-muted">{order._id}</small>
              </div>

               {/* Action Buttons */}
              <div className="mt-4 d-grid gap-2">
                {order.status === 'pending' && (
                  <Button variant="warning" size="sm">
                    Cancel Order
                  </Button>
                )}
                <Button variant="outline-primary" size="sm">
                  Contact Support
                </Button>
                <Button variant="outline-secondary" size="sm">
                  Download Receipt
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VinylOrderDetail;


