const { dbConection } = require("../database/config");
const express = require("express");
const cors = require("cors");
const { defaulUser} = require("../controllers/user");
const { defaultAdmin} = require("../controllers/adminUser");

//const {crearRoles} = require("../middlewares/roles")

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {

      auth: '/api/auth',
      adminUsers: "/api/adminUsers",
      users: "/api/users",
      account: "/api/accounts",
      divisa: "/api/divisa",
      transaction: '/api/transactions',
      favorite: '/api/favorites'
    };
    //conectar DB
    this.conectarDB();

    //middlewares
    this.middlewares();

    //rutas de la app
    this.routes();

   // defaultAdmin();
    defaultAdmin();
    
  }
  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del Body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static("public"));
  }
  //Función de conexión
  async conectarDB() {
    await dbConection();
  }

  
  routes() {
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.adminUsers, require("../routes/adminUser"));
    this.app.use(this.paths.users, require("../routes/user"));
    this.app.use(this.paths.account, require("../routes/account"));
    this.app.use(this.paths.divisa, require("../routes/divisa"));
    this.app.use(this.paths.transaction, require('../routes/transactions'));
    this.app.use(this.paths.favorite, require("../routes/favorite"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto ", this.port);
    });
  }
}
//Importamos la clase Server
module.exports = Server;
