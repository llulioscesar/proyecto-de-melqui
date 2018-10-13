import express from 'express'
import {sequelize, Producto, Inventario} from '../database'
import error from '../funciones/error'

import moment from 'moment'

var router = express.Router()

router.post('/insertar', async(req, res) => {

    let doc = {
        id:0,
        productoId: 0,
        entradas:0,
        salidas: 0,
        stock:0,
        fecha: 1212121,
        producto:[req.body]
    }

    return sequelize.transaction(t => {
        return Inventario.create(doc, {include: [Producto], transaction: t})
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

router.get('/stock', (req, res) => {
    return sequelize.transaction(t => {
        return Inventario.findAll({include:[Producto], transaction: t})
    }).then(result => {
        res.json(result)
    })
})

export default router