import express from 'express'
import {sequelize, Producto, Inventario} from '../database'
import error from '../funciones/error'
import Sequelize from 'sequelize'

var router = express.Router()

const Op = Sequelize.Op

router.post('/', (req, res) => {
    return sequelize.transaction(t => {
        return Inventario.findAll({
            include: [Producto],
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

router.post('/existencias', (req, res) => {
    return sequelize.transaction(t => {
        return Inventario.findAll({
            attributes: ['productoId', 'stock'],
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

router.post('/listacliente', (req, res) => {
    return sequelize.transaction(t => {
        return Inventario.findAll({
            include: [Producto],
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

router.post('/buscar', (req, res) => {
    return sequelize.transaction(t =>{ 
        return Inventario.findAll({
            include: [
                {
                    model: Producto,
                    where:{
                        [Op.or]: {
                            nombre: {
                                [Op.like]: '%' + req.body.buscar + '%'
                            },
                            referencia: {
                                [Op.like]: '%' + req.body.buscar + '%'
                            },
                            categoria: {
                                [Op.like]: '%' + req.body.buscar + '%'
                            }
                        },
                        estado: false
                    }
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

export default router