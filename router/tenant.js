const express = require('express');
const { createTenant, getAllTenants, deleteTenant, getTenantBySlug, updateTenant } = require('../controller/tenant');
const router = express.Router();

router.post('/create',createTenant);
router.get('/get/alltenant',getAllTenants);
router.delete('/delete/:id', deleteTenant);
router.get('/get/:slug',getTenantBySlug);
router.put('/update/:id', updateTenant);


module.exports = router; 