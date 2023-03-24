import express from 'express';
import handlebars from 'express-handlebars';
import livereload  from 'livereload';
import connectLiveReload from 'connect-livereload';
import path from 'path';
import router from './router/router.js';
import dotenv from 'dotenv';
dotenv.config();


const __dirname = path.resolve();
const port = process.env.PORT || 3000;

const app = express(); 

if(process.env.ENVIRONMENT !== 'production') {

  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(__dirname);

  liveReloadServer.server.once("connection", () => {  
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 50);
  });

  app.use(connectLiveReload()); 
};


app.set('view engine', 'hbs');	
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));


app.listen(process.env.PORT || port, () => {
  console.log('Example app listening on port 3000!');
});

app.engine('hbs',
handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: [
      path.join(__dirname, 'views', 'partials'),
      path.join(__dirname, 'views', 'partials', 'loading')
    ]
}));


app.use((req, res, next) => {
  res.locals.showLoading = false;
  next();
})

app.use((req, res, next) => {
  if(req.url === "/story") {
    res.locals.showLoading = true;
  }
  next();
})

app.post('/submit-form', (req, res) => {
  // get the submitted form data from the request body
  // const formData = req.body;

  // // do something with the form data
  // console.log(formData);

  console.log(req.body)

  // send a response
  res.send('Form submitted successfully!');
});

app.use('/', router);




// useful resource about handlebars: https://waelyasmina.medium.com/a-guide-into-using-handlebars-with-your-express-js-application-22b944443b65