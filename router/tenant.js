const express = require('express');
const { createTenant, getAllTenants, deleteTenant, getTenantBySlug } = require('../controller/tenant');
const router = express.Router();

router.post('/create',createTenant);
router.get('/get/alltenant',getAllTenants);
router.delete('/delete/:id', deleteTenant);
router.get('/get/:slug',getTenantBySlug);


module.exports = router; 