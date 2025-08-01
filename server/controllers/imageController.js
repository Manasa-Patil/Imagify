import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";

export const generateImage=async(req,res)=>{
  try {
    const {userId,prompt}=req.body;
         const user=await userModel.findById(userId);
         if(!user||!prompt){
            return res.json({success:false,message:"missing details"})
         }

         if(user.creditBalance===0||userModel.creditBalance<0){
             return res.json({success:false,message:"no credit balance",creditBalance:user.creditBalance})
         }

        const formData=new FormData()
        formData.append('prompt',prompt)
        const {data}= await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{
            headers: {
    'x-api-key': process.env.clipDropAPI,
  },
  responseType:'arraybuffer'
         })
   

          const base64Image=Buffer.from(data,'binary').toString('base64');
          const resultImage=`data:image/png;base64,${base64Image}`

          await userModel.findByIdAndUpdate(user._id,{
            creditBalance:user.creditBalance-1
          })
             res.json({success:true,message:'image generated',creditBalance:user.creditBalance-1,resultImage});

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}