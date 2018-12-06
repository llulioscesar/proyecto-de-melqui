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
    total:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'pedidoProveedor',
})

export default pedidoProveedor