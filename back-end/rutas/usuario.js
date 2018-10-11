import express from 'express'
import { sequelize, Usuario } from '../database'
import error from '../funciones/error'
var router = express.Router()

import admin from 'firebase-admin'

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

export default router