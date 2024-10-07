const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');

const app = express();

// connect to database
mongoose.connect('mongodb+srv://yasirirzooqi:ILv2lIOaZFLM40Hf@cluster0.nmyp9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      
// set up view engine
app.set('view engine', 'ejs');

// set up express middleware
app.use(express.urlencoded({extended: false}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.get('/', async (req, res, next) => {
    try {
const shortUrls = await ShortUrl.find();
res.render('index', {shortUrls: shortUrls});
} catch (err) {
    next(err); // Pass the error to the error-handling middleware
}

})

app.post('/shortUrls', async (req, res) => {
    try {
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/');

} catch (err) {
    next(err); // Pass the error to the error-handling middleware
}
})

app.get('/:shortUrl', async (req, res, next) => {
    try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    await shortUrl.save();
    return res.redirect(shortUrl.full);
    } catch (err) {
        next(err);
    }
});

// listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server started on port ' + port);
});

module.exports = app;