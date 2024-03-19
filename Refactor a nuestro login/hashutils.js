import bcrypt from 'bcrypt';

const createHash = (password)=>{
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return hashedPassword;
}

const isValidPasword = (user, password)=>{
    const isValid = bcrypt.compareSync(password, user.password)
    return isValid;
}

export { createHash, isValidPasword };