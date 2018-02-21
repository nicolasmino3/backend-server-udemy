var express = require("express");

var jwt = require("jsonwebtoken");
var SEED = require("../config/config");
var mdAutenticacion = require("../middlewares/autenticacion");

var app = express();

// Model
var Medico = require("../models/medico");

// =============================
// Obtener todos los Medicos
// =============================
app.get("/", (req, res) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  Medico.find({})
    .populate("usuario", "nombre email")
    .populate("hospital")
    .skip(desde)
    .limit(5)
    .exec((err, medicos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          errors: err
        });
      }
      Medico.count((err, conteo) => {
        res.status(200).json({
          ok: true,
          medicos: medicos,
          total: conteo
        });
      });
    });
});
// =============================
// Actualizar Medico
// ============================

app.put("/:id", mdAutenticacion.verificarToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;
  // buscar y validar existencia del Medico a modificar
  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar Medico",
        errors: err
      });
    }
    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe Medico con ese Id",
        errors: { message: "No existe Medico con ese Id" }
      });
    }

    medico.nombre = body.nombre;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al actualizar Medico",
          errors: err
        });
      }
      res.status(200).json({
        ok: true,
        medico: medicoGuardado
      });
    });
  });
});

// =============================
// Eliminar Medico
// =============================
app.delete("/:id", mdAutenticacion.verificarToken, (req, res) => {
  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "error al eliminar Medico",
        errors: err
      });
    }
    if (!medicoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un medico con ese id.",
        errors: { message: "No existe Medico con ese id" }
      });
    }
    res.status(200).json({
      ok: true,
      medico: medicoBorrado
    });
  });
});

// =============================
// Crear Medico
// =============================
app.post("/", mdAutenticacion.verificarToken, (req, res) => {
  var body = req.body;

  var medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital
  });

  medico.save((err, medicoCreado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear el Medico",
        errors: err
      });
    }
    res.status(201).json({
      ok: true,
      medico: medicoCreado
      //usuarioToken: req.usuarioToken
    });
  });
});
module.exports = app;
