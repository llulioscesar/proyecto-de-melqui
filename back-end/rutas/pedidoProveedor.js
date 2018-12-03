import express from 'express'
import {sequelize, PedidoProveedor, DetallePedidoProveedor, Producto, Proveedor} from '../database'
import error from '../funciones/error'
import Sequelize from 'sequelize'

var router = express.Router()

const Op = Sequelize.Op

router.post('/insertar', (req, res) => {
    return sequelize.transaction(t => {
        return PedidoProveedor.create(req.body, {
            transaction: t,
        })
    }).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/editar', (req, res) => {
    return PedidoProveedor.update(req.body, {
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
    return PedidoProveedor.destroy({
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

    let f1 = req.body.fecha1
    let f2 = req.body.fecha2

    if(f2 > f1){
        f1 = req.body.fecha1
        f2 = req.body.fecha2
    } else if(f1 > f2){
        f1 = req.body.fecha2
        f2 = req.body.fecha1
    }

    return PedidoProveedor.findAll({
        where:{
            fecha: {
                [Op.between]: [f1, f2]
            },
        },
        include:[Proveedor],
        order:[['id', 'DESC']]
    }).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).json(e)
    })
})

router.post('/', (req, res) => {
    return PedidoProveedor.findAll({
        where:{
            id: req.body.id
        },
        include: [
            {
                model: DetallePedidoProveedor,
                include: Producto
            }
        ]
    }).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).json(error(e))
    })
})



export default router