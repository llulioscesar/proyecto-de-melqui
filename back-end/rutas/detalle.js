import express from 'express'
import {sequelize, Pedido, DetallePedido, Inventario} from '../database'
import error from '../funciones/error'
import Sequelize from 'sequelize'

var router = express.Router()

const Op = Sequelize.Op

router.post('/insertar', (req, res) => {
    return sequelize.transaction(t1 => {
        return DetallePedido.create(req.body, {
            transaction: t1
        }).then(result1 => {
            return sequelize.transaction(t2 => {
                return Inventario.findOne({
                    where: {
                        productoId: result1.productoId
                    },
                    transaction: t2
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
                        transaction: t2
                    }).then(result3 => {
                        return result1
                    })
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
            return sequelize.transaction(t2 => {
                return Inventario.findOne({
                    where: {
                        productoId: req.body.productoId
                    },
                    transaction: t2
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
                        transaction: t2
                    }).then(result3 => {
                        return result1
                    })
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

export default router