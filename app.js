// Requires
var express =  require('express');
var mongoose = require('mongoose');

// Inicializar Variables
var app = new express();

// Concexion a la base de datos
mongoose.connection.openUri("mongodb://localhost:27017/hospitalDB", (err,resp) => {
    if(err) throw err;
    console.log("Base de datos: \x1b[32m%s\x1b[0m", 'online' )

})


// Rutas
app.get('/', (req,resp,next) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'La petición se realizó correctamente'
    });
});



// Escuchar peticiones

app.listen(3000, () => {
    console.log("Server Express puerto 3000: \x1b[32m%s\x1b[0m", 'online' )
})