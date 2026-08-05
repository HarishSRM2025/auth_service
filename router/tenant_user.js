const express = require('express');
const { createTenantUser, signinTenantUser, getUsersByTenant, updateUserRole, changeTenantUserPassword } = require('../controller/tenant_user');
const router = express.Router();

router.post('/signup', createTenantUser);
router.post('/signin', signinTenantUser);
router.post('/change-password', changeTenantUserPassword);
router.get('/tenant/:tenant_id', getUsersByTenant);
router.put('/role/:id', updateUserRole);

module.exports = router;
