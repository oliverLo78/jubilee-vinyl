import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { QUERY_ME } from '../utils/queries';
import VinylOrderList from '../components/VinylOrderList';
import Auth from '../utils/auth';

const Profile = () => {
  const { loading, data } = useQuery( QUERY_ME);
  const user = data?.me || {};
  // better loading states
  if (loading)

  return (
    <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your profile...</p>
      </Container>
    );
  }

  // Redirect to login if not authenticated
  if (!Auth.loggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          {/* Profile Header */}
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center py-4">
              <div className="mb-3">
                <h1 className="h2 mb-2">Welcome, {user.username}!</h1>
                <p className="text-muted mb-0">{user.email}</p>
                {user.spotifyId && (
                  <Badge bg="success" className="mt-2">
                    Spotify Connected ✅
                  </Badge>
                )}
              </div>
              {/*Responsive grid system*/}
              <div className="d-flex justify-content-center gap-3">
                <Button variant="primary" href="/search">
                  Create New Vinyl
                </Button>
                <Button variant="outline-secondary" href="/favorites">
                  View Favorites
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Stats Overview cards for oders*/}
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-primary mb-0">
                    {user.vinylOrders?.length || 0}
                  </h3>
                  <p className="text-muted mb-0">Total Orders</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-success mb-0">
                    {user.vinylOrders?.filter(order => order.status === 'delivered').length || 0}
                  </h3>
                  <p className="text-muted mb-0">Delivered</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-warning mb-0">
                    {user.vinylOrders?.filter(order => 
                      ['pending', 'processing'].includes(order.status)
                    ).length || 0}
                  </h3>
                  <p className="text-muted mb-0">In Progress</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

            {/* Vinyl Orders Section */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h3 className="mb-0">Your Vinyl Orders</h3>
            </Card.Header>
            <Card.Body>
              <VinylOrderList
                orders={user.vinylOrders || []}
                title=""
                showTitle={false}
                showUsername={false}
              />
              
              {(!user.vinylOrders || user.vinylOrders.length === 0) && (
                <div className="text-center py-5">
                  <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>🎵</div>
                  <h4>No orders yet</h4>
                  <p className="text-muted mb-3">
                    Create your first custom vinyl to get started!
                  </p>
                  <Button variant="primary" href="/search">
                    Browse Tracks
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Favorites Section (Optional) */}
          {user.favoriteTracks && user.favoriteTracks.length > 0 && (
            <Card className="mt-4 shadow-sm">
              <Card.Header className="bg-light">
                <h3 className="mb-0">Your Favorite Tracks</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  {user.favoriteTracks.slice(0, 6).map((track, index) => (
                    <Col key={index} sm={6} md={4} className="mb-3">
                      <div className="d-flex align-items-center">
                        {track.albumImage && (
                          <img 
                            src={track.albumImage} 
                            alt={track.trackName}
                            className="rounded me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="flex-grow-1">
                          <div className="small fw-bold" title={track.trackName}>
                            {track.trackName.length > 25 
                              ? `${track.trackName.substring(0, 25)}...` 
                              : track.trackName
                            }
                          </div>
                          <div className="text-muted small">
                            {track.artistName}
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
                {user.favoriteTracks.length > 6 && (
                  <div className="text-center mt-3">
                    <Button variant="outline-primary" size="sm" href="/favorites">
                      View All Favorites ({user.favoriteTracks.length})
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );

export default Profile;
