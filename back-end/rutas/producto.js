import express from 'express'
import {sequelize, Producto} from '../database'
import error from '../funciones/error'
var router = express.Router()

router.post('/insertar', async(req, res) => {
    return sequelize.transaction(t => {
        return Producto.create(req.body, {transaction: t})
    }).then(result => {
        res.json({
            error: false,
            datos: result
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/actualizar', async(req, res) => {
    return sequelize.transaction(t => {
        return Producto.update(req.body, {
            where: {
                id: req.body.id
            }
        }, {transaction: t})
    }).then(result => {
        res.json({
            error: false,
            datos: !!result[0]
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/listar', async(req, res) => {
    return sequelize.transaction(t => {
        return Producto.findAll({transaction: t})
    }).then(result => {
        res.json({
            error: false,
            datos: result
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

export default router