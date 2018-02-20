
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

module.exports.verificarToken = function(req,res,next) {

    var token = req.query.token;

    // verificar el token
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
              ok: false,
              mensaje: "token incorrecto",
              errors: err
            });
          }
          req.usuarioToken = decoded.usuario;
          
          next();
    })
};