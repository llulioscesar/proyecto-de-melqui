import sequelize from './sequelize'
import Sequelize from 'sequelize'

const salida = sequelize.define('salida', {
    fecha:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'salida'
})

export default salida