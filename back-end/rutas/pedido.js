import express from 'express'
import {sequelize, Pedido, DetellePedido, Usuario} from '../database'
import error from '../funciones/error'
import Sequelize from 'sequelize'

var router = express.Router()

const Op = Sequelize.Op

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

router.post('/actualizar', (req, res) => {
    return sequelize.transaction(t => {
        return Pedido.update(req.body, {
            where:{
                id: req.body.id
            },
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

    let query = {
        fecha: {
            [Op.between]: [f1, f2]
        },
        cancelado: false,
        pendiente: req.body.pendiente
    }

    if(req.body.pendiente == null){
        query.pendiente = {
            [Op.or]: [0,1]
        }
        delete query.cancelado
    }

    return sequelize.transaction(t => {
        return Pedido.findAll({
            where: query,
            order: [['fecha', 'DESC']],
            include: [
                {
                    model: Usuario,
                    attributes:['id','cedula', 'nombre','direccion']
                }
            ],
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

router.post('/pendientes', (req, res) => {
    return sequelize.transaction(t => {
        return Pedido.count({
            where: {
                cancelado: false,
                listarPendiente: true
            },
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

router.post('/actualizar', (req, res) => {
    return sequelize.transaction(t => {
        return Pedido.update(req.body,{
            where: {
                id: req.body.id
            },
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

router.post('/cliente', (req, res) => {
    return sequelize.transaction(t => {
        return Pedido.findAll({
            where: {
                usuarioId: req.body.id
            },
            order: [['fecha', 'desc']],
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