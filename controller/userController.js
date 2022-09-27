import User from '../models/usermodel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const createuser = async(req,res)=>{
    let success = false
    const {name , email , password , pic} = req.body
    try {
        const userExist = await User.findOne({email})
        if(!userExist){
            
            const salt = await bcrypt.genSalt(10)
            const hashPass =await bcrypt.hash(password , salt)
            const user =  await User({
                name:name,
                email:email,
                password:hashPass,
                pic:pic
            })
            user.save()
            const data = {
                id:user.id
            }
            success=true
            const authtoken = jwt.sign(data , process.env.JWT_SCRET)
            res.send({success , user , authtoken})
            
        }
        else{

            res.status(401).send({success})
        }
    } catch (error) {
        res.status(401).send(error.message)
        console.log(error.message)
    }

}

export const loginuser = async(req,res)=>{
     let success = false
      const {email , password} = req.body
      try {
        const userexist = await User.findOne({email})
          if(userexist){
            const isPassword = await bcrypt.compare(password , userexist.password)
            if(isPassword){
                success = true
                const data = {
                    id:userexist.id
                }
                const authtoken =await jwt.sign(data , process.env.JWT_SCRET)
                res.send({success , userexist , authtoken})
            }
            else{
                
                res.send({success})
            }
          }
          else{
            res.send({success})
          }
      } catch (error) {
        
        res.status(401).send(error.message)
        console.log(error.message)
      }
}
export const searchuser = async(req,res)=>{
    // res.send(req.user)
     try {
          const keyword = req.query.search 
          ?{
            $or:[
                {name:{$regex:req.query.search,$options:"i"}},
                {email:{$regex:req.query.search,$options:"i"}}
            ]
          }:{}
          const users = await User.find(keyword).find({_id:{$ne:req.user.id}})
          res.send(users)
     } catch (error) {
        res.status(401).send('Not Found')
        console.log(error.message)
        
     }   
}
