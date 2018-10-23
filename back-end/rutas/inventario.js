import express from 'express'
import {sequelize, Producto, Inventario} from '../database'
import error from '../funciones/error'

var router = express.Router()

router.post('/', (req, res) => {
    return sequelize.transaction(t => {
        return Inventario.findAll({
            include: [Producto],
            transaction: t
        })
    }).then(result => {
        res.json({
            datos: result
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/existencias', (req, res) => {
    return sequelize.transaction(t => {
        return Inventario.findAll({
            attributes: ['productoId', 'stock'],
            transaction: t
        })
    }).then(result => {
        res.json({
            datos: result
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

export default router