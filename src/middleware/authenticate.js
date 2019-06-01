import jwt from 'jsonwebtoken';
import User from '../models/user';

export default (req, res, next) => {
    const header = req.headers.authorization;

    let token ;
    if(header) token = header.split(' ')[1];

    if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
            if(err){
                res.status(401).json({errors:{global:"invalid token"}});
            }else{
                User.findOne({email:decode.email}).then(user =>{
                    req.currentUser = user;
                    next();
                });
            }
        });

    }else{
        res.status(401).json({errors:{global:"no token"}});
    }

}