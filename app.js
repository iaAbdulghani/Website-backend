const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const sendGrid = require('@sendgrid/mail')
const path    = require('path')

const app = express()

if (app.get('env') == 'development'){
     require('dotenv').config()
    }
app.use(express.static(path.resolve(__dirname, 'build')));


app.get("/api/email", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});





  

app.use(bodyParser.json())
app.use(cors())
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})


app.post('/api/email', (req,res)=>{
    
    sendGrid.setApiKey(process.env.API_KEY)
    
    
     const msg={
        to: process.env.EMAIL,
        from: process.env.EMAIL,
        subject:'Website Contact',
        text: req.body.fName +" "+req.body.lName+" ("+req.body.email+") said " + req.body.message
    }

    sendGrid.send(msg)
    .then(result=>{
        res.status(200).json({
            success: true
        })
    })
    .catch(err=>{
        console.log('error:', err)
        res.status(401).json({
            success: false
        })
    })
 })

 app.listen(process.env.PORT || 3030, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });