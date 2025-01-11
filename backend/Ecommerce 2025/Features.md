# Gestión de Usuarios
El sistema de usuarios incluye autenticación, roles y funcionalidades avanzadas.

## Tablas relacionadas
- **Usuarios**: Información básica del usuario.
- **Roles**: Define roles como administrador y cliente.
- **UsuariosRoles**: Relación muchos a muchos.

## Endpoints
- `POST /api/auth/register`: Registro de usuario.
- `POST /api/auth/login`: Inicio de sesión.
- `GET /api/users`: Listar usuarios.

[Detalles sobre autenticación](../Backend/Authentication.md).
