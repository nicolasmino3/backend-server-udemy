var express = require("express");

var app = express();

var Hospital = require("../models/hospital");
var Medico = require("../models/medico")
var Usuario = require("../models/usuario");


// =======================================
// Búsqueda por colección
// =======================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

  var tabla = req.params.tabla;
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");

  var promesa;

  switch (tabla) {
    case 'hospitales':
      promesa = busquedaHospitales(busqueda, regex);
      break;
    case 'usuarios':
      promesa = busquedaUsuarios(busqueda, regex);
      break;
    case 'medicos':
      promesa = busquedaMedicos(busqueda, regex);
      break;
    default:
     return res.status(400).json({
        ok: false,
        mensaje: 'Los tipos de búsquedas son solo: usuarios, medicos y hospitales',
        errors: { message: 'Tipo tabla/collección no valido'}
     });
      
  }

  promesa.then(
    (data) => {
      res.status(200).json({
        ok: true,
        [tabla]: data
      });
    }

  );
      
});

// =======================================
// Búsqueda General
// =======================================

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
    Hospital.find({ nombre: regex })
      .populate('usuario', 'nombre email')
      .exec((err, hospitales) => {
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
    Medico.find({ nombre: regex })
      .populate('usuario', 'nombre email')
      .populate('hospital')
      .exec((err, medicos) => {
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
    Usuario.find({}, 'nombre email role')
      .or([{ nombre: regex }, { email: regex }])
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
