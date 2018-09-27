import express from 'express'
import { sequelize, Usuario } from '../database'
import error from '../funciones/error'
var router = express.Router()

import admin from 'firebase-admin'


router.post('/insertar', (req, res) => {
    admin.auth().createUser({
        email: req.body.correo,
        phoneNumber: '+57' + req.body.celular,
        password: req.body.contraseña,
        displayName: req.body.nombre
    }).then(userRecord => {
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
                    .then(usuario => {
                        admin.auth().getUser(usuario.uid)
                            .then(userRecord => {
                                return usuario
                            })
                            .catch(error => {
                                console.log("Error fetching user data:", error);
                                error.status = 401
                                return next(error)
                            });
                    })
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

export default router