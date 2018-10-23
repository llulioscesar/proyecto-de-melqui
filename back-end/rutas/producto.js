import express from 'express'
import {sequelize, Producto, Inventario} from '../database'
import error from '../funciones/error'
import Sequelize from 'sequelize'
import moment from 'moment'
const Op = Sequelize.Op

var router = express.Router()

router.post('/insertar', (req, res) => {

    let doc = {
        id:0,
        productoId: 0,
        entradas:0,
        salidas: 0,
        stock:0,
        fecha: moment().startOf('day').unix(),
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

router.post('/actualizar', (req, res) => {
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

router.post('/eliminar', (req, res) => {
    return sequelize.transaction(t => {
        return Producto.destroy({
            where:{
                id: req.body.id
            }
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

router.post('/buscar', (req, res) => {
    return sequelize.transaction(t =>{ 
        return Producto.findAll({
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
            },
            attributes: ['id', 'referencia', 'nombre', 'categoria', 'descripcion', 'precioVenta'],
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