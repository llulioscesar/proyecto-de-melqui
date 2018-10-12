import sequelize from './sequelize'
import Sequelize from 'sequelize'

const entrada = sequelize.define('entrada', {
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
    tableName: 'entrada'
})

export default entrada