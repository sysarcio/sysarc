import React, { Component } from "react";
import CanvasThumbnail from "./CanvasThumbnail";
import axios from "axios";

class Canvases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvases: [],
      text: "",
      showForm: false
    };

    this.get = this.get.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createCanvas = this.createCanvas.bind(this);
    this.goToCanvas = this.goToCanvas.bind(this);
    this.toggleShowForm = this.toggleShowForm.bind(this);
    this.deleteCanvas = this.deleteCanvas.bind(this);
    this.goToLanding = this.goToLanding.bind(this);
    this.logout = this.logout.bind(this);
  }

  goToLanding() {
    this.props.history.push("/");
  }

  logout() {
    localStorage.removeItem("userID");
    this.props.history.push("/");
  }

  async componentDidMount() {
    if (!localStorage.userID) {
      // tell user they must be logged in
      this.props.history.push("/login");
    } else {
      const options = {
        method: "GET",
        url: `/api/canvases/${localStorage.userID}`
      };

      try {
        const { data: canvases } = await axios(options);

        this.setState({
          canvases
        });
      } catch (err) {}
    }
  }

  get(node, prop) {
    let i = node._fieldLookup[prop];
    return node._fields[i];
  }

  handleChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  async createCanvas(e) {
    e.preventDefault();
    const options = {
      method: "POST",
      url: "/api/canvas/add",
      data: {
        name: this.state.text,
        userID: localStorage.userID
      }
    };

    try {
      const {
        data: { id, name }
      } = await axios(options);

      this.toggleShowForm();
      this.props.history.push(`/canvas/${id}`);
    } catch (err) {
      // Actually let user know that something went wrong
    }
  }

  goToCanvas(id) {
    this.props.history.push(`/canvas/${id}`);
  }

  toggleShowForm() {
    this.setState({ showForm: !this.state.showForm });
  }

  async deleteCanvas(id) {
    axios
      .delete(`/api/canvas/${id}`)
      .then(response => {
        const canvasesCopy = this.state.canvases.slice();
        const canvasesAfterDelete = canvasesCopy.filter(
          canvas => canvas.id !== id
        );
        this.setState({
          canvases: canvasesAfterDelete
        });
      })
      .catch(console.log);
  }

  render() {
    const showCreateNewCanvas = this.state.showForm ? (
      <div>
        <form className="canvases-form">
          <input
            type="text"
            placeholder="Canvas name..."
            onChange={this.handleChange}
            value={this.state.text}
            className="form-input"
          />
          <button className="form-button" onClick={this.createCanvas}>
            Add Canvas +
          </button>
        </form>
      </div>
    ) : (
      <div className="canvases-plus" onClick={this.toggleShowForm}>
        <button className="canvas-button">
          <strong>+</strong>
        </button>
      </div>
    );

    return (
      <div>
        <h1 className="logo-sm" onClick={this.goToLanding}>
          Sketchpad Ninja
        </h1>
        <p className="logout-p" onClick={this.logout}>
          Logout
        </p>
        <div className="canvases ">
          {showCreateNewCanvas}

          {this.state.canvases.map(canvas => (
            <CanvasThumbnail
              deleteCanvas={this.deleteCanvas}
              canvas={canvas}
              goToCanvas={this.goToCanvas}
              key={canvas.id}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Canvases;
