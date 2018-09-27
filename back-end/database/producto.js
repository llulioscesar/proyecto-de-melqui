import sequelize from './sequelize'
import Sequelize from 'sequelize'

const producto = sequelize.define('producto', {
    id:{
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING(55),
        allowNull: false
    },
    referencia:{
        type: Sequelize.STRING(55),
        allowNull: false,
        unique: true
    },
    decripcion: Sequelize.STRING(55),
    precioCompra: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
    },
    precioVenta:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
    },
    estado:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'producto'
})

export default producto