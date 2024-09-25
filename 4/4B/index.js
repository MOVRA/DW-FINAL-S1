const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const multer = require('multer')
const session = require('express-session');
const bcrypt = require("bcrypt");
const e = require('express');
require('dotenv').config();

const app = express();
const port = 3000;

const upload = multer({ dest: 'public/uploads/' });

app.use(
    session({
        name: "my-session",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: process.env.DATABASE,
    password: process.env.DATABASE_PW,
    port: 5432
});

db.connect();

app.post("/delete/provinsi/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM kabupaten_tb WHERE provinsi_id = ($1)", [req.params.id]);
        await db.query("DELETE FROM provinsi_tb WHERE id = ($1)", [req.params.id]);
        res.redirect("/");
    } catch (error) {
        res.redirect(`/provinsi/${req.params.id}`);
    }
});

app.post("/edit/provinsi/:id", async (req, res) => {
    if (req.session.user) {
        try {
            console.log(req.body);
            await db.query("UPDATE provinsi_tb SET nama = ($1), diresmikan = ($2), pulau = ($3) WHERE id = ($4)", [req.body.provinsi, req.body.diresmikan, req.body.pulau, req.params.id]);
            res.redirect(`/provinsi/${req.params.id}`);
        } catch (error) {
            res.redirect(`/provinsi/${req.params.id}`);
        }
    }
    else {
        res.redirect(`/provinsi/${req.params.id}`);
    }
});

app.get("/edit/provinsi/:id", async (req, res) => {
    if (req.session.user) {
        try {
            let provinsiById = [];
            let options = [];
            let provinsi = [];
            let diresmikan = "";
            let optionsPulau = [];

            const getProvinsiById = await db.query("SELECT * FROM provinsi_tb WHERE id = ($1)", [req.params.id]);
            const getOptions = await db.query("SELECT * FROM prov_options_tb");
            const getProvinsi = await db.query("SELECT * FROM provinsi_tb");
            const getOptionsPulau = await db.query("SELECT * FROM pulau_options_tb");

            provinsiById = getProvinsiById.rows;
            options = getOptions.rows;
            optionsPulau = getOptionsPulau.rows;
            provinsi = getProvinsi.rows;
            diresmikan = provinsiById[0].diresmikan.toISOString().split('T', 1)[0];

            res.render("edit-provinsi.ejs", {
                optionsPulau: optionsPulau,
                diresmikan: diresmikan,
                provinsi: provinsi,
                provinsiById: provinsiById,
                options: options,
                user: req.session.user,
            })
        } catch (error) {
            console.log(error);
            res.redirect(`/provinsi/${req.params.id}`);
        }
    } else {
        res.redirect(`/provinsi/${req.params.id}`);
    }
});

app.get("/provinsi/:id", async (req, res) => {
    try {
        let provinsiById = [];
        let kabupaten = [];
        let provinsi = [];

        const getProvinsiById = await db.query("SELECT * FROM provinsi_tb WHERE id = ($1)", [req.params.id]);
        const getKabupaten = await db.query("SELECT * FROM kabupaten_tb WHERE provinsi_id = ($1)", [req.params.id]);
        const getProvinsi = await db.query("SELECT * FROM provinsi_tb ");

        provinsiById = getProvinsiById.rows;
        kabupaten = getKabupaten.rows;
        provinsi = getProvinsi.rows;

        for (const item of provinsiById) {
            item.diresmikan = item.diresmikan.toISOString().split('T', 1)[0];
        }
        for (const item of kabupaten) {
            item.diresmikan = item.diresmikan.toISOString().split('T', 1)[0];
        }

        console.log(kabupaten);

        res.render("provinsi-detail.ejs", {
            user: req.session.user,
            provinsiById: provinsiById,
            kabupaten: kabupaten,
            provinsi: provinsi
        });
    } catch (error) {
        res.redirect("/");
    }
});

app.post("/delete/kabupaten/:id", async (req, res) => {
    try {
        // let provinsi = [];

        await db.query("DELETE FROM kabupaten_tb WHERE id = ($1)", [req.params.id]);

        // const getProvinsi = db.query("SELECT * FROM provinsi_tb WHERE ")

        res.redirect("/");
    } catch (error) {
        res.redirect(`/`);
    }
});

app.post("/edit/kabupaten/:id", async (req, res) => {
    if (req.session.user) {
        try {
            console.log(req.body);
            await db.query("UPDATE kabupaten_tb SET nama = ($1), diresmikan = ($2) WHERE id = ($3)", [req.body.kabupaten, req.body.diresmikan, req.params.id]);
            res.redirect(`/`);
        } catch (error) {
            res.redirect(`/`);
        }
    }
    else {
        res.redirect(`/`);
    }
});

app.get("/edit/kabupaten/:id", async (req, res) => {
    if (req.session.user) {
        try {
            let kabupatenById = [];
            let options = [];
            let provinsi = [];
            let diresmikan = "";

            const getKabupatenById = await db.query("SELECT * FROM kabupaten_tb WHERE id = ($1)", [req.params.id]);
            const getOptions = await db.query("SELECT * FROM kab_options_tb");
            const getProvinsi = await db.query("SELECT * FROM provinsi_tb");

            kabupatenById = getKabupatenById.rows;
            options = getOptions.rows;
            provinsi = getProvinsi.rows;
            diresmikan = kabupatenById[0].diresmikan.toISOString().split('T', 1)[0];

            res.render("edit-kabupaten.ejs", {
                diresmikan: diresmikan,
                provinsi: provinsi,
                kabupatenById: kabupatenById,
                options: options,
                user: req.session.user,
            })
        } catch (error) {
            console.log(error);
            res.redirect(`/`);
        }
    } else {
        res.redirect(`/provinsi/${req.params.id}`);
    }
})

app.get("/kabupaten-detail/:id", async (req, res) => {
    try {
        let provinsi = [];
        let kabupaten = [];
        let provinsiById = [];

        const getProvinsi = await db.query("SELECT * FROM provinsi_tb");
        const getKabupaten = await db.query("SELECT * FROM kabupaten_tb WHERE id = ($1)", [req.params.id]);

        provinsi = getProvinsi.rows;
        kabupaten = getKabupaten.rows;

        const getProvinsiById = await db.query("SELECT * FROM provinsi_tb WHERE id = ($1)", [kabupaten[0].provinsi_id]);
        provinsiById = getProvinsiById.rows;

        console.log(req.params.id);

        kabupaten[0].diresmikan = kabupaten[0].diresmikan.toISOString().split('T', 1)[0];

        console.log(provinsiById);

        res.render("kabupaten-detail.ejs", {
            user: req.session.user,
            provinsiById: provinsiById,
            provinsi: provinsi,
            kabupaten: kabupaten
        });
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});

app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/");
    }
})

app.post("/register", async (req, res) => {
    try {
        let id;
        let status = true;
        const getData = await db.query("SELECT * FROM public.user_tb");

        for (const item of getData.rows) {
            if (item.email == req.body.email) {
                console.log("Email already used");
                status = false;
            }
        }
        if (status) {
            const hashedPw = await bcrypt.hash(req.body.password, 10);

            await db.query("INSERT INTO public.user_tb (email, username, password)VALUES ($1, $2, $3)", [req.body.email, req.body.username, hashedPw]);

            console.log("Success inserting data");
            res.redirect("/sign-in");
        }
        else {
            res.redirect("/sign-up");
        }

    } catch (error) {
        console.log("Failed inserting data");
        res.redirect("/");
    }
});

app.get("/sign-up", async (req, res) => {
    res.render("register.ejs", {
        user: req.session.user
    });
});

app.post("/login", async (req, res) => {
    try {

        const getData = await db.query("SELECT * FROM public.user_tb");

        const data = getData.rows;

        for (const item of data) {
            if (item.email == req.body.email) {
                if (bcrypt.compare(req.body.password, item.password)) {
                    req.session.user = item;
                    res.redirect("/");
                }
                else {
                    res.redirect("/sign-in");
                }
            }
        }

    } catch (error) {
        console.log("Failed to sign in");
        res.redirect("/");
    }
});

app.get("/sign-in", (req, res) => {
    res.render("login.ejs", {
        user: req.session.user,
    });
});

app.get("/add-kabupaten/:id", async (req, res) => {
    if (req.session.user) {
        try {
            let options = [];
            let provinsiById = [];
            let provinsi = [];

            const getOptions = await db.query("SELECT * FROM kab_options_tb");
            const getProvinsiById = await db.query("SELECT * FROM provinsi_tb WHERE id = ($1)", [req.params.id]);
            const getProvinsi = await db.query("SELECT * FROM provinsi_tb");


            options = getOptions.rows;
            provinsiById = getProvinsiById.rows;
            provinsi = getProvinsi.rows;

            res.render("add-kabupaten.ejs", {
                provinsi: provinsi,
                provinsiById: provinsiById,
                options: options,
                user: req.session.user
            });
        } catch (error) {
            res.redirect("/");
        }
    }
    else {
        res.redirect("/");
    }
})

app.get("/add-provinsi", async (req, res) => {
    if (req.session.user) {
        let options = [];
        let provinsi = [];

        const getOptions = await db.query("SELECT * FROM prov_options_tb");
        const getProvinsi = await db.query("SELECT * FROM provinsi_tb");

        options = getOptions.rows;
        provinsi = getProvinsi.rows;

        res.render("add-provinsi.ejs", {
            provinsi: provinsi,
            options: options,
            user: req.session.user,
        });
    }
    else {
        res.redirect("/");
    }
});

app.post("/post-provinsi", upload.single('image'), async (req, res) => {
    try {
        const getProvinsi = await db.query("SELECT * FROM provinsi_tb");
        let status = true;

        for (const item of getProvinsi.rows) {
            if (item.nama == req.body.provinsi.toUpperCase()) {
                console.log("Provinsi already exist")
                status = false;
            }
        }

        if (status) {
            await db.query("INSERT INTO provinsi_tb (user_id, nama, diresmikan, photo, pulau) VALUES ($1, $2, $3, $4, $5)", [req.session.user.id, req.body.provinsi, req.body.diresmikan, req.file.path.slice(7, req.file.path.length).replaceAll("\\", "/"), req.body.pulau]);

            console.log("Success inserting data!");

            res.redirect("/");
        }
        else {
            res.redirect("/add-provinsi");
        }
    } catch (error) {
        console.error(error);
        console.log("Failed inserting data");
        res.redirect("/");
    }

});

app.post("/post-kabupaten/:id", upload.single('image'), async (req, res) => {
    try {
        if (req.session.user) {
            await db.query("INSERT INTO kabupaten_tb (nama, provinsi_id, diresmikan, photo) VALUES ($1, $2, $3, $4)", [req.body.kabupaten, req.params.id, req.body.diresmikan, req.file.path.slice(7, req.file.path.length).replaceAll("\\", "/")]);
            res.redirect(`/provinsi/${req.params.id}`);
        }
        else {
            res.redirect("/");
        }
    } catch (error) {
        console.log(error);
        res.redirect(`/add-kabupaten/${req.params.id}`);
    }
});

app.get("/", async (req, res) => {

    let provinsi = [];
    let kabupaten = [];

    const getProvinsi = await db.query("SELECT * FROM provinsi_tb");
    const getKabupaten = await db.query("SELECT * FROM kabupaten_tb");

    provinsi = getProvinsi.rows;
    kabupaten = getKabupaten.rows;

    // console.log(provinsi, kabupaten, options);
    // console.log(getProvinsi.rows);
    // console.log(req.session);

    for (const item of provinsi) {
        // item.diresmikan = new Date(item.diresmikan).toLocaleDateString();
        item.diresmikan = item.diresmikan.toISOString().split('T', 1)[0];
    }

    res.render("index.ejs", {
        user: req.session.user,
        provinsi: provinsi,
        kabupaten: kabupaten
    });
});

app.listen(port, () => {
    console.log("Server is running!");
});