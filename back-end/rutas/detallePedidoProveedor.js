import express from 'express'
import {sequelize, Proveedor} from '../database'
import error from '../funciones/error'
import Sequelize from 'sequelize'

var router = express.Router()

const Op = Sequelize.Op

export default router