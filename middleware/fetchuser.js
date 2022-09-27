import jwt from 'jsonwebtoken'


const fetchuser=(req,res,next)=>{
     
    const token = req.header("auth-token")
    try {
        
        if(!token){
            res.status(401).send('Token Not Found')
        }
        else{
            console.log( )
        const data = jwt.verify(token , process.env.JWT_SCRET) 
          req.user = data
          next()    
        }
    } catch (error) {
        res.send('Internal Error Occured')
        console.log(error.message)
    }
     
}

export default fetchuser