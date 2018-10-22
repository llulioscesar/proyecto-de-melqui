import express from 'express'
import {sequelize, Pedido} from '../database'
import error from '../funciones/error'

var router = express.Router()

router.post('/insertar', async (req, res) => {
    return sequelize.transaction(t => {
        return Pedido.create(
            req.body,
            {
                transaction: t
            }
        )
    }).then(result => {
        res.json({
            datos: result
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/eliminar', (req, res) => {
    return sequelize.transaction(t => {
        return Pedido.destroy({
            where: {
                id : req.body.id
            },
            transaction: t
        })
    }).then(result => {
        res.json(
            {
                datos: result
            }
        )
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

export default router