import SideBar from "../Sidebar/SideBar";
import {useState,useEffect} from 'react';
import { api } from "../../../Data/API";
import { UseSelector } from "react-redux/es/hooks/useSelector";
import axios from 'axios';
import { GiConsoleController } from 'react-icons/gi';
import { Modal, Button } from 'react-bootstrap'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';;




function Event_Admin(){
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [venue, setVenue] = useState('');
    const [date, setDate] = useState(new Date());
    const [image, setImage] = useState(null);
    let navigate = useNavigate();
    const [dateTime, setDateTime] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
     // State to store the selected event for updating
     const [selectedEvent, setSelectedEvent] = useState(null);
    const handleDateTimeChange = (date) => {
      setDateTime(date);
    };
    const handleTitleChange = (e) => {
      setTitle(e.target.value);
    };
  
    const handleVenueChange = (e) => {
      setVenue(e.target.value);
    };
  
    const handleDateChange = (selectedDate) => {
      setDate(selectedDate);
    };
  
    const handleDescriptionChange = (e) => {
      setDescription(e.target.value);
    };
  
    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };
   // Fetch events data when the component mounts
   useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(api + 'getEvents');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error.message);
      }
    };
  
    fetchEvents();
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount
  
  const handleUpdateEvent = (eventId) => {
    console.log(eventId)
    console.log(events)
  
    
    // Set the selected event immediately
    setSelectedEvent(eventId);
    // Show the modal
    setShowModal(true);
  };
  
  // Update function
  const handleUpdateEventDetails = async () => {
    try {
      // Check if selectedEvent is not null
      if (!selectedEvent) {
        console.error('Selected event is null');
        return;
      }
  
      const eventId = selectedEvent;
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('venue', venue);
      formData.append('date', dateTime);
      formData.append('image', image);
  
     await axios.put(api + `updateEventMun/`+ eventId, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Optionally, you can refetch the events to update the table
      const response = await axios.get(api + 'getEvents');
      setEvents(response.data);
  
      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error('Error updating event:', error.message);
      // Handle error as needed
    }
  };
  
  
  function formatDateAndTime(date) {
    if (!date) return ''; // Handle the case where date is undefined or null
  
    // If date is already a string, parse it into a Date object
    const dateObject = typeof date === 'string' ? new Date(date) : date;
  
    // Format the date and time
    return dateObject.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    
      hour12: false, // Use 24-hour format
    });
  }
    const handleFormSubmit = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('venue', venue);
      formData.append('date', dateTime);
      formData.append('image', image);
      
  
      try {
      
        const response = await axios.post(api+ 'addEvents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        //console.log(response.data);
        setTitle('');
        setDescription('');
        setVenue('');
        setDate(new Date());
        setImage('');
        // You can handle the response data as needed, e.g., display a success message.
      } catch (error) {
        console.error('Error adding events:', error.message);
      }
    };
    return(

        <div className="container-admin" >
        <div className='sidebar-admin ' >
        <SideBar/>
        </div>
           <div className='main-admin'>
           <div className='mb-50'>
      <h4 style={{ textAlign: 'center', marginBottom:"3%"}}>Event Details</h4>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input type="text" className="form-control" value={title} onChange={handleTitleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea className="form-control" value={description} onChange={handleDescriptionChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Venue:</label>
          <input type="text" className="form-control" value={venue} onChange={handleVenueChange} />
        </div>
        <div className="mb-3">
        <label className="form-label">Date and Time:</label><br />
      <DatePicker
        selected={dateTime}
        onChange={handleDateTimeChange}
        showTimeSelect
        dateFormat="Pp"
        className="form-control"
      />
 
        </div>
        <div className="mb-3">
          <label className="form-label">Image:</label>
          <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Event
        </button>
      </form>
    </div>
    <div className='container'>

<div className='editEvent'>
{/* Table with events */}
   <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Venue</th>
          <th>Date and Time</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event, _id) => (
          <tr key={event._id}>
            <td>{event.title}</td>
            <td>{event.description}</td>
            <td>{event.venue}</td>
            <td>{formatDateAndTime(event.date)}</td>
            <td>
              <button
                className="btn btn-warning"
                onClick={() => handleUpdateEvent(event.id)}
              >
                Update
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
</div>

</div>


            </div>
            </div>
    )

}
export default Event_Admin;