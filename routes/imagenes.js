var express = require('express');
var fs = require('fs');
var app = express();

app.get('/:tipo/:img', (req,res,next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;
    var path = `./${tipo}/${img}`;
   
    // verifico que exista una imagen sino le proporcionamos una por defecto.
    fs.exists(path, existe => {
        
        if( !existe ){
            path = './assets/no-img.jpg';
        }

        res.sendfile(path);
   });
   /*  resp.status(200).json({
        ok: true,
        mensaje: 'La petición se realizó correctamente'
    }); */
});

module.exports = app;