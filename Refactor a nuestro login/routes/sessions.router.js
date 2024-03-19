import {Router} from "express";
import passport from "passport";

const sessionRouter = Router();

sessionRouter.get('/github', passport.authenticate('github', {scope:['user:email']}), async( req, res)=>{})

sessionRouter.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async (req, res)=>{

    req.session.user = {
        name: req.user.first_name,
        email: req.user.email,
        age: req.user.age
    }

    res.redirect('/')
})

sessionRouter.post('/register', passport.authenticate('register') , async (req, res)=>{
    res.send({status: 'success', mesage: 'user registered'})
})

sessionRouter.post('/login', passport.authenticate('login') ,  async (req, res)=>{

    const user = req.user;
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        rol: user.rol
    }

    res.send({status:'success', payload: req.session.user, message:'Successfully logged in'})
})

sessionRouter.get('/logout',(req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).send('there was an error destroying session')
    })
    res.redirect('/login')
})

export default sessionRouter;