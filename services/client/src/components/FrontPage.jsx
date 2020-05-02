import React from 'react'
import { Carousel } from 'react-bootstrap'
import { get_image_url_with_fallback } from './Util'

const FrontPage = (props)  => {
  return(
    <div id="carousel">
          <Carousel interval={5000}>
            <Carousel.Item>
              <img width={1200} height={400} alt='mushroom toast'
                src={get_image_url_with_fallback('mushroom-toast.jpg')}/>
              <Carousel.Caption>
                <h1>Welcome to Recipe Dog: A Minimal Recipe Bookmarker</h1>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img width={1200} height={400} alt='cupcake'
                src={get_image_url_with_fallback('cupcake.jpg')}/>
              <Carousel.Caption>
                <h1>Welcome to Recipe Dog: A Minimal Recipe Bookmarker</h1>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
    </div>
  )
}

export default FrontPage
