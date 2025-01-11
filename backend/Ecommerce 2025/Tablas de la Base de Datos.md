# Tablas de la Base de Datos

### **1. Tabla: Departamentos**

- **Descripción**: Contiene la lista de departamentos disponibles.
- **Campos**:
    - `DepartamentoID` (PK): Identificador único del departamento.
    - `Nombre`: Nombre del departamento (máx. 50 caracteres).
    - `Codigo`: Código único (máx. 5 caracteres).
    - `Activo`: Indica si el departamento está activo (1: Activo, 0: Inactivo).

---

### **2. Tabla: Ciudades**

- **Descripción**: Lista de ciudades asociadas a los departamentos.
- **Campos**:
    - `CiudadID` (PK): Identificador único de la ciudad.
    - `DepartamentoID` (FK): Relación con la tabla `Departamentos`.
    - `Nombre`: Nombre de la ciudad (máx. 50 caracteres).
    - `Codigo`: Código único (máx. 5 caracteres).
    - `TieneEnvio`: Indica si la ciudad tiene envíos (1: Sí, 0: No).
    - `Activo`: Indica si la ciudad está activa (1: Activa, 0: Inactiva).

---

### **3. Tabla: Barrios**

- **Descripción**: Lista de barrios asociados a las ciudades.
- **Campos**:
    - `BarrioID` (PK): Identificador único del barrio.
    - `CiudadID` (FK): Relación con la tabla `Ciudades`.
    - `Nombre`: Nombre del barrio (máx. 100 caracteres).
    - `CodigoPostal`: Código postal del barrio (máx. 10 caracteres).
    - `Activo`: Indica si el barrio está activo (1: Activo, 0: Inactivo).

---

### **4. Tabla: Usuarios**

- **Descripción**: Contiene la información de los usuarios registrados.
- **Campos**:
    - `UsuarioID` (PK): Identificador único del usuario.
    - `Email`: Correo electrónico único.
    - `Contraseña`: Contraseña cifrada.
    - `SaltContraseña`: Salt utilizado para la contraseña.
    - `Nombres`: Nombres del usuario.
    - `Apellidos`: Apellidos del usuario.
    - `NombreUsuario`: Nombre de usuario único.
    - `Telefono`: Teléfono del usuario.
    - `FechaNacimiento`: Fecha de nacimiento del usuario.
    - `Genero`: Género del usuario.
    - **Campos de control**:
        - `FechaCreacion`, `FechaActualizacion`, `UltimoAcceso`.
    - **Seguridad**:
        - `IntentosFallidos`, `BloqueoHasta`, `DosFactoresHabilitado`.
    - **Estado**:
        - `Activo`, `Estado` (PENDIENTE, ACTIVO, SUSPENDIDO, BANEADO).

---

### **5. Tabla: Direcciones**

- **Descripción**: Lista de direcciones de los usuarios.
- **Campos**:
    - `DireccionID` (PK): Identificador único de la dirección.
    - `UsuarioID` (FK): Relación con la tabla `Usuarios`.
    - `DepartamentoID`, `CiudadID`, `BarrioID` (FK): Relaciones con tablas correspondientes.
    - `DireccionLinea1`: Dirección principal (Ejemplo: Calle 123 # 45-67).
    - `NombreContacto`: Nombre del contacto asociado a la dirección.
    - `TelefonoContacto`: Teléfono del contacto.
    - **Control**:
        - `PredeterminadaEnvio`, `PredeterminadaFacturacion`, `Activa`.

---

### **6. Tabla: Roles**

- **Descripción**: Define roles como administrador y cliente.
- **Campos**:
    - `RolID` (PK): Identificador único del rol.
    - `Nombre`: Nombre único del rol.
    - `Descripcion`: Descripción breve del rol.
    - `Activo`: Indica si el rol está activo.

---

### **7. Tabla: Permisos**

- **Descripción**: Define los permisos disponibles en el sistema.
- **Campos**:
    - `PermisoID` (PK): Identificador único del permiso.
    - `Nombre`: Nombre único del permiso.
    - `Codigo`: Código único del permiso.
    - `Modulo`: Módulo relacionado con el permiso (e.g., USUARIOS, PRODUCTOS).
    - `Activo`: Indica si el permiso está activo.

---

### **8. Tabla: RolesPermisos**

- **Descripción**: Relación muchos a muchos entre roles y permisos.
- **Campos**:
    - `RolID` (FK): Relación con la tabla `Roles`.
    - `PermisoID` (FK): Relación con la tabla `Permisos`.
    - `AsignadoPor` (FK): ID del usuario que asignó el permiso.

---

### **9. Tabla: Categorías**

- **Descripción**: Lista de categorías principales.
- **Campos**:
    - `CategoriaID` (PK): Identificador único de la categoría.
    - `Nombre`: Nombre único de la categoría.
    - `Slug`: Identificador SEO amigable.
    - `Activo`: Indica si la categoría está activa.

---

### **10. Tabla: Subcategorías**

- **Descripción**: Lista de subcategorías asociadas a categorías.
- **Campos**:
    - `SubcategoriaID` (PK): Identificador único de la subcategoría.
    - `CategoriaID` (FK): Relación con la tabla `Categorías`.
    - `Nombre`: Nombre único de la subcategoría.
    - `Slug`: Identificador SEO amigable.
    - `Activo`: Indica si la subcategoría está activa.

---

### **11. Tabla: Productos**

- **Descripción**: Contiene los productos de la tienda.
- **Campos**:
    - `ProductoID` (PK): Identificador único del producto.
    - `CategoriaID`, `SubcategoriaID` (FK): Relaciones con tablas correspondientes.
    - `Nombre`: Nombre del producto.
    - `Slug`: Identificador SEO amigable.
    - `PrecioRegular`, `PrecioDescuento`: Precios del producto.
    - **Control**:
        - `FechaCreacion`, `FechaActualizacion`, `Activo`.

---

### **12. Tabla: Carritos**

- **Descripción**: Información de los carritos de compra.
- **Campos**:
    - `CarritoID` (PK): Identificador único del carrito.
    - `UsuarioID` (FK): Relación con la tabla `Usuarios`.
    - `Total`: Total calculado del carrito.
    - `Estado`: Estado del carrito (ACTIVO, ABANDONADO).

---

### **13. Tabla: Pedidos**

- **Descripción**: Información sobre los pedidos realizados.
- **Campos**:
    - `PedidoID` (PK): Identificador único del pedido.
    - `UsuarioID` (FK): Relación con la tabla `Usuarios`.
    - `EstadoID` (FK): Relación con la tabla `EstadosPedido`.
    - `Total`: Total del pedido.
    - `MetodoPago`, `EstadoPago`: Información del pago.

---

### **14. Tabla: Reseñas**

- **Descripción**: Opiniones y calificaciones de los productos.
- **Campos**:
    - `ReseñaID` (PK): Identificador único de la reseña.
    - `ProductoID`, `UsuarioID` (FK): Relaciones con tablas correspondientes.
    - `Calificacion`: Calificación de 1 a 5.
    - `Estado`: Estado de la reseña (PENDIENTE, APROBADA).

---

### **15. Tabla: Cupones**

- **Descripción**: Contiene los cupones de descuento.
- **Campos**:
    - `CuponID` (PK): Identificador único del cupón.
    - `Codigo`: Código único del cupón.
    - `ValorDescuento`: Valor del descuento (porcentaje o fijo).
    - `Activo`: Indica si el cupón está activo.
