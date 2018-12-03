import express from 'express'
import {sequelize, DetallePedidoProveedor, Producto} from '../database'
import error from '../funciones/error'
import Sequelize from 'sequelize'

var router = express.Router()

const Op = Sequelize.Op


router.post('/insertar', (req, res) => {
    return DetallePedidoProveedor.bulkCreate(req.body.e).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/editar', (req, res) => {
    return DetallePedidoProveedor.update(req.body, {
        where: {
            id: req.body.id
        }
    }).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/eliminar', (req, res) => {
    return DetallePedidoProveedor.destroy({
        where: {
            id: req.body.id
        }
    }).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/listar', (req, res) => {
    return DetallePedidoProveedor.findAll({
        where:{
            pedidoProveedorId: req.body.id
        },
        include: [Producto]
    }).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

export default router