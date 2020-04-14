import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

class ChangesSavedModal extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: this.props.show,
      done: false
    };
  }

  handleClose() {
    this.setState({ show: false });
    this.setState({ done: true })
  }

  handleShow() {
    this.setState({ show: true });
  }

  componentDidUpdate() {
    if (!this.state.done)
      if (this.props.show === true && this.state.show === false)
        this.setState({ show: true })
  }

  render() {

    return (
      <div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Changes saved</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
            Changes to the recipe were saved successfully.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button id="close-changes-modal" onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ChangesSavedModal
