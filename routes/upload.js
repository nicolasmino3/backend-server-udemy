var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

// Models
var Hospital = require("../models/hospital");
var Medico = require("../models/medico")
var Usuario = require("../models/usuario");

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            errors: { message: 'Tipo de coleccion no valida' }
        });
    }
    // Pregunto si existe archivo
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // solo estas extensiones utilizamos
    var extensionesValidas = ['png', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ') }
        })
    }
    // nombre archivo personalizado
    var nombreArchivo = `${id}-${new Date().getUTCMilliseconds()}.${extensionArchivo}`;


    // mover el archivo a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);


    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un usuario con ese id',
                    errors: { message: 'No existe un usuario con ese id' }
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;

            // si existe imagen vieja, la elimino.
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });



        });

    }
    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un hospital con ese id',
                    errors: { message: 'No existe un hospital con ese id' }
                });
            }
            var pathViejo = './uploads/hospitales/' + hospital.img;

            // si existe imagen vieja, la elimino.
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    usuario: hospitalActualizado
                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un medico con ese id',
                    errors: { message: 'No existe un medico con ese id' }
                });
            }
            var pathViejo = './uploads/medicos/' + medico.img;

            // si existe imagen vieja, la elimino.
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    usuario: medicoActualizado
                });
            });
        });

    }
}
module.exports = app;