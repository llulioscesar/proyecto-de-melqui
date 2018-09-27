import sequelize from './sequelize'
import Sequelize from 'sequelize'

const usuario = sequelize.define('usuario', {
    id:{
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    cedula:{
        type: Sequelize.STRING(55),
        unique: true
    },
    nombre: {
        type: Sequelize.STRING(55),
        allowNull: false
    },
    correo: {
        type: Sequelize.STRING(100),
        unique: true
    },
    correoVerificado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    direccion: Sequelize.STRING(55),
    celular: Sequelize.STRING(20),
    fotoURL: Sequelize.STRING(255),
    deshabilitado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    uid: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
    },
    rol:{
        type: Sequelize.ENUM('admin', 'cliente'),
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'usuario',
})

export default usuario