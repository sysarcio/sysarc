import React, { Component } from "react";
import io from "socket.io-client";
import { Stage, Layer, Rect } from "react-konva";
import Konva from "konva";
import axios from "axios";
import { Redirect } from "react-router-dom";

import Toolbar from "./Toolbar";
import Node from "./Node";
import RouteLine from "./RouteLine.js";
import RouteForm from "./RouteForm";
import DownloadButton from "./DownloadButton";

import dummyData from "./dummyDataForReact";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth * 0.95,
      height: window.innerHeight * 0.77,
      openConnection: null,
      nodeToAdd: null,
      connector: null,
      connectorLocation: null,
      connections: {},
      nodes: {},
      showMenu: true,
      changingNodeType: false,
      miscNodeName: "",
      name: "",
      toDocs: false,
      mouseLoc: {
        x: 0,
        y: 0
      }
    };

    this.roomID = this.props.match.params.name;

    this.socket = io.connect();
    this.socket.on("connect", () => {
      this.socket.emit("join room", this.roomID);
      this.getRoomData();
    });

    this.socket.on("node added", node => {
      this.handleNewNode(node);
    });

    this.socket.on("node moved", data => {
      this.updateNode(data);
    });

    this.socket.on("node deleted", data => {
      this.handleDeleteNode(data);
    });

    this.socket.on("connection made", data => {
      this.handleNewConnection(data);
    });

    this.socket.on("connection deleted", id => {
      this.handleDeleteConnection(id);
    });

    this.socket.on("connection updated", data => {
      this.handleConnectionUpdated(data);
    });

    this.socket.on("request screenshot", data => {
      this.processScreenshot("UPLOAD");
    });

    this.updateNode = this.updateNode.bind(this);
    this.beginNewConnection = this.beginNewConnection.bind(this);
    this.handleNewConnection = this.handleNewConnection.bind(this);
    this.handleDeleteConnection = this.handleDeleteConnection.bind(this);
    this.updateConnection = this.updateConnection.bind(this);
    this.emitDeleteNode = this.emitDeleteNode.bind(this);
    this.prepNewNode = this.prepNewNode.bind(this);
    this.emitNewNode = this.emitNewNode.bind(this);
    this.handleNewNode = this.handleNewNode.bind(this);
    this.processScreenshot = this.processScreenshot.bind(this);
    this.toggleOpenConnection = this.toggleOpenConnection.bind(this);
    this.emitUpdateConnectionData = this.emitUpdateConnectionData.bind(this);
    this.goToLanding = this.goToLanding.bind(this);
    this.logout = this.logout.bind(this);
    this.goToCanvases = this.goToCanvases.bind(this);
    this.takeMeToTheDocs = this.takeMeToTheDocs.bind(this);
    this.handleNodeNameChange = this.handleNodeNameChange.bind(this);
    this.resizeListener = this.resizeListener.bind(this);
    this.keyupListener = this.keyupListener.bind(this);
  }

  goToLanding() {
    this.props.history.push("/");
  }

  goToCanvases() {
    this.props.history.push("/canvases");
  }

  logout() {
    localStorage.removeItem("userID");
    this.props.history.push("/");
  }

  resizeListener() {
    this.setState({
      width: window.innerWidth * 0.95,
      height: window.innerHeight * 0.77
    });
  }

  keyupListener(e) {
    if (e.keyCode === 27) {
      this.setState({
        openConnection: null,
        nodeToAdd: null,
        connector: null
      });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeListener);
    window.addEventListener("keyup", this.keyupListener);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeListener);
    window.removeEventListener("keyup", this.keyupListener);
  }

  async getRoomData() {
    const options = {
      url: `/api/getRoomData/${this.roomID}`,
      method: "GET"
    };

    try {
      const { data } = await axios(options);
      const { nodes, connections, name } = data;
      this.setState({
        nodes,
        connections,
        name
      });
    } catch (err) {
      console.log(err);
    }
  }

  async beginNewConnection(connectee, location) {
    const { connector, nodes, connectorLocation } = this.state;
    if (connector !== connectee) {
      if (connector) {
        const body = {
          connector,
          connectee,
          connectorLocation,
          connecteeLocation: location,
          handleX: (nodes[connector].x + nodes[connectee].x) / 2,
          handleY: (nodes[connector].y + nodes[connectee].y) / 2,
          data: JSON.stringify({
            "": {
              get: {},
              post: {},
              put: {},
              delete: {}
            }
          })
        };

        body.room = this.roomID;
        try {
          const data = await axios.post(
            `/api/canvas/${this.roomID}/connections`,
            body
          );
          this.socket.emit("make connection", { data, room: this.roomID });
        } catch (err) {
          console.log(err);
        }

        this.setState({
          connector: null
        });
      } else {
        this.setState({
          connector: connectee,
          connectorLocation: location
        });
      }
    }
  }

  handleNewConnection({ data }) {
    this.setState({
      connections: { ...this.state.connections, [data.id]: data }
    });
  }

  updateConnection({ id, handleX, handleY }) {
    const connections = { ...this.state.connections };
    connections[id].handleX = handleX;
    connections[id].handleY = handleY;

    this.setState({ connections });
  }

  handleConnectionUpdated(connection) {
    const connections = {
      ...this.state.connections,
      [connection.id]: connection
    };

    this.setState({ connections });
  }

  handleDeleteConnection(id) {
    const connections = JSON.parse(JSON.stringify(this.state.connections));
    delete connections[id];
    this.setState({ connections });
  }

  prepNewNode(type, e) {
    if (type === "MISC") {
      let mouseLocation = {
        x: e.evt.clientX,
        y: e.evt.clientY
      };

      this.setState({
        changingNodeType: true,
        mouseLoc: mouseLocation
      });
    } else {
      this.setState(
        {
          nodeToAdd: type
        },
        () => {
          document.body.style.cursor = "crosshair";
        }
      );
    }
  }

  async emitNewNode(e) {
    if (this.state.nodeToAdd) {
      const x = e.evt.offsetX / this.state.width;
      const y = e.evt.offsetY / this.state.height;
      const data = {
        x,
        y,
        type: this.state.nodeToAdd,
        room: this.roomID
      };

      try {
        const { data: node } = await axios.post(
          `/api/canvas/${this.roomID}/nodes`,
          data
        );
        this.socket.emit("add node", { ...node, room: this.roomID });
        this.setState({ nodeToAdd: null });
      } catch (err) {
        console.log(err);
      }
    }
  }

  handleNewNode(node) {
    const nodes = { ...this.state.nodes, [node.id]: node };
    this.setState({ nodes });
  }

  updateNode(data) {
    const newNodes = JSON.parse(JSON.stringify(this.state.nodes));
    newNodes[data.id].x = data.x;
    newNodes[data.id].y = data.y;
    this.setState({ nodes: newNodes });
  }

  async emitDeleteNode(id) {
    const room = this.roomID;
    try {
      const { data: connections } = await axios.delete(
        `/api/canvas/${room}/nodes/${id}`
      );
      this.socket.emit("delete node", { room, id, connections });
    } catch (err) {
      console.log(err);
    }
  }

  handleDeleteNode(data) {
    const nodes = JSON.parse(JSON.stringify(this.state.nodes));
    const connections = JSON.parse(JSON.stringify(this.state.connections));

    delete nodes[data.id];

    data.connections.forEach(c => {
      delete connections[c];
    });

    this.setState({
      nodes,
      connections
    });
  }

  processScreenshot(type) {
    this.setState(
      {
        showMenu: false
      },
      () => {
        // make a URL to point to the PNG recreation of the canvas
        let screenshotURL = document
          .getElementsByTagName("canvas")[0]
          .toDataURL("image/png");

        if (type === "DOWNLOAD") {
          var a = window.document.createElement("a");
          //set the href to your url, and give it the PNG type.
          (a.href = screenshotURL), { type: "image/png" };
          //set the filename
          a.download = "canvas.png";
          //append download to body
          document.body.appendChild(a);
          //execute click event on element
          a.click();
          // Remove anchor from body
          document.body.removeChild(a);
        }
        if (type === "UPLOAD") {
          const options = {
            method: "POST",
            url: "/api/uploadScreenshot",
            data: {
              canvasID: window.location.href.split("/canvas/")[1],
              image: screenshotURL
            }
          };

          axios(options)
            .then(data => {
              //
            })
            .catch(err => {
              // Actually show user what went wrong
              //
            });
        }
        this.setState({
          showMenu: true
        });
      }
    );
  }

  takeMeToTheDocs() {
    this.setState({ toDocs: true });
  }

  toggleOpenConnection(connection) {
    this.setState({ openConnection: connection || null });
  }

  handleNodeNameChange(e) {
    e.preventDefault();

    this.setState({ miscNodeName: e.target.value });
  }

  emitUpdateConnectionData(data) {
    data.room = this.roomID;
    this.socket.emit("update connection data", data);
  }
  render() {
    const stageStyle = {
      borderRadius: "5px",
      border: "1px solid #394256",
      overflow: "hidden"
    };

    const formContainer = {
      position: "absolute",
      top: this.state.mouseLoc.y,
      left: this.state.mouseLoc.x,
      background: "rgba(255,255,255,0.8)",
      height: "50px",
      width: "200px",
      borderRadius: "5px",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      padding: "10px",
      overflowX: "scroll"
    };

    let conPairs = {};

    if (this.state.toDocs === true) {
      return (
        <Redirect
          to={{
            pathname: `/docs/${window.location.pathname.split("/")[2]}`,
            canvasID: window.location.pathname.split("/")[2]
          }}
        />
      );
    }

    return (
      <div className="canvas-style">
        <div className="header">
          <h1 className="logo-sm" onClick={this.goToLanding}>
            Sketchpad Ninja
          </h1>
        </div>
        <div className="header-bar">
          <div>
            <p className="canvas-name-p ">{this.state.name}</p>
          </div>
          <div>
            <p className="logout-p" onClick={this.logout}>
              Logout
            </p>
            <p className="canvases-p" onClick={this.goToCanvases}>
              {" "}
              Canvases{" "}
            </p>
            <p className="canvases-p" onClick={this.takeMeToTheDocs}>
              Docs
            </p>
            <p
              className="canvases-p"
              onClick={() => this.processScreenshot("DOWNLOAD")}
            >
              Screenshot
            </p>
          </div>
        </div>
        <div style={{ overflow: "hidden" }}>
          <div id="canvas" width={this.state.width} height={this.state.height}>
            <Stage
              style={stageStyle}
              width={this.state.width}
              height={this.state.height}
            >
              <Layer className="canvas">
                <Rect
                  width={this.state.width}
                  height={this.state.height}
                  fill={"rgb(232, 232, 232)"}
                  onMouseDown={this.emitNewNode}
                />
                {Object.keys(this.state.connections).map(id => {
                  let conPair = [
                    this.state.connections[id].connector,
                    this.state.connections[id].connectee
                  ]
                    .sort()
                    .join("");
                  typeof conPairs[conPair] === "undefined"
                    ? (conPairs[conPair] = 1)
                    : conPairs[conPair]++;
                  return (
                    <RouteLine
                      key={id}
                      lineCount={conPairs[conPair]}
                      id={id}
                      room={this.roomID}
                      connection={this.state.connections[id]}
                      nodes={this.state.nodes}
                      socket={this.socket}
                      toggleOpenConnection={this.toggleOpenConnection}
                      nodeScale={Math.min(
                        this.state.height * 0.2,
                        this.state.width * 0.2
                      )}
                      canvasHeight={this.state.height}
                      canvasWidth={this.state.width}
                    />
                  );
                })}
                {Object.values(this.state.nodes).map(node => {
                  let colors = {
                    SERVER: "#ab987a",
                    DATABASE: "#394256",
                    CLIENT: "#ff533d",
                    SERVICES: "#f4b042"
                  };
                  return (
                    <Node
                      key={node.id}
                      node={node}
                      room={this.roomID}
                      socket={this.socket}
                      color={colors[node.type] || "#717f93"}
                      canvasWidth={this.state.width}
                      canvasHeight={this.state.height}
                      scale={Math.min(
                        this.state.height * 0.2,
                        this.state.width * 0.2
                      )}
                      beginNewConnection={this.beginNewConnection}
                      emitDeleteNode={this.emitDeleteNode}
                    />
                  );
                })}
                {this.state.showMenu ? (
                  <Toolbar
                    canvasHeight={this.state.height}
                    canvasWidth={this.state.width}
                    prepNewNode={this.prepNewNode}
                    takeMeToTheDocs={this.takeMeToTheDocs}
                  />
                ) : null}
              </Layer>
            </Stage>
          </div>
          {this.state.openConnection ? (
            <RouteForm
              room={this.roomID}
              socket={this.socket}
              connection={this.state.openConnection} // data={dummyData}
              data={
                Object.keys(this.state.openConnection.data)[0]
                  ? this.state.openConnection.data
                  : { "": {} }
              } // pathName={Object.keys(dummyData)[0]}
              pathName={Object.keys(this.state.openConnection.data)[0]}
              toggleOpenConnection={this.toggleOpenConnection}
              emitUpdateConnectionData={this.emitUpdateConnectionData}
              canvasHeight={this.state.height}
              canvasWidth={this.state.width}
            />
          ) : null}
          {this.state.changingNodeType ? (
            <div style={formContainer}>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  this.prepNewNode(this.state.miscNodeName);
                  this.setState({
                    changingNodeType: false,
                    miscNodeName: ""
                  });
                }}
              >
                <input
                  className="noStyle"
                  type="text"
                  placeholder="Enter type of node"
                  value={this.state.miscNodeName}
                  onChange={this.handleNodeNameChange}
                  style={{ width: "60%" }}
                />
                <button>submit</button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Canvas;
