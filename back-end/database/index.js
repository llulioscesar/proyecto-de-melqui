import sequelize from './sequelize'
import Producto from './producto'
import Usuario from './usuario'
import Entrada from './entrada'
import Salida from './salida'
import Inventario from './inventario'


// Relacion Producto => Inventario
Producto.hasMany(Inventario, { foreignKey: 'productoId', onDelete: 'cascade' })
Inventario.belongsTo(Producto, { foreignKey: 'productoId' })

// Relacion Producto => Entradas
Producto.hasMany(Entrada, { foreignKey: 'productoId', onDelete: 'cascade' })
Entrada.belongsTo(Producto, { foreignKey: 'productoId' })

// Relacion Producto => Salidas
Producto.hasMany(Salida, { foreignKey: 'productoId', onDelete: 'cascade' })
Salida.belongsTo(Producto, { foreignKey: 'productoId' })

export {
    sequelize,
    Producto,
    Usuario,
    Entrada,
    Salida,
    Inventario
}