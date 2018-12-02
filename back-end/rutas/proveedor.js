import express from 'express'
import {sequelize, Proveedor} from '../database'
import error from '../funciones/error'
import Sequelize from 'sequelize'

var router = express.Router()

const Op = Sequelize.Op

router.post('/insertar', (req, res) => {
    return Proveedor.create(req.body).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/editar', (req, res) => {
    return Proveedor.update(req.body,{
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
    return Proveedor.destroy({
        where:{
            id: req.body.id
        }
    }).then(result => {
        res.json({})
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/buscar', (req, res) => {
    return sequelize.transaction(t => {
        return Proveedor.findAll({
            where: {
                [Op.or]: {
                    nombre: {
                        [Op.like]: '%' + req.body.buscar + '%'
                    },
                    nit:{
                        [Op.like]: '%' + req.body.buscar + '%'
                    },
                    correo: {
                        [Op.like]: '%' + req.body.buscar + '%'
                    },
                    celular:{
                        [Op.like]: '%' + req.body.buscar + '%'
                    },
                    direccion: {
                        [Op.like]: '%' + req.body.buscar + '%'
                    }
                },
                rol: "Cliente"
            },
            transaction: t,
            attributes: ['id', 'nit', 'nombre', 'direccion', 'celular']
        })
    }).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/', (req, res) => {
    return sequelize.transaction(t => {
        return Proveedor.findAll()
    }).then(result => {
        res.json(result)
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

export default router