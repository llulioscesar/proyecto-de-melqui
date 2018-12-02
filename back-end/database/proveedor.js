import sequelize from './sequelize'
import Sequelize from 'sequelize'

const proveedor = sequelize.define('proveedor', {
    id:{
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    nit:{
        type: Sequelize.STRING(55),
        unique: true
    },
    nombre: {
        type: Sequelize.STRING(55),
        allowNull: false
    },
    correo: {
        type: Sequelize.STRING(100),
    },
    direccion: Sequelize.STRING(55),
    celular: Sequelize.STRING(20),
    deshabilitado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'proveedor',
})

export default proveedor