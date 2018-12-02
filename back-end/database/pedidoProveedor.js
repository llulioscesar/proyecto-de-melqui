import sequelize from './sequelize'
import Sequelize from 'sequelize'

const pedidoProveedor = sequelize.define('pedidoProveedor', {
    id:{
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    fecha:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    pendiente:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    cancelado:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'pedidoProveedor',
})

export default pedidoProveedor