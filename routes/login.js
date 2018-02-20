
var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

var app = express();

// Model
var Usuario = require("../models/usuario");
   
app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: "Error buscando usuario.",
                errors: err
              });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario - email',
                errors: { message: 'No existe usuario - email' }
            });
        }

        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error credenciales - password',
                errors: { message: 'Error credenciales - password' }
            });

        }

        // Crear token
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB}, SEED, { expiresIn: 14400}); // 4 horas.
        return res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                id: usuarioDB._id,
                token: token
            });
    });
    

});






module.exports = app;