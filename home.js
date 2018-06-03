const express = require('express')
const home = express.Router()
const bodyParser = require('body-parser')
const mysql = require('mysql')

// ====== mysql connection =======

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adyasa26',
    database: 'bitly'
})
connection.connect();

// ====== example midleware ========
// const midleware1 = (req, res, next) => {
//     // console.log('test');
//     let sql1 = `SELECT name FROM user WHERE indct = '2'`;
//     connection.query(sql1, (err, response, field) => {
//         console.log('berhasil');

//         // res.render('dash',{us: response[0].name})   
//     });
//     next()

// }


// --------------------------------

home.get('/', (req, res) => {
    res.render('home')
})


// ====== post ==================

home.get('/echo', (req, res) => {
    res.render('home')
})
home.post('/echo', (req, res) => {

    let plink = Object.values(req.body).join()
    let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = ""
    for (let i = 0; i < 6; i++) {
        result += char.charAt(Math.floor(Math.random() * 62));
    }
    let value = [plink, result]
    let sql = `INSERT INTO link (link, shortlink, created_at) VALUES (?,?,CURRENT_TIMESTAMP());`
    connection.query(sql, value, (err, res, field) => { console.log('data link berhasil di simpan') });


    res.render('home', {
        link: result
    })
})

home.get('/echo/:link', (req, res, next) => {
    let value = req.params.link
    let sql = `SELECT link FROM link WHERE shortlink = ?`
    connection.query(sql, value, (err, response, field) => {
        // console.log(response[0].link)
        res.redirect(response[0].link)

    })
})



home.post('/login', (req, res) => {
    // console.log(req.body.username);
    let usern = req.body.username
    let passw = req.body.password
    let value = [usern, passw]
    let sql = `UPDATE user SET indct = '1' WHERE user = ? AND pass = ? `;
    connection.query(sql, value, (err, response, field) => {
        // localStorage.setItem('token', )
        // console.log(field);

        if (response.affectedRows === 0) { // masih salah nih bukan undifined, coba ganti yang lain
            res.send('data tidak di temukan');
        } else {
            res.redirect('/dash')
        }
    })

})



// ------------------ MAIN PAGE ----------------------//
// home.use(midleware1)


home.get('/dash', (req, res) => {

    // let dataLink = `
    // SELECT l.link as links, l.shortlink as 'uniq url', d.count
    // FROM link l left join ditect d on l.id_link = d.id_link
    // left join user u on u.id_user = l.id_user
    // WHERE  u.indct = 1;
    // `
    // connection.query(dataLink, (err, resp, field) => {
    //     let datalnk = resp
    //     // console.log(JSON.stringify(resp));
    //     // })

        let sql1 = `SELECT name FROM user WHERE indct = '1'`;
        connection.query(sql1, (err, response, field) => {
            // console.log(response[0]);

            res.render('dash', { us: response[0].name })
        })
    // }) //
})

home.post('/generate', (req, res) => {

    let plink = Object.values(req.body).join()
    let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = ""
    for (let i = 0; i < 6; i++) {
        result += char.charAt(Math.floor(Math.random() * 62));
    }

    let dataLink = `
    SELECT l.link as links, l.shortlink as 'uniq_url', d.count
    FROM link l left join ditect d on l.id_link = d.id_link
    left join user u on u.id_user = l.id_user
    WHERE  u.indct = 1;
    `
    connection.query(dataLink, (err, resp, field) => {
        let datalnk = resp


        let sql0 = `SELECT id_user FROM user WHERE indct = '1'`;
        connection.query(sql0, (err, response, field) => {
            let id_user = response[0].id_user
            let value = [plink, result, id_user]
            let sql = `INSERT INTO link (link, shortlink, id_user, created_at) VALUES (?,?,?,CURRENT_TIMESTAMP());`
            connection.query(sql, value, (err, res, field) => { console.log('data link berhasil di simpan') });
        });

        let sql1 = `SELECT name FROM user WHERE indct = '1'`;
        connection.query(sql1, (err, response, field) => {
            res.send({ us: response[0].name, link: result, item: datalnk })
        })
    })
})

home.get('/generate', (req, res) => {

    let plink = Object.values(req.body).join()
    let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = ""
    for (let i = 0; i < 6; i++) {
        result += char.charAt(Math.floor(Math.random() * 62));
    }

    let dataLink = `
    SELECT l.link as links, l.shortlink as 'uniq_url', d.count
    FROM link l left join ditect d on l.id_link = d.id_link
    left join user u on u.id_user = l.id_user
    WHERE  u.indct = 1;
    `
    connection.query(dataLink, (err, resp, field) => {
        res.send(resp)

    })   
})

home.get('/:link', (req, res, next) => {
    let value = req.params.link

    let sql1 = `SELECT id_link FROM link WHERE shortlink = ?`
    connection.query(sql1, value, (err, response, field) => {
        //console.log(response)
        if (response == 0){
            next()
        } else {
        let val = response[0].id_link
        let sql2 = `SELECT count FROM ditect WHERE id_link = ?`
        connection.query(sql2, val, (err, response, field) => {
            // let hitung_id = response[0].count
            console.log(response.length); 

            if (response.length > 0) {
                let sqlUPDATE = `UPDATE ditect SET count = count + 1 WHERE id_link = ?`
                connection.query(sqlUPDATE, val, (err, res, field) => {
                    console.log('data berhasil di update');
                })
            } else {
                let sqlINSERT = `INSERT INTO ditect(id_link, count) VALUES(?,1)`
                connection.query(sqlINSERT, val, (err, res, field) => {
                    console.log('data berhasil di insert');
                })
            }
        }) }
    }) 

    let sql = `SELECT link FROM link WHERE shortlink = ?`
    connection.query(sql, value, (err, response, field) => {
        // console.log(response);
        if(response == 0){
            res.redirect('/echo')
        } else{
        res.redirect(response[0].link)
    }
    }) 
}) 


home.post('/edit', (req, res)=>{
    // console.log(req.body.new)
    let sold = req.body.url
    let snew = req.body.new
    let val = [snew, sold]
    let updatedata = `UPDATE link SET shortlink =  ? WHERE shortlink = ?`
    connection.query(updatedata, val,(err, res, field)=>{
        console.log('data berhasil di update');
        
    })
})

home.post('/logout', (req, res) => {
    // console.log(req.body.username);
    let sql = `UPDATE user SET indct = '0' WHERE indct = '1' `;
    connection.query(sql, (err, response, field) => {
            res.redirect('/')
        
    })

})



module.exports = home // export sesuatu yang sudah di deklarsikan di awal express.router()
