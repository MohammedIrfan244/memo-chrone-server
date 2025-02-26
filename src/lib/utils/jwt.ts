import jwt from 'jsonwebtoken'

export const getAccessToken= (userId : string,secret : string)=>{
    return jwt.sign({userId},secret,{expiresIn:'1d'})
}

export const getRefreshToken= (userId : string,secret : string)=>{
    return jwt.sign({userId},secret,{expiresIn:'7d'})
}