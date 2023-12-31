import React from 'react'
import axios from 'axios'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loader from '../Loader/Loader';
import logo from './logo3.png';
import { useDispatch, useSelector } from 'react-redux';
import { user_details } from "../../Redux/user";
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Register from '../Registration/Registration'
import 'react-toastify/dist/ReactToastify.css';
import logo1 from '../../assets/Simra_logo.png';
import {BiSolidUser} from 'react-icons/bi';
import {AiFillLock} from 'react-icons/ai'

function Login() {
    let user_info = useSelector((state) => state.use)
    const dispatch = useDispatch();


    let [RegisterPopUp, setRegisterPopUp] = useState(false);
    let navigate = useNavigate();
    const [ButtonPopup, setButtonPopup] = useState(false);
    // Register state variables
    const [Email, setEmail] = useState('')
    const [Firstname, setFirstname] = useState('')
    const [Lastname, setLastname] = useState('')
    const [PhoneNumber, setPhoneNumber] = useState('')
    const [Password, setPassword] = useState('')
    const [RePassword, setRePassword] = useState('')
    const [Level, setLevel] = useState('')



    const [values, setValues] = useState({
        username: "",
        password: ""
    });

    const handleChangeUpdate = e => {
        const { name, value } = e.target;
        setValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    // set up login button using gmail account
    const onSuccess = async () => {
        if (values.username === "" && values.password === "") {
            toast.warn("All fields should be filled!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        if (values.username === "") {
            toast.warn("Enter a Username!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        if (values.password === "") {
            toast.warn("Enter a Password!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }

        setButtonPopup(true)
        const loginData = await axios.post('http://localhost:3001/api/login', values)
        setTimeout(() => {
            setButtonPopup(false)
            if (loginData.data.success === true) {
                user_info = {
                    userId: loginData.data.results[0].userId,
                    user_role: loginData.data.results[0].role,
                    user_level: loginData.data.results[0].level,
                    user_initial: loginData.data.results[0].firstname.substring(0, 1).toUpperCase(),
                    user_firstname: loginData.data.results[0].firstname,
                    user_lastname: loginData.data.results[0].lastname,
                    user_mobileNo: loginData.data.results[0].mobileNo,
                    user_role: loginData.data.results[0].role,
                    user_password: loginData.data.results[0].password,
                }
                console.log(loginData.data.results[0])
                dispatch(user_details(user_info))

                if (loginData.data.results[0].role === "user") {
                    navigate('/home')
                    /*if (loginData.data.results[0].level === 1) {
                        
                    }
                    else if (loginData.data.results[0].level === 2) {
                        navigate('/Level2')
                    }
                    else if (loginData.data.results[0].level === 3) {
                        navigate('/Level3')
                    }*/
                }
                else if (loginData.data.results[0].role === "municipal") {
                    navigate('/municipality')
                }

            }
            else {
                toast.warn(loginData.data.message + "!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }, 2000);


        try {

        }
        catch (ex) {

        }
    }
    let displayLoader = <div></div>
    // let displaySidebar=<div></div>


    // register function
    function handleRegistration() {

        // Empty values
        if (Email === "") {
            toast.warn("Enter your email address!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }
        if (Firstname === "") {
            toast.warn("Enter your first name!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }
        if (Lastname === "") {
            toast.warn("Enter your last name!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }
        if (PhoneNumber === "") {
            toast.warn("Enter your phone number!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }
        if (Password === "") {
            toast.warn("Enter Password!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }
        if (RePassword === "") {
            toast.warn("Please reEnter your Password for confirmation", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }
        if (Level === "") {
            toast.warn("Select level!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }

        // Match Password
        if (Password !== RePassword) {
            toast.warn("Passwords do not match!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }

        // validate strong password
        var regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (!Password.match(regPass)) {
            toast.warn("Enter a strong password!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }

        // validate email address
        var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!Email.match(validEmail)) {
            toast.warn("Enter a valid email address!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        // validate phone number
        if (PhoneNumber.length !== 10) {
            toast.warn("Enter correct phone number!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            return;
        }

        var register_form = {
            email: Email,
            firstname: Firstname,
            lastname: Lastname,
            mobileNo: PhoneNumber,
            password: Password,
            level: Level
        }

        axios.post("http://localhost:3001/api/registration", register_form).then((respond) => {
            if (respond.data.success === true) {
                toast.success(respond.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setTimeout(() => {
                    setRegisterPopUp(false)
                }, 2000)

            }
            else {
                toast.error(respond.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }, (error) => {
            console.log(error)
        })
    }


    // pop up modal fucntions
    const [isShow, invokeModal] = React.useState(false)
    const initModal = () => {
        return invokeModal(!false)
    }
    const [invokeModals] = React.useState(false)
    const initModals = () => {
        return invokeModals(!false)
    }
    const modalClose = () => {
        return invokeModal(false)
    }

    const [isShowsing, invokeModalsing] = React.useState(false)
    const initModalsing = () => {
        return invokeModalsing(!false)
    }
    const modalClosesing = () => {
        return invokeModalsing(false)
    }

    let RegisterForm = <div>
        <div className='register-form'>
            <h3 className='header-txt'><b>Create An Account</b></h3>
            <div className='form-group'>
                <label>First Name:</label>
                <input type="text" className='control-form' onChange={(event) => setFirstname(event.target.value)} />
            </div>
            <div className='form-group'>
                <label>Last Name:</label>
                <input type="text" className="control-form" onChange={(event) => setLastname(event.target.value)} />
            </div>
            <div className='form-group'>
                <label>Email:</label>
                <input type="email" className="control-form" onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className='form-group'>
                <label>Mobile Number:</label>
                <input type="number" className="control-form" onChange={(event) => setPhoneNumber(event.target.value)} />
            </div>
            <div className='form-group'>
                <label>Password:</label>
                <input type="password" className="control-form" onChange={(event) => setPassword(event.target.value)} />
            </div>
            <div className='form-group'>
                <label>Confirm Password:</label>
                <input type="password" className="control-form" onChange={(event) => setRePassword(event.target.value)} />
            </div>
            <div className='form-group'>

                <label> User Level:</label>
                <select className='select-sampling_data control-form' onChange={(event) => setLevel(event.target.value)} >
                    <option value='' className="control-form" disabled selected>---Select---</option>
                    <option value='1' className="control-form">Level One (Household)</option>
                    <option value='2' className="control-form">Level Two (Intermediate)</option>
                    <option value='3' className="control-form">Level Three (Expert)</option>
                </select>

            </div>
        </div>
        <div className='form-group'>
            <button className='btn-reg' onClick={handleRegistration}>Create Account</button>
        </div>

    </div>

    return (
        <div className='all-contents'>
            <ToastContainer />
            {/*
                            All field should be filled
                */}

            <Modal show={isShow} onHide={modalClose} >
                <Modal.Header closeButton onClick={modalClose}>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    All fields should be filled

                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="danger" onClick={initModal}>
                            Close
                        </Button> */}
                    <Button variant="dark" onClick={modalClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* data results pop up */}

            <Modal show={isShow} onHide={modalClose} >
                <Modal.Header closeButton onClick={modalClose}>
                    <Modal.Title>login</Modal.Title>
                </Modal.Header>
                <Modal.Body>



                    Enter Username

                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="danger" onClick={initModal}>
                            Close
                        </Button> */}
                    <Button variant="dark" onClick={modalClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* password pop up */}
            <Modal show={isShowsing} onHide={modalClosesing} >
                <Modal.Header closeButton onClick={modalClosesing}>
                    <Modal.Title>login</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    Enter Password

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={modalClosesing}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className='login-container'>
            <div className='logo-login'>
                        <img className='logo-login' src={logo1} alt='logo' />
                    </div>
                    <h3 className='header-txt mb-6'><b>Sign In </b></h3>
                
               

                        {/* <h3 className='text-center mb-5'><b>SIMRA</b></h3> */}
                        <div className='login-subs '>
                             {/* <label htmlFor='username ' className=' fs-6'>Username</label> <br />  */}
                            <BiSolidUser size={30}/><span>Username:</span><br/>
                            <input className='input-login rounded '  type="username" onChange={handleChangeUpdate} name='username' value={setValues.username} placeholder='Username' />
                            
                        </div>
                        

                        <div className='login-subs  mb-5'>
                            {/* <label htmlFor='password' className='fs-6'>Password</label> <br />  */}
                            <AiFillLock size={30}/><span>Password:</span><br/>
                            <input className='input-login rounded' type="password" onChange={handleChangeUpdate} name='password' value={setValues.password} placeholder='Password' />

                            <small>
                                {/* <div className="form-check ">
                                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                    <label className="form-check-label" for="exampleCheck1">Remember me</label>
                                </div> */}
                            </small>
                        </div>

                        <Loader trigger={ButtonPopup} setTrigger={setButtonPopup}>
                            {displayLoader}
                        </Loader>
                        <Register trigger={RegisterPopUp} setTrigger={setRegisterPopUp} >
                            {RegisterForm}
                        </Register>
                        <div className='login-grid'>

                            <button className='btn btn-success mb-5 btn-login' onClick={onSuccess}>Sign In</button>
                            <br></br>
                           
                            <div class="txt-signup" role="alert">
                            Don't have an account ? <button onClick={() => setRegisterPopUp(true)} className='btn btn-light ms-2'>Sign Up</button>
                            </div>
                        </div>

                    </div>

                </div>

           
    
    )
}

export default Login