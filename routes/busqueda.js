var express = require("express");

var app = express();

var Hospital = require("../models/hospital");
var Medico = require("../models/medico")
var Usuario = require("../models/usuario");

app.get("/todo/:busqueda", (req, resp, next) => {
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");

  Promise.all([
    busquedaHospitales(busqueda, regex),
    busquedaMedicos(busqueda, regex),
    busquedaUsuarios(busqueda, regex)
  ]).then(valores => {
    resp.status(200).json({
      ok: true,
      hospitales: valores[0],
      medicos: valores[1],
      usuarios: valores[2]
    });
  });
});
function busquedaHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex }, (err, hospitales) => {
      if (err) {
        reject("Hubo un error al cargar los hospitales", err);
      } else {
        resolve(hospitales);
      }
    });
  });
}
function busquedaMedicos(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex }, (err, medicos) => {
      if (err) {
        reject("Hubo un error al cargar los médicos", err);
      } else {
        resolve(medicos);
      }
    });
  });
}
function busquedaUsuarios(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Usuario.find()
      .or([{ nombre: regex}, {email: regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject("Hubo un error al cargar los usuarios", err);
        } else {
          resolve(usuarios);
        }
      });
  });
}

module.exports = app;
