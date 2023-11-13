import React, { useEffect, useState } from "react";
import './Navbar.css';
import { Link } from "react-router-dom";
import logo from './logo2.png';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GiHamburgerMenu } from 'react-icons/gi';
import logo1 from '../../assets/Simra_logo.png';
import { remove_details } from "../../Redux/user";
import { remove_sample_details } from "../../Redux/sampling_data"
import { api } from '../../Data/API'

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [UserType, setUserType] = useState(0)
    let [IsFoundSamplingData, setIsFoundSamplingData] = useState(true);
    let user_info = useSelector((state) => state.user.value)
    let sampling_info = useSelector((state) => state.sampling.value);

    useEffect(() => {
        if (user_info !== undefined) {
            setUserType(user_info.user_level)
            if (sampling_info !== undefined || JSON.stringify(sampling_info) === {}) {
                setIsFoundSamplingData(false)
            }
        }
        else {
            navigate("/")
        }
    }, []);

    function Profile() {
        navigate("/profile")
    }

    function data() {
        navigate("/sampling_data")
    }

    function logout() {
        dispatch(remove_details());
        dispatch(remove_sample_details())
        axios.get(api+'logout',).then(response => {
            if (response.data) {
                console.log(response.data)
                localStorage.removeItem('jsonwebtoken')
            }
        }).catch(error => {
            console.log(error)
        })
        navigate("/")
    }

    const [showNav, setShowNav] = useState(false);

    const toggleNav = () => {
        setShowNav(!showNav);
    };


    /*function logout() {
        dispatch(remove_details());
        dispatch(remove_sample_details())

        axios.get('logout',

        ).then(response => {
            if (response.data) {
                console.log(response.data)


                localStorage.removeItem('jsonwebtoken')

            }
        }).catch(error => {
            console.log(error)
        }
        navigate("/")
    })*/

    return (
        <div className="topnav">
            <div className="logo">
                <Link to={"/home"}> <img className="rounded-img" src={logo1} /></Link>
            </div>
            <div className={`nav-links ${showNav ? 'show' : ''}`}>
                <li className="navbar-subs" onClick={() => navigate('/home')}>Home</li>
                <li className="navbar-subs" onClick={Profile}>Profile</li>
                <li className="navbar-subs" onClick={data}>Sampling Data</li>
                <div className="navbar-subs dropdown" hidden={IsFoundSamplingData}>
                    {sampling_info !== undefined && <div>
                        <span className="nav-label dropbtn">Levels</span>
                        <ul className="dropdown-menu">
                            {(UserType === 1 || UserType === 2 || UserType === 3) && (<span>
                                <li className='dropdown-item' onClick={() => navigate('/h2s_survey')}>Level 1</li>
                            </span>)}
                            {(UserType === 2 || UserType === 3) && (<span>
                                <li className='dropdown-item' onClick={() => navigate('/fib_analysis')}>Level 2</li>
                            </span>)}
                            {(UserType === 3) && (<span>
                                <li className='dropdown-item' onClick={() => navigate('/mst')}>Level 3</li>
                            </span>)}
                        </ul>
                    </div>}

                </div>

                <li className="navbar-subs dropdown" >
                    <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" >
                        Report
                    </a>

                    <ul className="dropdown-menu">
                        <li className='dropdown-item' onClick={() => navigate('/h2s_logs')}>H2S</li>
                        <li className='dropdown-item' onClick={() => navigate('/survay_logs')}>Sanitary</li>
                        {(UserType === 2 || UserType === 3) && (<span>

                            <li className='dropdown-item' onClick={() => navigate('/qmra_logs')}>QMRA</li>
                        </span>)}

                        {(UserType === 3) && (<span>
                            <li className='dropdown-item' onClick={() => navigate('/mst_logs')}>MST</li>
                        </span>)}

                    </ul>

                </li>

                {/* <li className="navbar-subs" onClick={report}>Report</li> */}
                <li className="navbar-subs"><button className=" btn btn-success fw-bold" onClick={logout}>Signout</button></li>
                {/* <div className="navbar-subs" onClick={() => navigate('/home')}><span className="nav-label">Home</span></div>
                <div className="navbar-subs" onClick={Profile}><span className='nav-label'>Profile</span></div>
                
                <div className="navbar-subs" onClick={data}><span className="nav-label">Sampling Data</span></div>
                
                <div className="navbar-subs" onClick={report}><span className="nav-label">Report</span></div> */}
                {/* <div className="navbar-subs dropdown">
                    <span className="nav-label">Levels</span>
                    {UserType === 2 && (<span>
                        <Link className='dropdown-link' to=''>Level 1</Link>
                        <Link className='dropdown-link' to=''>Level 2</Link>
                    </span>)}
                    {UserType === 3 && (<span>
                        <Link className='dropdown-link' to=''>Level 1</Link>
                        <Link className='dropdown-link' to=''>Level 2</Link>
                        <Link className='dropdown-link' to=''>Level 2</Link>
                    </span>)}
                </div> */}
                {/* <div className="navbar-subs" onClick={report}><span className="nav-label">Events</span></div>
                <div className="navbar-subs split" onClick={logout}><span className="nav-label">Signout</span></div> */}
            </div>
            <div className="hamburger" onClick={toggleNav}>
                <GiHamburgerMenu />
            </div>

        </div>
    )

}
export default Navbar;