import passport from 'passport';
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import {createHash, isValidPasword} from "../hashutils.js";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;

const initializePassport = ()=> {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;

        let user = await userModel.findOne({email: username})
        try {

            if (user) {
                return done(null, false)
            }

            const newUser = {first_name, last_name, email, age, password: createHash(password)}
            const result = await userModel.create(newUser)
            console.log(newUser)
            return done(null, result)
        } catch (error) {
            return done(error)
        }

    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {

        try {
            const user = await userModel.findOne({email})
            if (!user) {
                return done(null, false)
            }
            if (!isValidPasword(user, password)) {
                return done(null, false)
            }

            return done(null, user)
        } catch (error) {
            return done(error)
        }

    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.b2704fe2de55a08f',
        clientSecret: '81c95e234448f1a125ac3e08897b0d47edd1eb4c',
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (_accessToken, _refreshToken, profile, done)=>{
        try {
            const user = await userModel.findOne({email: profile._json.email})

            if(!user){
                let newUser = {
                    first_name: profile._json.name,
                    email: profile._json.email,
                    last_name: '',
                    age: 20,
                    password: '',
                }
                let result = await userModel.create(newUser)
                return done(null, result)
            }else{
                return done(null, user)
            }

        } catch (error) {
            return done(error)
        }
    }))
}

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id)
    done(null, user);
})

export default initializePassport;