# 📦 Mesa de Ayuda Interna

Sistema web compuesto por:

-   🖥 **Frontend:** Angular 20\
-   ⚙ **Backend:** Spring Boot\
-   🗄 **Base de Datos:** SQL Server

------------------------------------------------------------------------

# 📁 Estructura del Proyecto

    root/
    │
    ├── frontend/     → Aplicación Angular 20
    ├── backend/      → API REST Spring Boot
    └── database/     → Scripts SQL (creación de BD, tablas, datos iniciales)

------------------------------------------------------------------------

# 🚀 Requisitos Previos

## 🔹 Generales

-   Node.js (v18 o superior recomendado)
-   npm
-   Angular CLI
-   Java JDK 17 o superior
-   Maven o Gradle
-   SQL Server
-   Git

------------------------------------------------------------------------

# 🗄 Configuración de Base de Datos

1.  Abrir SQL Server Management Studio.
2.  Ejecutar los scripts ubicados en:

```{=html}
<!-- -->
```
    /database

### Ejemplo de configuración esperada

-   Host: `localhost`
-   Puerto: `1433`
-   Base de datos: `nombre_bd`
-   Usuario: `sa`
-   Password: `tu_password`

------------------------------------------------------------------------

# ⚙ Backend - Spring Boot

Ir a la carpeta:

    cd backend

## 🔹 Configurar conexión a base de datos

Editar:

    src/main/resources/application.properties

Ejemplo:

``` properties
spring.datasource.url=jdbc:sqlserver://localhost:puerto_bd;databaseName=nombre_bd;encrypt=true;trustServerCertificate=true
spring.datasource.username=tu_user
spring.datasource.password=tu_password
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

## 🔹 Ejecutar backend

### Maven

    mvn clean install
    mvn spring-boot:run

Backend disponible en:

    http://localhost:8080

------------------------------------------------------------------------

# 🖥 Frontend - Angular 20

Ir a:

    cd frontend

## 🔹 Instalar dependencias

    npm install

## 🔹 Configurar API

Editar:

    src/environments/environment.ts

Ejemplo:

``` ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080'
};
```

## 🔹 Ejecutar frontend

    ng serve

Disponible en:

    http://localhost:4200

------------------------------------------------------------------------

# 🔄 Flujo Completo

1.  Levantar SQL Server\
2.  Ejecutar scripts en `/database`\
3.  Iniciar backend\
4.  Iniciar frontend

