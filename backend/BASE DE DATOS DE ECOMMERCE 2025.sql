CREATE DATABASE Ecommerce

USE Ecommerce


CREATE TABLE Departamentos (
    DepartamentoID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
    Codigo VARCHAR(5) NOT NULL,
    Activo BIT DEFAULT 1
)

-- Tabla de Ciudades
CREATE TABLE Ciudades (
    CiudadID INT PRIMARY KEY IDENTITY(1,1),
    DepartamentoID INT NOT NULL,
    Nombre VARCHAR(50) NOT NULL,
    Codigo VARCHAR(5) NOT NULL,
    TieneEnvio BIT DEFAULT 1,
    Activo BIT DEFAULT 1,
    FOREIGN KEY (DepartamentoID) REFERENCES Departamentos(DepartamentoID)
)

-- Tabla de Barrios
CREATE TABLE Barrios (
    BarrioID INT PRIMARY KEY IDENTITY(1,1),
    CiudadID INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    CodigoPostal VARCHAR(10),
    Activo BIT DEFAULT 1,
    FOREIGN KEY (CiudadID) REFERENCES Ciudades(CiudadID)
)

-- Tabla de Usuarios
CREATE TABLE Usuarios (
    UsuarioID INT PRIMARY KEY IDENTITY(1,1),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Contrase�a VARCHAR(255) NOT NULL,
    SaltContrase�a VARCHAR(255) NOT NULL,
    Nombres VARCHAR(50) NOT NULL,
    Apellidos VARCHAR(50) NOT NULL,
    NombreUsuario VARCHAR(50) UNIQUE NOT NULL,
    Telefono VARCHAR(20),
    FechaNacimiento DATE,
    Genero VARCHAR(20),
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaActualizacion DATETIME,
    UltimoAcceso DATETIME,
    UltimoCambioContrase�a DATETIME,
    IntentosFallidos INT DEFAULT 0,
    BloqueoHasta DATETIME,
    EmailConfirmado BIT DEFAULT 0,
    TelefonoConfirmado BIT DEFAULT 0,
    DosFactoresHabilitado BIT DEFAULT 0,
    Activo BIT DEFAULT 1,
    Estado VARCHAR(20) DEFAULT 'PENDIENTE', -- PENDIENTE, ACTIVO, SUSPENDIDO, BANEADO
    IdiomaPreferido VARCHAR(10) DEFAULT 'es',
    ZonaHoraria VARCHAR(50) DEFAULT 'America/Bogota',
    TokenVerificacion VARCHAR(100),
    TokenRecuperacion VARCHAR(100),
    VenceTokenRecuperacion DATETIME,
    AceptoTerminos BIT DEFAULT 0,
    FechaAceptacionTerminos DATETIME,
    FechaEliminacion DATETIME,
    Eliminado BIT DEFAULT 0
)

-- Tabla de Direcciones
CREATE TABLE Direcciones (
    DireccionID INT PRIMARY KEY IDENTITY(1,1),
    UsuarioID INT NOT NULL,
    TipoDireccion VARCHAR(20) NOT NULL DEFAULT 'ENVIO', -- ENVIO, FACTURACION, AMBOS
    DepartamentoID INT NOT NULL,
    CiudadID INT NOT NULL,
    BarrioID INT,
    DireccionLinea1 VARCHAR(100) NOT NULL, -- Ejemplo: Calle 123 # 45-67
    DireccionLinea2 VARCHAR(100), -- Ejemplo: Edificio/Conjunto/Unidad
    NumeroInterior VARCHAR(20), -- Ejemplo: Apto 123, Casa 5
    Referencia VARCHAR(255), -- Punto de referencia
	CodigoPostal NVARCHAR(10),
    NombreContacto VARCHAR(100) NOT NULL,
    TelefonoContacto VARCHAR(20) NOT NULL,
    TelefonoContacto2 VARCHAR(20), -- Tel�fono alternativo
    PredeterminadaEnvio BIT DEFAULT 0,
    PredeterminadaFacturacion BIT DEFAULT 0,
    Verificada BIT DEFAULT 0,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaActualizacion DATETIME,
    UltimoUso DATETIME,
    Activa BIT DEFAULT 1,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID),
    FOREIGN KEY (DepartamentoID) REFERENCES Departamentos(DepartamentoID),
    FOREIGN KEY (CiudadID) REFERENCES Ciudades(CiudadID),
    FOREIGN KEY (BarrioID) REFERENCES Barrios(BarrioID)
)

-- Tabla de Roles
CREATE TABLE Roles (
    RolID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Descripcion VARCHAR(255),
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaActualizacion DATETIME,
    Activo BIT DEFAULT 1
)

-- Tabla de Permisos
CREATE TABLE Permisos (
    PermisoID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Codigo VARCHAR(50) NOT NULL UNIQUE,
    Descripcion VARCHAR(255),
    Modulo VARCHAR(50) NOT NULL, -- USUARIOS, PRODUCTOS, PEDIDOS, etc.
    FechaCreacion DATETIME DEFAULT GETDATE(),
    Activo BIT DEFAULT 1
)

-- Tabla de Roles y Permisos (Relaci�n muchos a muchos)
CREATE TABLE RolesPermisos (
    RolID INT,
    PermisoID INT,
    FechaAsignacion DATETIME DEFAULT GETDATE(),
    AsignadoPor INT, -- ID del usuario que asign� el permiso
    PRIMARY KEY (RolID, PermisoID),
    FOREIGN KEY (RolID) REFERENCES Roles(RolID),
    FOREIGN KEY (PermisoID) REFERENCES Permisos(PermisoID),
    FOREIGN KEY (AsignadoPor) REFERENCES Usuarios(UsuarioID)
)

-- Tabla de Usuarios y Roles (Relaci�n muchos a muchos)
CREATE TABLE UsuariosRoles (
    UsuarioID INT,
    RolID INT,
    FechaAsignacion DATETIME DEFAULT GETDATE(),
    AsignadoPor INT, -- ID del usuario que asign� el rol
    FechaExpiracion DATETIME NULL, -- Para roles temporales
    Activo BIT DEFAULT 1,
    PRIMARY KEY (UsuarioID, RolID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID),
    FOREIGN KEY (RolID) REFERENCES Roles(RolID),
    FOREIGN KEY (AsignadoPor) REFERENCES Usuarios(UsuarioID)
)

-- Tabla de Categor�as Principales
CREATE TABLE Categorias (
    CategoriaID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Slug VARCHAR(100) NOT NULL UNIQUE,
    ImagenURL VARCHAR(255),
    IconoURL VARCHAR(255),
    MetaTitle VARCHAR(100),
    MetaDescription VARCHAR(255),
    OrdenVisualizacion INT DEFAULT 0,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaActualizacion DATETIME,
    CreadoPor INT,
    Activo BIT DEFAULT 1
)

-- Tabla de Subcategor�as
CREATE TABLE Subcategorias (
    SubcategoriaID INT PRIMARY KEY IDENTITY(1,1),
    CategoriaID INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Slug VARCHAR(100) NOT NULL UNIQUE,
    ImagenURL VARCHAR(255),
    IconoURL VARCHAR(255),
    MetaTitle VARCHAR(100),
    MetaDescription VARCHAR(255),
    OrdenVisualizacion INT DEFAULT 0,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaActualizacion DATETIME,
    CreadoPor INT,
    Activo BIT DEFAULT 1,
    FOREIGN KEY (CategoriaID) REFERENCES Categorias(CategoriaID)
)

-- �ndices
CREATE INDEX IX_Subcategorias_CategoriaID ON Subcategorias(CategoriaID)
CREATE INDEX IX_Categorias_Slug ON Categorias(Slug)
CREATE INDEX IX_Subcategorias_Slug ON Subcategorias(Slug)

-- Insertar Categor�as principales
INSERT INTO Categorias (Nombre, Descripcion, Slug) VALUES 
('Hombre', 'Ropa para hombre', 'hombre'),
('Mujer', 'Ropa para mujer', 'mujer'),
('Ni�os', 'Ropa para ni�os', 'ninos'),
('Ni�as', 'Ropa para ni�as', 'ninas'),
('Accesorios', 'Accesorios de moda', 'accesorios'),
('Calzado', 'Todo tipo de calzado', 'calzado')

-- Insertar Subcategor�as
INSERT INTO Subcategorias (CategoriaID, Nombre, Descripcion, Slug) VALUES 
-- Subcategor�as Hombre (CategoriaID = 1)
(1, 'Camisetas', 'Camisetas y polos para hombre', 'camisetas-hombre'),
(1, 'Pantalones', 'Pantalones y jeans para hombre', 'pantalones-hombre'),
(1, 'Camisas', 'Camisas formales e informales', 'camisas-hombre'),
(1, 'Buzos', 'Buzos y sweaters para hombre', 'buzos-hombre'),
(1, 'Chaquetas', 'Chaquetas y abrigos para hombre', 'chaquetas-hombre'),
(1, 'Ropa Deportiva', 'Ropa deportiva para hombre', 'deportiva-hombre'),
(1, 'Ropa Interior', 'Ropa interior y pijamas', 'interior-hombre'),

-- Subcategor�as Mujer (CategoriaID = 2)
(2, 'Blusas', 'Blusas y tops para mujer', 'blusas-mujer'),
(2, 'Pantalones', 'Pantalones y jeans para mujer', 'pantalones-mujer'),
(2, 'Vestidos', 'Vestidos para mujer', 'vestidos'),
(2, 'Faldas', 'Faldas para mujer', 'faldas'),
(2, 'Buzos', 'Buzos y sweaters para mujer', 'buzos-mujer'),
(2, 'Chaquetas', 'Chaquetas y abrigos para mujer', 'chaquetas-mujer'),
(2, 'Ropa Deportiva', 'Ropa deportiva para mujer', 'deportiva-mujer'),
(2, 'Ropa Interior', 'Ropa interior y pijamas', 'interior-mujer')

-- Tabla de Marcas
CREATE TABLE Marcas (
    MarcaID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Logo VARCHAR(255),
    Slug VARCHAR(100) UNIQUE NOT NULL,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    Activo BIT DEFAULT 1
)

-- Tabla de Colores
CREATE TABLE Colores (
    ColorID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
    CodigoHexadecimal VARCHAR(7), -- Ejemplo: #FF0000
    Activo BIT DEFAULT 1
)

-- Tabla de Tallas
CREATE TABLE Tallas (
    TallaID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(20) NOT NULL, -- S, M, L, XL, etc.
    Descripcion VARCHAR(100),
    OrdenVisualizacion INT,
    Activo BIT DEFAULT 1
)

-- Tabla Principal de Productos
CREATE TABLE Productos (
    ProductoID INT PRIMARY KEY IDENTITY(1,1),
    CategoriaID INT NOT NULL,
    SubcategoriaID INT NOT NULL,
    MarcaID INT,
    Codigo VARCHAR(50) UNIQUE NOT NULL,
    Nombre VARCHAR(200) NOT NULL,
    Descripcion TEXT,
    Slug VARCHAR(255) UNIQUE NOT NULL,
    PrecioRegular DECIMAL(10,2) NOT NULL,
    PrecioDescuento DECIMAL(10,2),
    PorcentajeDescuento DECIMAL(5,2),
    Genero VARCHAR(20), -- Hombre, Mujer, Unisex, Ni�o, Ni�a
    Material VARCHAR(100),
    PaisOrigen VARCHAR(100),
    Peso DECIMAL(6,2),
    MetaTitle VARCHAR(100),
    MetaDescription VARCHAR(255),
    Destacado BIT DEFAULT 0,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaActualizacion DATETIME,
    CreadoPor INT,
    Activo BIT DEFAULT 1,
    FOREIGN KEY (CategoriaID) REFERENCES Categorias(CategoriaID),
    FOREIGN KEY (SubcategoriaID) REFERENCES Subcategorias(SubcategoriaID),
    FOREIGN KEY (MarcaID) REFERENCES Marcas(MarcaID)
)

-- Tabla de Variantes de Productos (Tallas y Colores)
CREATE TABLE ProductoVariantes (
    VarianteID INT PRIMARY KEY IDENTITY(1,1),
    ProductoID INT NOT NULL,
    TallaID INT NOT NULL,
    ColorID INT NOT NULL,
    SKU VARCHAR(50) UNIQUE NOT NULL,
    Stock INT DEFAULT 0,
    StockMinimo INT DEFAULT 5,
    PrecioAdicional DECIMAL(10,2) DEFAULT 0, -- Precio adicional por variante si aplica
    Estado VARCHAR(20) DEFAULT 'ACTIVO', -- ACTIVO, AGOTADO, DESCONTINUADO
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID),
    FOREIGN KEY (TallaID) REFERENCES Tallas(TallaID),
    FOREIGN KEY (ColorID) REFERENCES Colores(ColorID)
)

-- Tabla de Im�genes de Productos
CREATE TABLE ProductoImagenes (
    ImagenID INT PRIMARY KEY IDENTITY(1,1),
    ProductoID INT NOT NULL,
    ColorID INT, -- Para im�genes espec�ficas de un color
    URL VARCHAR(255) NOT NULL,
    EsPrincipal BIT DEFAULT 0,
    OrdenVisualizacion INT DEFAULT 0,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    Activo BIT DEFAULT 1,
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID),
    FOREIGN KEY (ColorID) REFERENCES Colores(ColorID)
)

-- Tabla de Etiquetas de Productos
CREATE TABLE ProductoEtiquetas (
    ProductoID INT,
    Etiqueta VARCHAR(50),
    PRIMARY KEY (ProductoID, Etiqueta),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
)

-- Insertar datos de ejemplo
INSERT INTO Marcas (Nombre, Slug) VALUES 
('Nike', 'nike'),
('Adidas', 'adidas'),
('Puma', 'puma'),
('Levis', 'levis'),
('Zara', 'zara')

INSERT INTO Colores (Nombre, CodigoHexadecimal) VALUES 
('Negro', '#000000'),
('Blanco', '#FFFFFF'),
('Rojo', '#FF0000'),
('Azul', '#0000FF'),
('Gris', '#808080')

INSERT INTO Tallas (Nombre, OrdenVisualizacion) VALUES 
('XS', 1),
('S', 2),
('M', 3),
('L', 4),
('XL', 5),
('XXL', 6)

-- Tabla de Carritos
CREATE TABLE Carritos (
    CarritoID INT PRIMARY KEY IDENTITY(1,1),
    UsuarioID INT,
    SessionID VARCHAR(100), -- Para usuarios no registrados
    SubTotal DECIMAL(10,2) DEFAULT 0,
    ImpuestosTotal DECIMAL(10,2) DEFAULT 0,
    DescuentoTotal DECIMAL(10,2) DEFAULT 0,
    Total DECIMAL(10,2) DEFAULT 0,
    CuponAplicado VARCHAR(50),
    FechaCreacion DATETIME DEFAULT GETDATE(),
    UltimaActualizacion DATETIME,
    Estado VARCHAR(20) DEFAULT 'ACTIVO', -- ACTIVO, ABANDONADO, CONVERTIDO
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
)

-- Tabla de Items del Carrito
CREATE TABLE CarritoItems (
    CarritoItemID INT PRIMARY KEY IDENTITY(1,1),
    CarritoID INT NOT NULL,
    ProductoID INT NOT NULL,
    VarianteID INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    SubTotal DECIMAL(10,2) NOT NULL,
    Descuento DECIMAL(10,2) DEFAULT 0,
    Total DECIMAL(10,2) NOT NULL,
    FechaAgregado DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CarritoID) REFERENCES Carritos(CarritoID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID),
    FOREIGN KEY (VarianteID) REFERENCES ProductoVariantes(VarianteID)
)

-- Tabla de Tipos de Cupones
CREATE TABLE TiposCupon (
    TipoCuponID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(255)
)

-- Tabla Principal de Cupones
CREATE TABLE Cupones (
    CuponID INT PRIMARY KEY IDENTITY(1,1),
    TipoCuponID INT,
    Codigo VARCHAR(50) UNIQUE NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    TipoDescuento VARCHAR(20) NOT NULL, -- PORCENTAJE, FIJO
    ValorDescuento DECIMAL(10,2) NOT NULL,
    MontoMinimo DECIMAL(10,2),
    MontoMaxDescuento DECIMAL(10,2), -- Para descuentos porcentuales
    FechaInicio DATETIME NOT NULL,
    FechaFin DATETIME NOT NULL,
    LimiteUso INT, -- N�mero m�ximo de usos totales
    LimiteUsuario INT DEFAULT 1, -- Usos por usuario
    UsosActuales INT DEFAULT 0,
    RequiereUsuarioRegistrado BIT DEFAULT 1,
    AplicaCategorias VARCHAR(MAX), -- IDs de categor�as separados por comas
    AplicaProductos VARCHAR(MAX), -- IDs de productos separados por comas
    ExcluyeCategorias VARCHAR(MAX), -- IDs de categor�as excluidas
    ExcluyeProductos VARCHAR(MAX), -- IDs de productos excluidos
    FechaCreacion DATETIME DEFAULT GETDATE(),
    CreadoPor INT,
    Activo BIT DEFAULT 1,
    FOREIGN KEY (TipoCuponID) REFERENCES TiposCupon(TipoCuponID),
    FOREIGN KEY (CreadoPor) REFERENCES Usuarios(UsuarioID)
)

-- Tabla de Cupones aplicados al Carrito
CREATE TABLE CarritoCupones (
    CarritoID INT,
    CuponID INT,
    MontoDescuento DECIMAL(10,2),
    FechaAplicado DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (CarritoID, CuponID),
    FOREIGN KEY (CarritoID) REFERENCES Carritos(CarritoID),
    FOREIGN KEY (CuponID) REFERENCES Cupones(CuponID)
)

-- Insertar Tipos de Cup�n
INSERT INTO TiposCupon (Nombre, Descripcion) VALUES 
('Descuento General', 'Descuento aplicable a toda la tienda'),
('Descuento Categor�a', 'Descuento aplicable a categor�as espec�ficas'),
('Descuento Producto', 'Descuento aplicable a productos espec�ficos'),
('Primera Compra', 'Descuento para primera compra de usuarios'),
('Cliente Frecuente', 'Descuento para clientes frecuentes')

-- Tabla de Estados de Pedido
CREATE TABLE EstadosPedido (
    EstadoID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(255),
    ColorHex VARCHAR(7),
    OrdenVisualizacion INT
)

-- Tabla Principal de Pedidos
CREATE TABLE Pedidos (
    PedidoID INT PRIMARY KEY IDENTITY(1,1),
    NumeroPedido VARCHAR(20) UNIQUE NOT NULL,
    UsuarioID INT NOT NULL,
    EstadoID INT NOT NULL,
    CarritoID INT,
    
    -- Informaci�n de Facturaci�n
    NombreFacturacion VARCHAR(100),
    DireccionFacturacion VARCHAR(255),
    CiudadFacturacion VARCHAR(100),
    DepartamentoFacturacion VARCHAR(100),
    TelefonoFacturacion VARCHAR(20),
    
    -- Informaci�n de Env�o
    NombreEnvio VARCHAR(100),
    DireccionEnvio VARCHAR(255),
    CiudadEnvio VARCHAR(100),
    DepartamentoEnvio VARCHAR(100),
    TelefonoEnvio VARCHAR(20),
    
    -- Totales
    SubTotal DECIMAL(10,2) NOT NULL,
    ImpuestosTotal DECIMAL(10,2) NOT NULL,
    CostoEnvio DECIMAL(10,2) NOT NULL,
    DescuentoTotal DECIMAL(10,2) DEFAULT 0,
    Total DECIMAL(10,2) NOT NULL,
    
    -- Informaci�n de Pago
    MetodoPago VARCHAR(50),
    EstadoPago VARCHAR(50),
    ReferenciaPago VARCHAR(100),
    
    -- Informaci�n de Env�o
    MetodoEnvio VARCHAR(50),
    NumeroGuia VARCHAR(50),
    EmpresaEnvio VARCHAR(100),
    
    -- Fechas
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaActualizacion DATETIME,
    FechaPago DATETIME,
    FechaEnvio DATETIME,
    FechaEntrega DATETIME,
    
    -- Control
    Notas TEXT,
    NotasInternas TEXT,
    CreadoPor INT,
    IP VARCHAR(50),
    UserAgent VARCHAR(255),
    
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID),
    FOREIGN KEY (EstadoID) REFERENCES EstadosPedido(EstadoID),
    FOREIGN KEY (CarritoID) REFERENCES Carritos(CarritoID)
)

-- Tabla de Detalles de Pedido
CREATE TABLE PedidoDetalles (
    PedidoDetalleID INT PRIMARY KEY IDENTITY(1,1),
    PedidoID INT NOT NULL,
    ProductoID INT NOT NULL,
    VarianteID INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    SubTotal DECIMAL(10,2) NOT NULL,
    Descuento DECIMAL(10,2) DEFAULT 0,
    Total DECIMAL(10,2) NOT NULL,
    Estado VARCHAR(50) DEFAULT 'PENDIENTE', -- PENDIENTE, ENVIADO, DEVUELTO
    FOREIGN KEY (PedidoID) REFERENCES Pedidos(PedidoID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID),
    FOREIGN KEY (VarianteID) REFERENCES ProductoVariantes(VarianteID)
)

-- Tabla de Historial de Estados
CREATE TABLE PedidoHistorial (
    HistorialID INT PRIMARY KEY IDENTITY(1,1),
    PedidoID INT NOT NULL,
    EstadoID INT NOT NULL,
    Comentario TEXT,
    CreadoPor INT,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (PedidoID) REFERENCES Pedidos(PedidoID),
    FOREIGN KEY (EstadoID) REFERENCES EstadosPedido(EstadoID),
    FOREIGN KEY (CreadoPor) REFERENCES Usuarios(UsuarioID)
)

-- Insertar Estados de Pedido
INSERT INTO EstadosPedido (Nombre, Descripcion, ColorHex, OrdenVisualizacion) VALUES 
('Pendiente', 'Pedido creado, esperando pago', '#FFA500', 1),
('Pagado', 'Pago confirmado', '#FFFF00', 2),
('En Proceso', 'Preparando pedido', '#00FF00', 3),
('En Camino', 'Pedido en ruta de entrega', '#0000FF', 4),
('Entregado', 'Pedido entregado al cliente', '#008000', 5),
('Cancelado', 'Pedido cancelado', '#FF0000', 6),
('Devuelto', 'Pedido devuelto', '#800080', 7)

-- Tabla Principal de Rese�as
CREATE TABLE Rese�as (
    Rese�aID INT PRIMARY KEY IDENTITY(1,1),
    ProductoID INT NOT NULL,
    UsuarioID INT NOT NULL,
    PedidoID INT,
    Calificacion INT CHECK (Calificacion BETWEEN 1 AND 5),
    Titulo VARCHAR(100),
    Comentario TEXT,
    Recomendado BIT DEFAULT 1,
    
    -- Caracter�sticas espec�ficas para ropa
    CalificacionTalla INT CHECK (CalificacionTalla BETWEEN 1 AND 5),
    CalificacionCalidad INT CHECK (CalificacionCalidad BETWEEN 1 AND 5),
    ComentarioTalla VARCHAR(50), -- "Talla m�s grande", "Talla m�s peque�a", "Talla exacta"
    TallaComprada VARCHAR(20),
    
    -- Control y Moderaci�n
    Estado VARCHAR(20) DEFAULT 'PENDIENTE', -- PENDIENTE, APROBADA, RECHAZADA
    Verificada BIT DEFAULT 0, -- Compra verificada
    Reportada BIT DEFAULT 0,
    MotivoRechazo VARCHAR(255),
    
    -- M�tricas
    MeGusta INT DEFAULT 0,
    NoMeGusta INT DEFAULT 0,
    
    -- Fechas
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaModeracion DATETIME,
    FechaActualizacion DATETIME,
    
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID),
    FOREIGN KEY (PedidoID) REFERENCES Pedidos(PedidoID)
)

-- Tabla de Im�genes de Rese�as
CREATE TABLE Rese�aImagenes (
    ImagenID INT PRIMARY KEY IDENTITY(1,1),
    Rese�aID INT NOT NULL,
    ImagenURL VARCHAR(255) NOT NULL,
    OrdenVisualizacion INT DEFAULT 0,
    Activa BIT DEFAULT 1,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (Rese�aID) REFERENCES Rese�as(Rese�aID)
)

-- Tabla de Votos de Rese�as
CREATE TABLE Rese�aVotos (
    Rese�aID INT,
    UsuarioID INT,
    TipoVoto BIT, -- 1: Me gusta, 0: No me gusta
    FechaVoto DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (Rese�aID, UsuarioID),
    FOREIGN KEY (Rese�aID) REFERENCES Rese�as(Rese�aID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
)

-- Tabla de Reportes de Rese�as
CREATE TABLE Rese�aReportes (
    ReporteID INT PRIMARY KEY IDENTITY(1,1),
    Rese�aID INT NOT NULL,
    UsuarioID INT NOT NULL,
    MotivoReporte VARCHAR(50) NOT NULL,
    Comentario TEXT,
    Estado VARCHAR(20) DEFAULT 'PENDIENTE', -- PENDIENTE, REVISADO, RESUELTO
    FechaReporte DATETIME DEFAULT GETDATE(),
    FechaResolucion DATETIME,
    FOREIGN KEY (Rese�aID) REFERENCES Rese�as(Rese�aID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
)
