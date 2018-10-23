import sequelize from './sequelize'
import Sequelize from 'sequelize'

const detallePedido = sequelize.define('detallePedido', {
    fecha:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    precio:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue:0
    },
    cantidad:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    total:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue:0
    }
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'detallePedido'
})

export default detallePedido