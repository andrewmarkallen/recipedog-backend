import React from 'react'
import { Button, Carousel, Grid, Col, Row, Image } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { get_image_url_with_fallback } from './Util'
import './FrontPage.css'

const FrontPage = (props)  => {
  return(
    <div className="frontpage-grid">
      <Grid >
      <Col xs lg="2"></Col>
      <Col xs lg="8">
      <Row id="frontpage-1"><h1>RecipeDog is a minimal recipe bookmarking application that lets you save your recipes in a simple format with minimal fuss. See all your recipes at a glance, with searching and tagging functionality.</h1>
</Row>
</Col>
<Col xs lg="2"></Col>
<Row id="frontpage-2">
      <Link to="/register" className="btn btn-success" id="register-button">Sign up now - it's free!</Link>
      </Row>
      <Row id="frontpage-5" className="justify-content-md-center">
      <Col xs lg="2"></Col>
      <Col xs lg="8">
      <Carousel interval={null} id="carouselcontainer">
              <Carousel.Item>
                <img id="carouselimage" width={800} height={400} alt='mushroom toast'
                  src={get_image_url_with_fallback('cupcake.jpg')}/>
                <Carousel.Caption>
                  <h1 className="carousel">See how it works</h1>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img id="carouselimage" width={800} height={400} alt='mushroom toast'
                  src={get_image_url_with_fallback('add_recipe.png')}/>
                <Carousel.Caption>
                  <h1 className="carousel">Simply add a  recipe with the form</h1>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img id="carouselimage" width={800} height={400} alt='mushroom toast'
                  src={get_image_url_with_fallback('minicard_preview.png')}/>
                <Carousel.Caption>
                  <h1 className="carousel">See your recipes all in one place</h1>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img id="carouselimage" width={800} height={400} alt='mushroom toast'
                  src={get_image_url_with_fallback('recipe_preview.png')}/>
                <Carousel.Caption>
                  <h1 className="carousel">View your recipes in a no nonsense format</h1>
                </Carousel.Caption>
              </Carousel.Item>

            </Carousel>
            </Col>
            <Col xs lg="2"></Col>
      </Row>
      <Row id="frontpage-6"><h1>Mobile Apps: Coming Soon!</h1></Row>
      <Row id="frontpage-8">© 2020 Mark Allen</Row>
      </Grid>
    </div>




    // <div id="carousel">
    //       <Carousel interval={5000}>
    //         <Carousel.Item>
    //           <img width={1200} height={400} alt='mushroom toast'
    //             src={get_image_url_with_fallback('mushroom-toast.jpg')}/>
    //           <Carousel.Caption>
    //             <h1>Welcome to Recipe Dog: A Minimal Recipe Bookmarker</h1>
    //           </Carousel.Caption>
    //         </Carousel.Item>
    //         <Carousel.Item>
    //           <img width={1200} height={400} alt='cupcake'
    //             src={get_image_url_with_fallback('cupcake.jpg')}/>
    //           <Carousel.Caption>
    //             <h1>Welcome to Recipe Dog: A Minimal Recipe Bookmarker</h1>
    //           </Carousel.Caption>
    //         </Carousel.Item>
    //       </Carousel>
    //       <div id="intro">
    //         <h1>What is RecipeDog?</h1>
    //         <div className="text-body">
    //           RecipeDog is a minimal recipe bookmarking application that lets you save your recipes in a simple format with minimal fuss. See all your recipes at a glance, with searching and tagging functionality. Click <Link to="/examples">here</Link> to see some examples and learn more.
    //         </div>
    //       </div>
    // </div>

  )
}

export default FrontPage
