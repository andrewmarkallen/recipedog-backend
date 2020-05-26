import React from 'react'
import {copyright} from './Util'
const About = ()  => (

<div className="">
  <h1>About</h1>
  <hr/><br/>
  <p className="text-body">RecipeDog is {copyright} 2020 Mark Allen.</p>
  <p className="text-body">Source code available on <a href="http://github.com/andrewmarkallen">github</a></p>
</div>
)

export default About
