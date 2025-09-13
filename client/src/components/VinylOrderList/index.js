import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Row, Col } from 'react-bootstrap';

const VinylOrderList = ({
  orders,
  title = 'Your Vinyl Orders',
  showTitle = true,
  showUsername = true,
}) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-4">
        <h4>No Vinyl Orders Yet</h4>
        <p className="text-muted">Create your first custom vinyl to get started!</p>
        <Link to="/search" className="btn btn-primary">
          Browse Tracks
        </Link>
      </div>
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

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  return (
    <div className="vinyl-order-list">
      {showTitle && <h3 className="mb-4">{title}</h3>}
      
      <Row>
        {orders.map((order) => (
          <Col key={order._id} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <Badge bg={getStatusVariant(order.status)}>
                    {order.status?.toUpperCase()}
                  </Badge>
                  <small className="text-muted">
                    {formatDate(order.orderDate)}
                  </small>
                </div>
              </Card.Header>

               <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-start mb-3">
                  {order.albumImage && (
                    <img 
                      src={order.albumImage} 
                      alt={order.trackName}
                      className="rounded me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="flex-grow-1">
                    <h6 className="card-title mb-1" title={order.trackName}>
                      {order.trackName.length > 40 
                        ? `${order.trackName.substring(0, 40)}...` 
                        : order.trackName
                      }
                    </h6>
                    <p className="text-muted small mb-1">
                      by {order.artistName}
                    </p>
                    {order.albumName && (
                      <p className="text-muted small mb-0">
                        from {order.albumName}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Row className="small text-muted mb-2">
                    <Col>Color: <span className="text-dark">{order.vinylColor}</span></Col>
                    <Col>Size: <span className="text-dark">{order.vinylSize}</span></Col>
                  </Row>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="text-primary">
                      ${order.price?.toFixed(2)}
                    </strong>
                    
                    <Link
                      to={`/order/${order._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default VinylOrderList;
