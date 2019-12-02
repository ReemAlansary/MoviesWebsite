//requiring the modules
const express = require('express');
const app = express();
const fs = require('fs');
const bodyparser = require('body-parser');
var session = require('express-session');

var port = process.env.PORT || 3000;

//Creating a session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// app.use(function(req,res,next){
//     req.index = counter || null;
// })

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));

//listening to port number
app.listen(port, () => console.log("Server is running on port 3000"));

//get and post request for each webpage
//I-Registeration
app.get('/register',(req,res) => {
    res.render('registration',{
        error:"",
        success: ""
    });
});

app.post('/register',(req,res) =>{
    acc = {
        user: req.body.username,
        pass: req.body.password
    };
    if(acc.user == "" || acc.pass == ""){
        var msg = 'Username and password must not be empty!'
        res.render('registration',{
            error: msg,
            success: ""
        });
    }else if(checkUser(acc.user)){
        var msg = 'Username is already taken!'
        res.render('registration',{
            error: msg,
            success: ""
        });
    }else{
        addUser(acc);
        addnewWL(acc.user);
        var msg = 'Registration completed successfully'
        res.render('registration',{
            error: "",
            success: msg
        });
    }
});

//II- Login
app.get('/',(req,res) => {
    res.render('login',{error:""});
});

app.post('/',(req,res) =>{
    acc = {
        user: req.body.username,
        pass: req.body.password
    };
    if(acc.user == "" || acc.pass == ""){
        var msg = 'Username and password must not be empty!'
        res.render('login',{
            error: msg,
            success: ""
        });
    }else if(checkUserLogin(acc)){
        req.session.user = req.body.username;
        // req.index = counter++;
        // console.log(counter);
        res.redirect('/home');
    }else{
        var msg = 'Username or password is wrong';
        res.render('login',{error:msg});
    }
});

//III- Homepage
app.get('/home',(req,res) => {
    if(req.session.user == null){
        console.log(req.session.user)
        res.redirect('/');
    }else
        res.render('home');
});

//IV- Movies
//1- Types
app.get('/action',(req,res)=>{
    
    if(req.session.user == null){
        res.redirect('/');
    }else
        res.render('action')
});

app.get('/drama',(req,res)=>{
    
    if(req.session.user == null){
        res.redirect('/');
    }else
        res.render('drama')
});

app.get('/horror',(req,res)=>{
    
    if(req.session.user == null){
        res.redirect('/');
    }else
        res.render('horror')
});

//2- Names
app.get('/godfather',(req,res)=>{
    if(req.session.user == null){
        res.redirect('/');
    }else{
        res.render('godfather',{error:""})
    }
});

app.post('/godfather',(req,res)=>{
    if(movieExist(req.session.user,'godfather')){
        res.render('godfather',{error:'The movie is already in the wishlist'});
    }else if(!movieExist(req.session.user,'godfather')){
        addWatchList(req.session.user,'godfather');
        res.render('godfather',{error:'The movie is added to the wishlist successfully'});
    }
});

app.get('/godfather2',(req,res)=>{
    if(req.session.user == null){
        res.redirect('/');
    }else{
        res.render('godfather2',{error:""})
    }
});

app.post('/godfather2',(req,res)=>{
    if(movieExist(req.session.user,'godfather2')){
        res.render('godfather2',{error:'The movie is already in the wishlist'});
    }else if(!movieExist(req.session.user,'godfather2')){
        addWatchList(req.session.user,'godfather2');
        res.render('godfather2',{error:'The movie is added to the wishlist successfully'});
    }
});

app.get('/scream',(req,res)=>{
    if(req.session.user == null){
        res.redirect('/');
    }else{
        res.render('scream',{error:""})
    }
});

app.post('/scream',(req,res)=>{
    if(movieExist(req.session.user,'scream')){
        res.render('scream',{error:'The movie is already in the wishlist'});
    }else if(!movieExist(req.session.user,'scream')){
        addWatchList(req.session.user,'scream');
        res.render('scream',{error:'The movie is added to the wishlist successfully'});
    }
});

app.get('/conjuring',(req,res)=>{
    if(req.session.user == null){
        res.redirect('/');
    }else{
        res.render('conjuring',{error:""})
    }
});

app.post('/conjuring',(req,res)=>{
    if(movieExist(req.session.user,'conjuring')){
        res.render('conjuring',{error:'The movie is already in the wishlist'});
    }else if(!movieExist(req.session.user,'conjuring')){
        addWatchList(req.session.user,'conjuring');
        res.render('conjuring',{error:'The movie is added to the wishlist successfully'});
    }
});

app.get('/darkknight',(req,res)=>{
    if(req.session.user == null){
        res.redirect('/');
    }else{
        res.render('darkknight',{error:""})
    }
});

app.post('/darkknight',(req,res)=>{
    if(movieExist(req.session.user,'darkknight')){
        res.render('darkknight',{error:'The movie is already in the wishlist'});
    }else if(!movieExist(req.session.user,'darkknight')){
        addWatchList(req.session.user,'darkknight');
        res.render('darkknight',{error:'The movie is added to the wishlist successfully'});
    }
});

app.get('/fightclub',(req,res)=>{
    if(req.session.user == null){
        res.redirect('/');
    }else{
        res.render('fightclub',{error:""})
    }
});

app.post('/fightclub',(req,res)=>{
    if(movieExist(req.session.user,'fightclub')){
        res.render('fightclub',{error:'The movie is already in the wishlist'});
    }else if(!movieExist(req.session.user,'fightclub')){
        addWatchList(req.session.user,'fightclub');
        res.render('fightclub',{error:'The movie is added to the wishlist successfully'});
    }
});

//V- Watchlist
app.get('/watchlist',(req,res)=>{
    
    if(req.session.user == null){
        res.redirect('/');
    }else
        res.render('watchlist',{WLuser:loadWLUser(req.session.user)})
});

//VI- Search
app.get('/search',(req,res) => {
    
    if(req.session.user == null){
        res.redirect('/');
    }else
        res.render('searchresults',{
            msg:"",
            movies: []
        });
});

app.post('/search',(req,res)=>{
    let r = searchMovie(req.body.Search);
    let m = ""; 
    console.log(r);
    if(r.length == 0){
        m = "Movie(s) Not Found";
    }else{
        m = "Movie(s) Found: ";
    }
    res.render('searchresults',{
        msg: m,
        movies: r
    })
});

// VII-Logout
app.post('/logout',(req,res)=>{
    req.session.user = null;
    res.redirect('/')
})

//Functions
//checks if the username is already exists upon registration
function checkUser(user){
    accs = loadAcc();
    for(let i=0;i<accs.length;i++){
        if(accs[i].user==user)
           return true;
    }
    return false;
}

//checks if the username and password is a valid one upon login
function checkUserLogin(acc){
    accs = loadAcc();
    for(let i=0;i<accs.length;i++){
        if(accs[i].user==acc.user && accs[i].pass==acc.pass)
           return true;
    }
    return false;
}

//saves the username and password while registration
function addUser(acc){
    let accs = loadAcc();
    accs.push(acc);
    let accsJson = JSON.stringify(accs);
    fs.writeFileSync('accounts.json',accsJson);
}

//loads all the available accounts in the json file
function loadAcc(){
    try{
        let bufferedData = fs.readFileSync('accounts.json');
        let dataString = bufferedData.toString();
        let accsArray = JSON.parse(dataString); 
        return accsArray;
    }catch(error){
        return [];
    }
}

//loads all the movies' names and their path during search for a specific movie
function loadMov(){
    try{
        let bufferedData = fs.readFileSync('movies.json');
        let dataString = bufferedData.toString();
        let movsArray = JSON.parse(dataString); 
        return movsArray;
    }catch(error){
        return [];
    }
}

//checks that what was written in the search bar exists in the movies provided in the website
function searchMovie(key){
    let res = [];
    let moviesA = loadMov();
    if(key == "" || key == " "){
       return res;
    }
    else{
        for(i=0;i<moviesA.length;i++){
            for(j=0;j<moviesA[i].name.length-3;j++){
                if(moviesA[i].name.substring(j,j+key.length).toLowerCase() == key.toLowerCase()){
                    res.push(moviesA[i]);
                    break;
                }
            }
        }
    }
    return res;
}

//adding a movie to the watchlist for a specific user
function addWatchList(user,movie){
    var wtmp = loadWL();
    var wluser = loadWLUser(user);
    
    if(!movieExist(user,movie)){
        wluser.push(movie);
    }

    for(i=0;i<wtmp.length;i++){
        if(wtmp[i].userW == user){
            wtmp[i].wl = wluser;
            break;
        }
    }

    let wlJson = JSON.stringify(wtmp);
    fs.writeFileSync('watchlistUsers.json',wlJson);
}

//loads all the users and their watchlists
function loadWL(){
    try{
        let bufferedData = fs.readFileSync('watchlistUsers.json');
        let dataString = bufferedData.toString();
        let wlArray = JSON.parse(dataString); 
        return wlArray;
    }catch(error){
        return [];
    }
}

//loads the watchlist for a specific user
function loadWLUser(user){
    console.log(user);
    var t = loadWL();
    for(var i=0;i<t.length;i++){
        if(t[i].userW===user)
            return t[i].wl;
    }
    return []
}

//checks if a movie exists in a user's watchlist
function movieExist(user,movie){
    var tw = loadWLUser(user);
    for(var i=0;i<tw.length;i++){
        if(tw[i] == movie)
            return true;
    }
    return false;
}

//adding a new empty watchlist for the newly registered users
function addnewWL(user){
    var wtmp = loadWL();
    var n = {
        userW:user,
        wl:[]
    }
    wtmp.push(n);
    let wlJson = JSON.stringify(wtmp);
    fs.writeFileSync('watchlistUsers.json',wlJson);
}