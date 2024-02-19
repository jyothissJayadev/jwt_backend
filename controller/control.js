import User from '../model/userModels.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const jwtskey='everyonwknows'





/** POST: http://localhost:8080/api/register 
 * @param : {
  "name" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com"
}
*/export async function register(req, res) {
  try {
    const { name, password, email } = req.body;

    // Checking for existing username
    const existUsername = User.findOne({ name });
    // Checking for existing email
    const existEmail = User.findOne({ email });

    Promise.all([existUsername, existEmail])
      .then(([existingUsername, existingEmail]) => {
        if (existingUsername) {
          throw new Error('Please use a unique username');
        }
        if (existingEmail) {
          throw new Error('Please use a unique email');
        }

        // Hash the password
        return bcrypt.hash(password, 10);
      })
      .then(hashedPassword => {
        const user = new User({
          name,
          password: hashedPassword,
          email
        });

        // Save the user to the database
        return user.save();
      })
      .then(() => {
        return res.status(200).send({ success: true, message: 'User registered successfully' });
      })
      .catch(error => {
        return res.status(400).send({ success: false, error: error.message });
      });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
}




/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/


export async function login(req, res) {
    const { email, password } = req.body;
    console.log(email)
  
    try {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return res.status(400).send({ error: "email not found" });
          }
  
          bcrypt.compare(password, user.password)
            .then(passwordCheck => {
              if (!passwordCheck) {
                return res.status(400).send({ error: "Password does not match" });
              }
  
              // Create jwt token
              const token = jwt.sign({
                userId: user._id,
                email: user.email
              }, jwtskey, { algorithm: 'HS256', expiresIn: '24h' });
             
  
              return res.status(201).send({
                success: true,
                msg: "Login successful",
                email: user.email,
                token
              });
            })
            .catch(error => {
              return res.status(500).send({ error: "Error comparing passwords" });
            });
        })
        .catch(error => {
          return res.status(500).send({ error: "Error finding the user" });
        });
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  }

/** GET: http://localhost:8080/api/user */

export async function getUser(req, res) {
  const {email}=req.params;
  console.log(email)

  try {
        
    if(!email) return res.status(501).send({ error: "Invalid email"});

    User.findOne({ email })
        .then(user => {
          if (!user) {
            return res.status(400).send({ error: "email not found" });
          }
        /** remove password from user */
        // mongoose return unnecessary data with object so convert it into json
        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(201).send(rest);
    })

} catch (error) {
    return res.status(404).send({ error : "Cannot Find User Data"});
}


}

//GET:: http://localhost:8080/api/signOut



// /** PUT: http://localhost:8080/api/updateuser 
//  * @param: {
//   "header" : "<token>"
// }
// body: {
//     firstName: '',
//     address : '',
//     profile : ''
// }
// */
// export async function updateUser(req, res) {
//   try {
//     const { userId } = req.user;
// console.log(userId)
//     if (userId) {
//       const body = req.body;

//       // update the data
//       await User.updateOne({ _id: userId }, body)
//       .then(e=>{
//         return res.status(201).send({ msg: "Record Updated...!" });
//       })
//       .catch(error=>{
//         return res.status(400).send({error:"no user founf with this id"})
//       })
    
//     } else {
//       return res.status(401).send({ error: "User Not Found...!" });
//     }
//   } catch (error) {
//     return res.status(401).send(error);
//   }
// }

// /** PUT: http://localhost:8080/api/generateOTP*/
// export async function generateOTP(req,res){
//   try{
//   req.app.locals.OTP=await otpgenerator.generate(6,{upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false});
//   return res.status(200).send({otp:req.app.locals.OTP});
//   }
//   catch(error){
//     return res.status(400).send(error)
//   }
// }

// /** PUT: http://localhost:8080/api/verifyOTP*/
// export async function verifyOTP(req,res){
//   const { code } = req.query;
//   if(parseInt(req.app.locals.OTP) === parseInt(code)){
//       req.app.locals.OTP = null; // reset the OTP value
//       req.app.locals.resetSession = true; // start session for reset password
//       return res.status(201).send({ msg: 'Verify Successsfully!'})
//   }
//   return res.status(400).send({ error: "Invalid OTP"});
// }


// /** PUT: http://localhost:8080/api/createResetSession*/
// export async function createResetSession(req,res){
//    if(req.app.locals.resetSession){
//     return res.status(200).send({flag:req.app.locals.reset})
//    }
//    return res.status(400).send("session expired")
// }

// /** PUT: http://localhost:8080/api/resetPassword*/
// export async function resetPassword(req, res) {
//   try {
//     // if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });

//     const { username, password } = req.body;

//     try {
//       const user = await User.findOne({ username });

//       if (!user) {
//         return res.status(404).send({ error: "Username not found" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       await User.updateOne({ username: user.username }, { password: hashedPassword });

//       req.app.locals.resetSession = false; // Reset session

//       return res.status(201).send({ msg: "Record Updated...!" });
//     } catch (error) {
//       return res.status(500).send({ error: "Unable to update password" });
//     }
//   } catch (error) {
//     return res.status(401).send({ error });
//   }
// }


// res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
// const token = req.cookies.token