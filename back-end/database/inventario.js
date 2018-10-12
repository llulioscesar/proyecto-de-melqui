import sequelize from './sequelize'
import Sequelize from 'sequelize'

const inventario = sequelize.define('inventario', {
    fecha:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    entradas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    salidas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'inventario'
})

export default inventario