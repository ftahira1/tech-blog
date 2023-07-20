const router = require('express').Router();

const homeRoute = require('./home-route');
const apiRoutes = require('./api');
const userDashRoutes = require('./userdash-route');

router.use('/', homeRoute);
router.use('/api', apiRoutes);
router.use('/userdash', userDashRoutes);

module.exports = router;