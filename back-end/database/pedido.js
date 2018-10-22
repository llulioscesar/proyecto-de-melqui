import sequelize from './sequelize'
import Sequelize from 'sequelize'

const pedido = sequelize.define('pedido', {
    fecha:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    total:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    },
    pendiente:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'pedido'
})

export default pedido