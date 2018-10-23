import express from 'express'
import {sequelize, Pedido, Usuario} from '../database'
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

    let query = {
        fecha: {
            [Op.between]: [req.body.fecha1, req.body.fecha2]
        }
    }

    if(req.body.pendiente != undefined){
        query.pendiente = req.body.pendiente
    }

    return sequelize.transaction(t => {
        return Pedido.findAll({
            where: query,
            include: [Usuario],
            transaction: t
        })
    }).return
})

export default router