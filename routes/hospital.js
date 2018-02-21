var express = require('express');

var jwt = require("jsonwebtoken");
var SEED = require("../config/config");
var mdAutenticacion = require("../middlewares/autenticacion");

var app = express();

// Model
var Hospital = require("../models/hospital");

// =============================
// Obtener todos los hospitales
// =============================
app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({})
    .populate('usuario', 'nombre email')
    .skip(desde)
    .limit(5)
    .exec(
     (err,hospitales) =>{
        if(err){
            return res.status(500).json({
                ok:false,
                errors: err
            });
        }
        Hospital.count((err,conteo) => {
            res.status(200).json({
                ok:true,
                hospitales: hospitales,
                total: conteo
            });
        })
        
    });
});
// =============================
// Actualizar Hospital
// ============================

app.put('/:id', mdAutenticacion.verificarToken, (req,res) =>{
    var id = req.params.id;
    var body = req.body;
    // buscar y validar existencia del hospital a modificar
    Hospital.findById(id, (err,hospital) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });            
        }
        if(!hospital){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe hospital con ese Id',
                errors: {message: 'No existe hospital con ese Id'}
            });
        }

        hospital.nombre = body.nombre
        hospital.usuario = req.usuario._id;

        hospital.save((err,hospitalGuardado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al actualizar hospital",
                    errors: err
                });            
            }
            res.status(200).json({
                ok:true,
                hospital: hospitalGuardado
            });
        });
    })
});

// =============================
// Eliminar Hospital
// =============================
app.delete('/:id', mdAutenticacion.verificarToken, (req,res) =>{

    var id = req.params.id;

    Hospital.findByIdAndRemove(id,(err,hospitalBorrado) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'error al eliminar hospital',
                errors: err
            });            
        }
        if(!hospitalBorrado){
            return res.status(400).json({
              ok: false,
              mensaje: 'No existe un hodpital con ese id.',
              errors: {message: 'No existe hospital con ese id'}
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        })
    });
});

// =============================
// Crear Hospital
// =============================
app.post('/',mdAutenticacion.verificarToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    })
    hospital.save((err,hospitalCreado) =>{
        if (err) {
            return res.status(400).json({
              ok: false,
              mensaje: "Error al crear el hospital",
              errors: err
            });
          }
          res.status(201).json({
            ok: true,
            hospital: hospitalCreado,
            
          });
    });
});
module.exports = app;