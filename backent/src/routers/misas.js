const { Router } = require('express');
const router = Router();
const Misa = require('../models/Misas');
const xl = require('excel4node');
var wb = new xl.Workbook();
var ws = wb.addWorksheet('Sheet 1');
const jwt = require('jsonwebtoken');


var style = wb.createStyle({
    font: {
      color: '#140100',
      size: 12,
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
  });
router.post('/', async (req, res) =>{
    const { dia, tel, para, ofrece, hora, intencion} = req.body;
    const newMisa =  new Misa({dia, tel, para, ofrece, hora, intencion});
    await newMisa.save();
    res.json({
        message: 'misa save'
    })
})

router.post('/hora', async (req, res) =>{
    const {dia, hora} = req.body;
    const misas = await Misa.find({ $and : [ {dia: dia}, {hora: hora}]}) 
    res.json(misas)   
})

router.get('/:dia', async(req, res) => {    
    const dia = req.params.dia;
    const lista =  await Misa.find({dia:dia})    
    ws.cell(1, 1).string('Ofrece').style(style);
    ws.cell(1, 2).string('intencion').style(style);
    ws.cell(1, 3).string('Para').style(style);
    ws.cell(1, 4).string('tel') .style(style);
    ws.cell(1, 5).string('hora') .style(style)
    ws.cell(1, 6).string('fecha') .style(style)
    for(let i = 0; lista.length > i; i++){
        ws.cell(i+2, 1).string(lista[i].ofrece).style(style);
        ws.cell(i+2, 2).string(lista[i].intencion).style(style);
        ws.cell(i+2, 3).string( JSON.stringify( lista[i].dia)).style(style);
        ws.cell(i+2, 4).string(lista[i].tel) .style(style);
        ws.cell(i+2, 5).string(horaDeMisa(lista[i].hora)) .style(style);
        ws.cell(i+2, 6).string(lista[i].para) .style(style);
    }
    wb.write('Excel.xlsx', res);
})

router.post('/login', (req, res) => {
    var username = req.body.user
    var password = req.body.password

    const token = jwt.sign({
      data: 'fatima'
    }, 'secret', { expiresIn: '3h' });
  
    if( username == 'leonel' && password == 'admin' ){
      res.json(token)      
    } else {      
      res.status(401).send({
        error: 'usuario o contraseña inválidos'
      })        
    }
  })

router.delete('/:id', async ( req, res) => {
  await Misa.findByIdAndDelete( req.params.id)
  res.json({res: 'Misa eliminada'})
})


function horaDeMisa (hora){
    if(hora == 1){
        return('Mañana')
    } else {
        return('tarde')
    }
}



module.exports = router;
