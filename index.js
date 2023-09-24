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
const multer = require("multer");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"style")));
app.use(express.static(path.join(__dirname, 'Uploads')));
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
    let users;
    let pending;
    await User.find().then((result)=>{
        users = result;
    }).catch((err)=>{
        console.log(err);
    })
    await NewUser.find().then((result)=>{
        pending = result;
    })
    res.render("details.ejs",{users, pending, name});
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

const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb)
        {
            cb(null,"./Uploads")
        },
        filename:function(req, file, cb)
        {
            // unique filename based on the original filename
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + "_" + uniqueSuffix + ".jpg");
        },
    }),
}).fields([
    { name: "Aadhar_card", maxCount: 1 },
    { name: "Pan_card", maxCount: 1 },
    { name: "Profile_pic", maxCount: 1 },
]);

app.post("/register/validation", upload, async (req, res)=>{
    
    const { name, phone, address, email, password, date, terms_check, privacy_check } = req.body;
    const { Aadhar_card, Pan_card, Profile_pic } = req.files;
    console.log(password);
    if( (terms_check == "on") && (privacy_check == "on"))
    {
        let newUser = new NewUser({
            name: name,
            phone:phone,
            address: address,
            email: email,
            password: password,
            date: date,
            aadhar_card: Aadhar_card[0].filename,
            pan_card: Pan_card[0].filename,
            profile_pic: Profile_pic[0].filename,
        });
        await newUser.save();
        res.render("image.ejs",{newUser});
    } else {
        res.send("Registration Invalid! You have not checked privacy policy or terms and condition");
    }
})
app.get("/success",(req, res)=>{
    res.render("image.ejs");
})
app.get("/:id/approve", async (req, res)=>{
    let {id} = req.params;
    let newDetail;
    await NewUser.findOne({_id:`${id}`}).then((result)=>{
        newDetail = result;
    })
    console.log(newDetail);
    let newuser = new User({
        name: newDetail.name,
        email: newDetail.email,
        phone: newDetail.phone,
        address: newDetail.address,
        salary: 10000,
        password: newDetail.password,
        aadhar_card: newDetail.aadhar_card,
        pan_card: newDetail.pan_card,
        profile_pic: newDetail.profile_pic,
        id: newDetail._id
    })
    await newuser.save();
    await NewUser.deleteOne({_id:`${id}`}).then((result)=>{
        console.log(result);
        res.redirect("/admin/dashboard/@Abhishek")
    }).catch((err)=>{
        console.log(err);
    })
})
app.get("/:id/reject",async (req, res)=>{
    let {id} = req.params;
    await NewUser.deleteOne({_id:`${id}`}).then((result)=>{
        console.log(result);
        res.redirect("/admin/dashboard/@Abhishek")
    }).catch((err)=>{
        console.log(err);
    })
})
app.get("/:id/:img/image",async (req, res)=>{
    let {id, img} = req.params;
    await NewUser.findOne({_id:`${id}`}).then((result)=>{
        let imageURL;
        if (img === 'aadhar_card') {
            imageURL = result.aadhar_card;
        } else if (img === 'pan_card') {
            imageURL = result.pan_card;
        } else if (img === 'profile_pic') {
            imageURL = result.profile_pic;
        }
        res.render("image.ejs",{imageURL})
        console.log(imageURL);
    })
})
