import {Router} from "express";
import userModel from "../dao/models/user.model.js";

const sessionRouter = Router();

sessionRouter.post('/register',  async (req, res)=>{
    const { first_name, last_name, email, age,password} = req.body;

    if(!first_name || !last_name || !email || !age || !password){
        return res.status(400).send({status: 'error', error:'Missing data'})
    }

    const result = await userModel.create({first_name, last_name, email, age,password})
    res.send({status: 'success', message: 'user registered'})
})


sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ status: 'error', error: 'Missing data' });
    }

    const hardcodedAdmin = {
        first_name: 'Admin',
        last_name: 'Coder',
        email: 'adminCoder@coder.com',
        password: 'adminCod3r123',
        age: 100,
        rol: 'admin',
    };

    const user = await userModel.findOne({ email, password });
    if (user) {
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: user.rol,
        };

        return res.send({
            status: 'success',
            payload: req.session.user,
            message: 'Successfully logged in',
        });
    }

    if (email === hardcodedAdmin.email && password === hardcodedAdmin.password) {
        req.session.user = {
            name: `${hardcodedAdmin.first_name} ${hardcodedAdmin.last_name}`,
            email: hardcodedAdmin.email,
            age: hardcodedAdmin.age,
            rol: hardcodedAdmin.rol,
        };

        return res.send({
            status: 'success',
            payload: req.session.user,
            message: 'Successfully logged in as admin',
        });
    }

    return res.status(401).send({ status: 'error', error: 'Incorrect credentials' });
});

sessionRouter.get('/logout',(req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).send('there was an error destroying session')
    })
    res.redirect('/login')
})

export default sessionRouter;