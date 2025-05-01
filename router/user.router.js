const express = require ('express')
const router = express.Router()
const CONTROLLER = require('../controllers/user.controleur')
const verifieToken = require('../middlewares/auth')

router.post('/register',CONTROLLER.signup)
router.post('/sign',CONTROLLER.signin)
router.get('/all',CONTROLLER.getAllUseurs)
router.post('/logout', verifieToken, CONTROLLER.logout)
router.put('/update/:id',CONTROLLER.updateUser)
router.delete('/delete/:id',CONTROLLER.deleteUser)

module.exports= router