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
    foto: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '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'
    },
    decripcion: Sequelize.STRING(55),
    categoria:{
        type: Sequelize.ENUM('Aguardiente', 'Brandy', 'Cerveza', 'Champaña', 'Especiales', 'Ginebra', 'Ron', 'Tequila', 'Vino', 'Vodka', 'Whisky'),
        allowNull: false,
        defaultValue: 'Cerveza'
    },
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