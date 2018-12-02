import sequelize from './sequelize'
import Producto from './producto'
import Usuario from './usuario'
import Entrada from './entrada'
import Inventario from './inventario'
import Pedido from './pedido'
import DetallePedido from './detallePedido'

import Proveedor from './proveedor'
import PedidoProveedor from './pedidoProveedor'
import DetallePedidoProveedor from './detallePedidoProveedor'


// Relacion Producto => Inventario
Producto.hasMany(Inventario, { foreignKey: 'productoId', onDelete: 'cascade' })
Inventario.belongsTo(Producto, { foreignKey: 'productoId' })

// Relacion Producto => Entradas
Producto.hasMany(Entrada, { foreignKey: 'productoId', onDelete: 'cascade' })
Entrada.belongsTo(Producto, { foreignKey: 'productoId' })

// Relacion Producto => DetallePedido
Producto.hasMany(DetallePedido, {foreignKey: 'productoId', onDelete: 'cascade'})
DetallePedido.belongsTo(Producto, {foreignKey: 'productoId'})

// Relacion Pedido => DetallePedido
Pedido.hasMany(DetallePedido, {foreignKey: 'pedidoId', onDelete: 'cascade'})
DetallePedido.belongsTo(Pedido, {foreignKey: 'pedidoId'})

// Relacion Usuario => Pedido
Usuario.hasMany(Pedido, {foreignKey: 'usuarioId', onDelete: 'cascade'})
Pedido.belongsTo(Usuario, {foreignKey: 'usuarioId'})

//****************************************************************************************** */
// Proveedor => Pedido
Proveedor.hasMany(PedidoProveedor, {foreignKey: 'proveedorId', onDelete: 'cascade'})
PedidoProveedor.belongsTo(Proveedor, {foreignKey: 'proveedorId'})

PedidoProveedor.hasMany(DetallePedidoProveedor, {foreignKey: 'pedidoProveedorId', onDelete: 'cascade'})
DetallePedidoProveedor.belongsTo(PedidoProveedor, {foreignKey: 'pedidoProveedorId'})

Producto.hasMany(DetallePedidoProveedor, {foreignKey: 'productoId', onDelete: 'cascade'})
DetallePedidoProveedor.belongsTo(Producto, {foreignKey: 'productoId'})

//****************************************************************************************** */
export {
    sequelize,
    Producto,
    Usuario,
    Entrada,
    Inventario,
    Pedido,
    DetallePedido,
    Proveedor,
    DetallePedidoProveedor,
    PedidoProveedor
}