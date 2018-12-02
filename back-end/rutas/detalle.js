import express from 'express'
import {sequelize, Pedido, DetallePedido, Inventario, Producto} from '../database'
import error from '../funciones/error'
import Sequelize from 'sequelize'

var router = express.Router()

const Op = Sequelize.Op

router.post('/insertar', (req, res) => {
    return sequelize.transaction(t1 => {
        return DetallePedido.create(req.body, {
            transaction: t1
        }).then(result1 => {
            return Inventario.findOne({
                where: {
                    productoId: result1.productoId
                },
                transaction: t1
            }).then(result2 => {
                let salidas = result2.salidas + result1.cantidad
                let stock = result2.entradas - salidas
                return Inventario.update({
                    salidas: salidas,
                    stock: stock
                }, {
                    where: {
                        id: result2.id
                    },
                    transaction: t1
                }).then(result3 => {
                    return result1
                })
            })
        })
    }).then(result =>{
        res.json({
            datos: result
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/actualizar', (req, res) => {
    return sequelize.transaction(t1 => {
        return DetallePedido.update(req.body, {
            where: {
                id: req.body.id
            },
            transaction: t1
        }).then(result1 => {
             return Inventario.findOne({
                where: {
                    productoId: req.body.productoId
                },
                transaction: t1
            }).then(result2 => {
                let salidas = (result2.salidas - req.body.oldCantidad) + req.body.cantidad
                let stock = result2.entradas - salidas
                return Inventario.update({
                    salidas: salidas,
                    stock: stock
                }, {
                    where: {
                        id: result2.id
                    },
                    transaction: t1
                }).then(result3 => {
                    return result1
                })
            })
        })
    }).then(result => {
        res.json({
            datos: result
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/eliminar', (req, res) => {
    return sequelize.transaction(t1 => {
        return DetallePedido.destroy({
            where:{
                id: req.body.id
            },
            transaction: t1
        }).then(result1 => {
            return Inventario.findOne({
                where:{
                    productoId: req.body.productoId
                },
                transaction: t1
            }).then(result2 => {
                let salidas = result2.salidas - req.body.cantidad
                let stock = result2.entradas - salidas
                return Inventario.update({
                    salidas: salidas,
                    stock: stock
                }, {
                    where: {
                        id: result2.id
                    },
                    transaction: t1
                }).then(result3 => {
                    return result1
                })
            })
        })
    }).then(result => {
        res.json({
            datos: result
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/pedido', (req, res) => {
    return sequelize.transaction(t => {
        return DetallePedido.findAll({
            where: {
                pedidoId: req.body.pedido
            },
            include:[
                {
                    model: Producto,
                    attributes: ['id', 'nombre', 'referencia', 'precioVenta', 'categoria', 'descripcion']
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

router.post('/masVendido', (req,res) => {
    let f1 = req.body.fecha1
    let f2 = req.body.fecha2
    if(f1 > f2){
        f1 = req.body.fecha2
        f2 = req.body.fecha1
    }

    return sequelize.transaction(t => {
        return DetallePedido.findAll({
            where: {
                fecha:{
                    [Op.between]: [f1, f2]
                }
            },
            attributes: [
                [sequelize.fn('SUM', sequelize.col('cantidad')),'cantidad']
            ],
            include: [
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['referencia','nombre','categoria']
                },
                {
                    model: Pedido,
                    where:{
                        cancelado: false
                    },
                    attributes: []
                }
            ],
            group:['productoId'],
            order:[['cantidad', 'DESC']],
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



export default router