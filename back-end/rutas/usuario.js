import express from 'express'
import { sequelize, Usuario } from '../database'
import error from '../funciones/error'
import Sequelize from 'sequelize'
var router = express.Router()

import admin from 'firebase-admin'

const Op = Sequelize.Op

router.post('/insertar', (req, res) => {
    let doc = {
        email: req.body.correo,
        phoneNumber: '+57' + req.body.celular,
        password: req.body.contraseña,
        displayName: req.body.nombre
    }
    if (req.body.celular == '') {
        delete doc.phoneNumber
    }
    admin.auth().createUser(doc).then(userRecord => {
        delete req.body.contraseña
        req.body.uid = userRecord.uid
        return sequelize.transaction(t => {
            return Usuario.create(req.body, {
                transaction: t
            })
        }).then(result => {
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => {
            admin.auth().deleteUser(req.body.uid)
            res.status(500)
                .json(error(e))
        })
    }).catch(e => {
        admin.auth().deleteUser(req.body.uid)
        res.status(500)
            .json(error(e))
    })
})

router.post('/editar', async (req, res) => {

    let doc = {
        displayName: req.body.nombre,
        email: req.body.correo,
        disabled: req.body.deshabilitado,
        phoneNumber: '+57' + req.body.celular,
        password: req.body.contraseña
    }
    if (req.body.celular == '') {
        delete doc.phoneNumber
    }
    if (req.body.contraseña == '') {
        delete doc.password
    }

    admin.auth().updateUser(req.body.uid, doc)
        .then(userRecord => {
            return sequelize.transaction(t => {
                return Usuario.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    transaction: t
                })
            }).then(result => {
                res.json({
                    datos: !!result[0]
                })
            }).catch(e => {
                res.status(500).json(error(e))
            })
        }).catch(e => {
            res.status(500).json(error(e))
        })
})

router.post('/social', (req, res) => {
    return sequelize.transaction(t => {
        return Usuario.findOne({
            where: {
                uid: req.body.uid
            },
            transaction: t
        }).then(result => {
            if (result == null) {
                return Usuario.create(req.body, t)
            } else {
                return result
            }
        })
    }).then(result => {
        res.json({
            error: false,
            datos: result
        })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/clientes', (req, res) => {
    return sequelize.transaction(t => {
        return Usuario.findAll({
            where: {
                rol: 'cliente'
            },
            transaction: t
        })
    }).then(result => {
        res.json({ datos: result })
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/eliminar', async (req, res) => {
    admin.auth().deleteUser(req.body.uid)
    .then(() => {
        return sequelize.transaction(t => {
            return Usuario.destroy({
                where:{
                    uid: req.body.uid
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
    }).catch(e => {
        res.status(500).json(error(e))
    })
})

router.post('/buscar', (req, res) => {
    return sequelize.transaction(t => {
        return Usuario.findAll({
            where: {
                [Op.or]: {
                    nombre: {
                        [Op.like]: '%' + req.body.buscar + '%'
                    },
                    cedula:{
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
            attributes: ['id', 'cedula', 'nombre']
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