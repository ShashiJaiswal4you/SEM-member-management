const express =  require("express");
const app = express();
const method_override = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/login.js");
const Admin = require("./models/admin.js");
const Work = require("./models/work.js");
const NewUser = require("./models/register.js");
const { on } = require("events");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"style")));
app.use('/images', express.static('images'));
app.use('/style', express.static('style'));

const port = 3000;

app.listen(port,()=>{
    console.log(`Server started on ${port} :`);
})

main().then((res)=>{
    console.log("Database Connection successfull")
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/abhishek");
}

app.get("/",(req, res)=>{
    res.render("home.ejs");
})

app.get("/user-login",(req, res)=>{
    let user = "User";
    res.render("login.ejs",{user});
})

app.get("/admin-login",(req, res)=>{
    let user = "Admin";
    res.render("login.ejs",{user});
})

app.post("/:id/login",  async (req, res)=>{
    let {id} = req.params;
    let {userName:user, passWord:password} = req.body;
    if(id === "User")
    {
        try {
            let result = await User.findOne({name:user});
            //console.log(result);
            if (result) {
                let DBPassword = result.password;
                let UserPassword = password;
                if(DBPassword === UserPassword)
                {
                    res.redirect(`/user/dashboard/${result.id}/${result.name}`);
                }
                else {
                    res.render("error.ejs");
                }
               
            } else 
            {
                res.render("error.ejs");
            }
    
        } catch (err) {
            res.render("error.ejs");
            console.log(err);
        }
    } else if (id === "Admin") {
        
        try {
            let result = await Admin.findOne({name:user});
            //console.log(result);
            if (result) {
                let DBPassword = result.password;
                let UserPassword = password;
                if(DBPassword === UserPassword)
                {
                    res.redirect(`/admin/dashboard/${result.name}`);
                }
                else {
                    res.render("error.ejs");
                }
               
            } else 
            {
                res.render("error.ejs");
            }
    
        } catch (err) {
            res.render("error.ejs");
            console.log(err);
        }
    } else {
        res.render("error.ejs");
    }
})

app.get("/admin/dashboard/:id",async (req, res)=>{
    let {id} = req.params;
    let name = id;
    await User.find().then((result)=>{
        let users = result;
        res.render("details.ejs",{users, name});
    }).catch((err)=>{
        console.log(err);
    })
})

app.get("/user/dashboard/:id/:name", async (req, res)=>{
    let {id, name} = req.params;
    let allWork = await Work.find({id:`${id}`});
    res.render("work.ejs",{name, id, allWork});
})

app.get("/:id/Details", async(req, res)=>{
    let {id} = req.params;
    await Work.find({id:`${id}`}).then((result)=>{
        let userDetails = result;
        res.render("user-detail.ejs", {userDetails});
    })
})

app.get("/:id/add-work", async (req, res)=>{
    let {id} = req.params;
    res.render("add-work.ejs",{id});
})
app.post("/:id/booking", async (req,res)=>{
    let {id} = req.params;
    let {phone, place, name, date} = req.body;
    let user = new Work({ name: `${name}`, phone: phone, place: `${place}`, id: `${id}`, date:`${date}` });
    user.save();
    res.redirect(`/user/dashboard/${id}/${name}`);
})

app.get ("/:id/search", async (req, res)=>{
    let {id} = req.params;
    // console.log("Console 0:",id);
    await User.find({name:`${id}`}).then((users)=>{
        // console.log("console 1: ",users)
        let name = id;
        res.render("details.ejs",{name,users});
    }).catch((err)=>{
        console.log(err);
    })
    
})

app.get("/:id/:name/delete", async(req, res)=>{
    let {id, name} = req.params;
    await Work.deleteOne({id:`${id}`}).then((result)=>{
        res.redirect(`/user/dashboard/${id}/${name}`);
    })
})

app.get("/:id/delete/:name", async (req, res)=>{
    let {id, name} = req.params;
    await User.deleteOne({_id:`${id}`}).then((result)=>{
        res.redirect(`/admin/dashboard/${name}`);
    }).catch((err)=>{
        console.log(err);
    })
    
})

app.get("/register",(req, res)=>{
    res.render("register.ejs");
})
app.post("/register/validation", async (req, res)=>{
    let {name, email, password, date, Aadhar_card, Pan_card, Profile_pic, terms_check, privacy_check } = req.body;
    if( (terms_check == "on") && (privacy_check == "on"))
    {
        let newUser = new NewUser({
            name: name,
            email: email,
            password: password,
            date: date,
            aadhar_card: Aadhar_card, 
            pan_card: Pan_card, 
            profile_pic: Profile_pic
        });
        newUser.save();
        res.send("Registration Successfull");
    } else {
        res.send("Registration Invalid! You have not checked privacy policy or terms and condition");
    }
})