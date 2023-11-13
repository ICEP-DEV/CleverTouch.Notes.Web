import './Pop_Up_Level2.css';

function Pop_Up_Alert(props) {
    return (props.trigger) ? (
        <div className="register-popup">
            <div className="register-popup-inner">
                <div className="popup-inner-header">
                    <label className='x_close'  style={{color:'black', marginTop:"35px", fontSize:"1em"}} onClick={() => props.setTrigger(false)}><h2>X</h2></label>
                </div>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Pop_Up_Alert;