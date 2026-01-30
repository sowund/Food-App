import { useState } from 'react';
import axios from 'axios';
import '../App.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom";
// |>create the sign in with google utton wih google logo

//Backend Server API based URL
const API = "http://localhost:4000";
const GOOGLE_CLIENT_ID = "368358949805-u0q2o81duc2j114qcana4fobegihkc4m.apps.googleusercontent.com"

function Login() {
    const navigate = useNavigate();

  //State to store the status-Login Mode or Register Mode
  const [isLogin, setLogin] = useState(true);

  //State to store the values from (name,email,passord)
  const [form, setForm] = useState({ Firstname: "", Lastname: "", DOB: "", email: "", Phone_num: "", Address: "", password: "", Confirm_password: "" });

  //State to store the JWT token(Read form browser local storage)
  const [token, setToken] = useState(localStorage.getItem("token"));

  //Register Function
  const register = async () => {
    //Send form Dta through Axios request
    await axios.post(`${API}/register`, form);
    alert("Registered Successfully!");
    setLogin(true);
  };
  const login = async () => {
    const res = await axios.post(`${API}/login`, {
      email: form.email,
      password: form.password
    })
    localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/home");
  }
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
      setLogin(true);
      navigate("/login");

  }
  const googleLogin = async (credentialsResponse) => {
    try {
      const res = await axios.post(`${API}/auth/google`, { id_token: credentialsResponse.credential, })
      localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
         navigate("/home");
    }
    catch (err) {
      alert(err.response?.data?.message || "Google singin-Failed")
    }
  }

  //Logged UI- After UI
  if (token) {
    return (
      <div className='container p-4 shadow rounded justify-content vh-90 mt-5 ' style={{ width: "380px" }}>
        <h3 >Welcome! You Logged In.</h3>
        <div className='mt-3 d-flex justify-content-center'>
          <Button variant='danger' onClick={logout} >Logout</Button>
        </div>
      </div>
    )
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="p-4 shadow rounded container justify-content-center align-items-center vh-90 " style={{ width: "350px", marginTop: "100px" }}>
        <h3 className='text-center mb-5' style={{ color: 'blueviolet' }}>{isLogin ? "Login" : "Register"}</h3>
        <Form>
          {!isLogin ? (
            <>
            <Form.Group className="mb-3">
              <Form.Label>FirstName</Form.Label>
              <Form.Control type='text' placeholder='FirstName' onChange={(e) => setForm({ ...form, Firstname: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>LastName</Form.Label>
              <Form.Control type='text' placeholder='LastName' onChange={(e) => setForm({ ...form, Lastname: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>DOB</Form.Label>
              <Form.Control type='text' placeholder='Date Of Birth' onChange={(e) => setForm({ ...form, DOB: e.target.value })} />
            </Form.Group>


            <Form.Group className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' placeholder='Enter Email' onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type='text' placeholder='Address' onChange={(e) => setForm({ ...form, Address: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone_num</Form.Label>
              <Form.Control type='text' placeholder='Phone number' onChange={(e) => setForm({ ...form, Phone_num: e.target.value })} />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='Enter password' onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm_password</Form.Label>
              <Form.Control type='text' placeholder='Confirm_Password' onChange={(e) => setForm({ ...form, Confirm_password: e.target.value })} />
            </Form.Group>
            </>
          ) :
            (
            <><Form.Group className='mb-3'>
        <Form.Label>Email</Form.Label>
         <Form.Control type='email' placeholder='Enter Email' onChange={(e)=> setForm({...form,email:e.target.value})}/>
              </Form.Group>
              
      <Form.Group className='mb-3'>
        <Form.Label>Password</Form.Label>
         <Form.Control type='password' placeholder='Enter password' onChange={(e)=> setForm({...form,password:e.target.value})}/>
                </Form.Group>
      </>)}
          <div className='d-flex justify-content-center'>
            {isLogin ?
              (<Button variant='primary' onClick={login}>Login</Button>)
              :
              (<Button variant='success' onClick={register}>Register</Button>)}
          </div>
        </Form>
        <GoogleLogin
          onSuccess={googleLogin}
          onError={() => alert("Google Login Failed")}
          size="small"
          width="300px" />
        <div className='d-flex justify-content-center'>
          <p onClick={() => setLogin(!isLogin)} style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}>{isLogin ?
            "Create Account" : "Already have an account?Login"}</p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;