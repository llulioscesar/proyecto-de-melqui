import sequelize from './sequelize'
import Producto from './producto'
import Usuario from './usuario'
import Entrada from './entrada'
import Salida from './salida'
import Inventario from './inventario'
import Pedido from './pedido'
import DetallePedido from './detallePedido'


// Relacion Producto => Inventario
Producto.hasMany(Inventario, { foreignKey: 'productoId', onDelete: 'cascade' })
Inventario.belongsTo(Producto, { foreignKey: 'productoId' })

// Relacion Producto => Entradas
Producto.hasMany(Entrada, { foreignKey: 'productoId', onDelete: 'cascade' })
Entrada.belongsTo(Producto, { foreignKey: 'productoId' })

// Relacion Producto => Salidas
Producto.hasMany(Salida, { foreignKey: 'productoId', onDelete: 'cascade' })
Salida.belongsTo(Producto, { foreignKey: 'productoId' })

// Relacion Producto => DetallePedido
Producto.hasMany(DetallePedido, {foreignKey: 'productoId', onDelete: 'cascade'})
DetallePedido.belongsTo(Producto, {foreignKey: 'productoId'})

// Relacion Pedido => DetallePedido
Pedido.hasMany(DetallePedido, {foreignKey: 'pedidoId', onDelete: 'cascade'})
DetallePedido.belongsTo(Pedido, {foreignKey: 'pedidoId'})

// Relacion Usuario => Pedido
Usuario.hasMany(Pedido, {foreignKey: 'usuarioId', onDelete: 'cascade'})
Pedido.belongsTo(Usuario, {foreignKey: 'usuarioId'})

export {
    sequelize,
    Producto,
    Usuario,
    Entrada,
    Salida,
    Inventario,
    Pedido,
    DetallePedido
}