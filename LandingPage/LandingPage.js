import React, { useState, useEffect } from 'react';
import image from '../../assets/dam101.jpg';
import image1 from '../../assets/dam.jpg';
import image2 from '../../assets/dam_kzn.jpg';
import { Carousel } from 'react-responsive-carousel';
import Resizer from 'react-image-file-resizer'; 
import './LandPage.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import MovingComponent from '../animations/component';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar_Home/Navbarhome';
import Card from 'react-bootstrap/Card';
import { api } from '../../Data/API';

function LandingPage() {

  const [data, setData] = useState([]);
  let navigate = useNavigate();
  let user_info = useSelector((state) => state.user.value)
  // Function to format date and time
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
  const resizeImages = async (eventsData) => {
    // Resize each image in the events data
    const resizedData = await Promise.all(
      eventsData.map(async (item) => {
        if (item.image) {
          try {
            const resizedImage = await resizeImage(item.image, 200, 200); // Adjust the size as needed
            return { ...item, image: resizedImage };
          } catch (error) {
            console.error('Error resizing image:', error.message);
            return item;
          }
        }
        return item;
      })
    );

    return resizedData;
  };
  const resizeImage = (file, maxWidth, maxHeight) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      'JPEG', // Output format (you can change it to 'PNG' if needed)
      100, // Image quality (100 means no compression)
      0, // Rotation (0 means no rotation)
      (uri) => {
        resolve(uri);
      },
      'base64' // Output type (you can change it to 'blob' if needed)
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(api +'getEvents');
        const resizedData = await resizeImages(response.data); // Resize the images
        setData(resizedData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='hero' >

      <div className=''>
        <Navbar />
      </div>




      <Carousel className='carousel'
        autoPlay={true}
        infiniteLoop={true}
        showStatus={false}
        showThumbs={false}
      >

        <div >

          <img src={image1} alt="Image 1" />


        </div>
        <div>
          <img src={image2} alt="Image 2" />

        </div>
        <div>
          <img src={image} alt="Image 3" />

        </div>
        {/* Add more images as needed */}
      </Carousel>


      <section className='section-2 '>
        <h2 className='text-primary text-center'>About Simra</h2>




        <MovingComponent
          type="glowing"
          duration="1000ms"
          delay="0.2s"
          direction="normal"
          timing="ease"
          iteration="1"
          fillMode="none">

          <p className='para font_7 wixui-richtext_text text-center text-dark ' >
            SIMRA is a cutting-edge web tool revolutionizing water resource management. It evaluates and mitigates microbial risks in water sources,<br />
            providing a robust framework for addressing health hazards from contamination. With seamless data integration, advanced modeling, <br />
            and decision support, SIMRA empowers stakeholders to protect public health and ensure water system sustainability. <br />
            Its ability to integrate diverse data sources, simulate contaminant behavior, and facilitate scenario analysis enables effective risk management strategies.<br />
            User-friendly interfaces and interactive visualizations promote transparent communication, fostering informed discussions. <br />
            SIMRA's iterative approach supports continuous monitoring and adaptation, refining interventions and enhancing risk management practices over time.<br />
            Overall, SIMRA marks a significant advancement in water resource management, <br />
            offering a comprehensive solution for assessing and managing microbial risks to promote long-term public health and water system vitality.</p>

        </MovingComponent>


        <section className='section-h2s'>

          <h2 className='text-primary text-center'>Simra Levels</h2>
          <div className='level1-desccription'>

            <div className='h2s-cards row align-items-start justify-content-around'>

              <div className='card text-bg-primary' style={{ width: '18rem' }} >
                <h5 className='text-center'>Household</h5>
                <div className='card-body  text-center '>
                  <p className='text-light'> SIMRA makes risk assessment and management accessible to everyone, especially those with limited resources.<br />
                    It's designed to be simple, easy to use, and practical for a wide range of users, including households and individuals.</p>
                </div>

              </div>
              <div className='card text-bg-primary' style={{ width: '18rem' }}>
                <h5 className='text-center'>Intermidiate</h5>
                <div className='card-body text-center '>
                  <p className='text-light'>This level of SIMRA goes beyond the basics, offering detailed water quality analysis and advanced microbial risk assessment tools. <br />
                    It's tailored for water treatment plant managers, government officials, researchers, and experts who need in-depth and comprehensive data.</p>
                </div> </div>
              <div className='card text-bg-primary ' style={{ width: '18rem' }}>
                <h5 className='text-center'>Expert</h5>
                <div className='card-body  text-center '>
                  <p className='text-light '>At the advanced level, SIMRA is designed for experts, microbiologists,
                    and researchers seeking in-depth microbial analysis and advanced risk assessment capabilities.<br></br>
                    It provides molecular biology techniques and detailed reports to meet the specific needs of these professionals.</p>
                </div> </div>





            </div>
          </div>
        </section>
        {/*** */}

        <MovingComponent
          type="fadeInFromRight"
          duration="1000ms"
          delay="0.2s"
          direction="normal"
          timing="ease"
          iteration="1"
          fillMode="none">

          <h2 className='text-primary text-center'>Is your water safe for drinking purposes? </h2>
          <p className='para font_7 wixui-richtext_text text-center text-dark ' >
            While water may appear clear,  <br></br>it may not necessarily be safe for drinking. <br></br>
            Such water can potentially lead to diarrheal and other waterborne diseases. <br></br>
            Hence, it is essential for you to regularly monitor the quality of your water. <br></br>

          </p>

        </MovingComponent>

      </section>
      <div className='text-center mt-3 mb-3'>
        <h1 className="mt-3 mb-3 text-primary">Events</h1>
        <div className="container">
          <div className="row">
            {data.map((item) => (
              <div key={item._id} className="col-md-6 mb-4">
                <Card className="h-100 ">
                  <div className="d-block">
                    <div className="mb-3">
                      <Card.Img
                        variant="top"
                        src={item.image ? item.image : ''}
                        alt={item.title}
                        className="img-fluid"
                      />
                    </div>
                    <Card.Body className="flex-grow-1">
                      <Card.Title style={{ textAlign: 'center', textTransform: 'uppercase' }}>{item.title}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                      <p>Venue: {item.venue}</p>
                      <p>Date and Time: {formatDateAndTime(item.date)}</p>
                    </Card.Body>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer>



        <Footer />

      </footer>
    </div>




  )
}
export default LandingPage;