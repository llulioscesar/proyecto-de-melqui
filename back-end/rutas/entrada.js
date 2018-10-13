import express from 'express'
import { sequelize, Producto, Entrada, Inventario } from '../database'
import error from '../funciones/error'

import moment from 'moment'

var router = express.Router()

router.post('/insertar', (req, res) => {
    req.body.fecha = moment().startOf('day').unix()

    return sequelize.transaction(t => {
        return Entrada.create(req.body, {
            transaction: t
        }).then(result1 => {
            return Inventario.findOne({
                where: {
                    productoId: result1.productoId
                },
                transaction: t
            }).then(result2 => {
                let entradas = result2.entradas + result1.cantidad
                let stock = entradas - result2.salidas
                return Inventario.update({
                    entradas: entradas,
                    stock: stock
                }, {
                        where: {
                            id: result2.id
                        },
                        transaction: t
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


router.post('/actualizar', (req, res) => {
    return sequelize.transaction(t => {
        return Entrada.update({
            cantidad: req.body.cantidad
        }, {
                where: {
                    id: req.body.id
                },
                transaction: t
            }).then(result1 => {
                return Inventario.findOne({
                    where: {
                        productoId: req.body.productoId
                    },
                    transaction: t
                }).then(result2 => {
                    let entradas = (result2.entradas - req.body.cantidadOld) + req.body.cantidad
                    console.log(result2.entradas + " || " + req.body.cantidadOld + ' || ' + req.body.cantidad)
                    let stock = entradas - result2.salidas
                    return Inventario.update({
                        entradas: entradas,
                        stock: stock
                    }, {
                            where: {
                                id: result2.id
                            },
                            transaction: t
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
    return sequelize.transaction(t => {
        return Entrada.destroy({
            where:{
                id: req.body.id
            },
            transaction: t
        }).then(result1 => {
            return Inventario.findOne({
                where:{
                    productoId: req.body.productoId
                },
                transaction: t
            }).then(result2 => {
                let entradas = result2.entradas - req.body.cantidad
                let stock = entradas - result2.salidas
                return Inventario.update({
                    entradas: entradas,
                    stock: stock
                },{
                    where:{
                        id: result2.id
                    },
                    transaction: t
                }).then(result3 => {
                    return result1
                })
            })
        })
    }).then(result => {
        return res.json({
            datos: result
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/listar', (req, res) => {
    return sequelize.transaction(t => {
        return Entrada.findAll({ order: [['fecha', 'DESC']], include: [Producto], transaction: t })
    }).then(result => {
        res.json({
            datos: result
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

export default router