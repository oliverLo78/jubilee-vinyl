const router = require('express').Router();
const userRoutes = require('./user-routes');
// I need this for vinyl orders
const spotifyRoutes = require('./spotify-routes'); 
const orderRoutes = require('./order-routes'); 

router.use('/users', userRoutes);
router.use('/spotify', spotifyRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
