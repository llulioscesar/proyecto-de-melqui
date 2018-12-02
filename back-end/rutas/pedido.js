import express from 'express'
import {sequelize, Pedido, DetallePedido, Usuario, Producto} from '../database'
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
                    attributes:['id','cedula', 'nombre','direccion', 'celular']
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
                pendiente: true
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

router.post('/masComprador', (req,res) => {
    let f1 = req.body.fecha1
    let f2 = req.body.fecha2
    if(f1 > f2){
        f1 = req.body.fecha2
        f2 = req.body.fecha1
    }

    return sequelize.transaction(t => {
        return Pedido.findAll({
            where: {
                fecha:{
                    [Op.between]: [f1, f2]
                },
                cancelado: false
            },
            attributes: [
                'id',
                //'fecha',
                //[sequelize.fn('COUNT', sequelize.col('usuarioId')),'cantidad']
            ],
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id','nombre']
                },
            ],
            //group:['usuarioId'],
            order:[['id', 'DESC']],
            //order: sequelize.literal('cantidad DESC'),
            limit: 10,
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

router.post('/total', (req,res) => {
    let f1 = req.body.fecha1
    let f2 = req.body.fecha2
    if(f1 > f2){
        f1 = req.body.fecha2
        f2 = req.body.fecha1
    }

    return sequelize.transaction(t => {
        return Pedido.findAll({
            where: {
                fecha:{
                    [Op.between]: [f1, f2]
                },
                cancelado: false
            },
            attributes: [
                'fecha',
                [sequelize.fn('SUM', sequelize.col('total')),'total']
            ],
            group:['fecha'],
            order:[['total', 'DESC']],
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

router.post('/reporte/comprador', (req, res) => {
    return Pedido.findAll({
        where: {
            id: {
                [Op.in]: req.body.ids
            }
        },
        include: [
            {
                model: DetallePedido,
                include:[
                    {
                        model: Producto,
                        attributes: [
                            'nombre',
                            'referencia',
                            'id'
                        ]
                    }
                ]
            },
            {
                model: Usuario
            }
        ],
        order:[['fecha', 'DESC']]
    }).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

export default router