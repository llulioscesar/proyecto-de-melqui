import sequelize from './sequelize'
import Sequelize from 'sequelize'

const detallePedidoProveedor = sequelize.define('detallePedidoProveedor', {
    cantidad1:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    cantidad2:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    cargado:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'detallePedidoProveedor'
})

export default detallePedidoProveedor