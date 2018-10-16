import React, { Component } from 'react';

class RouteForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathName: this.props.pathName,
      selectedMethod: '',
      methods: ['get', 'post', 'put', 'delete'], // which method is the user currently editing?

      // get: {
      //   description: 'method description',
      //   parameters: [
      //     {
      //       name: 'param name',
      //       type: 'integer',
      //       in: 'query',
      //       required: false,
      //       description: 'description'
      //     }
      //   ],
      //   responses: {
      //     '200': {
      //       description: 'response description',
      //     }
      //   }
      // },
      // post: {},
      // put: {},
      // delete: {}

      get: this.props.data[this.props.pathName]['get'] ? this.props.data[this.props.pathName]['get'] : {},
      post: this.props.data[this.props.pathName]['post'] ? this.props.data[this.props.pathName]['post'] : {},
      put: this.props.data[this.props.pathName]['put'] ? this.props.data[this.props.pathName]['put'] : {},
      delete: this.props.data[this.props.pathName]['delete'] ? this.props.data[this.props.pathName]['delete'] : {},
      // data: {},
    };

    this.handleSave = this.handleSave.bind(this);
    this.handlePathChange = this.handlePathChange.bind(this);
    // this.handleMethodChange = this.handleMethodChange.bind(this);
    this.handleMethodDescriptionChange = this.handleMethodDescriptionChange.bind(this);
    this.selectMethod = this.selectMethod.bind(this);
    this.cloneMethod = this.cloneMethod.bind(this);
    this.handlePropertyEdit = this.handlePropertyEdit.bind(this);
    this.handleAddParameter = this.handleAddResponse.bind(this);
    this.handleAddResponse = this.handleAddResponse.bind(this);
  }

  handleSave(e) {
    e.preventDefault();
    const connection = this.props.connection;
    connection.data = {
      [this.state.pathName]: {
        'get': this.state.get,
        'post': this.state.post,
        'put': this.state.put,
        'delete': this.state.delete
      }
    };
    console.log('connection: ', connection);
    console.log('data object: ', connection.data);
    this.props.emitUpdateConnectionData(connection);
    // this.props.toggleOpenConnection();
  }



  handlePathChange(e) {
    const data = JSON.parse(JSON.stringify(this.state.data));
    data[e.target.value] = undefined

    this.setState({
      currPath: e.target.value,
      data
    });
  }

  // handleMethodChange(e) {
  //   this.setState({
  //     currMethod: e.target.value
  //   });
  // }

  handleMethodDescriptionChange(e) {
    this.setState({
      methodDescription: e.target.value
    })
  }

  selectMethod(e) {
    const currentMethod = e.target.innerText;
    if (this.state.selectedMethod === currentMethod ) {
      this.setState({
        selectedMethod: ''
      })
    } else {
      this.setState({
        selectedMethod: e.target.innerText
      }, ()=> {
        // console.log('selected method after setState: ', this.state.selectedMethod)
      })
    }
  }

  cloneMethod(clone) {
    // console.log('cloning parameters: ', clone.parameters)
    const methodPropertiesList = ['description', 'parameters', 'responses'];
    if (clone) {
      methodPropertiesList.map((property)=> {
        if (!clone[property]) {
          if (property === 'description') {
            clone.description = '';
          } else if (property === 'responses') {
            clone.responses = {
              '':{
                description: ''
              }
            }
          } else if (property === 'parameters') {
            clone.parameters = []
            // {
            //   name: '',
            //   type: '',
            //   in: '',
            //   required: false,
            //   description: ''
            // }
          }
        }
      })
    } else {
      clone = {
        description: '',
        responses: {
          '':{
            description: ''
          }
        },
        parameters: []
        // {
        //   name: '',
        //   type: '',
        //   in: '',
        //   required: false,
        //   description: ''
        // }
      }
    }
    // console.log('new clone: ', clone)
    return clone;
  }

  handleAddParameter(methodName, clone) {
    console.log(methodName)
    clone.parameters.push({
      name: '',
      type: '',
      in: '',
      required: false,
      description: ''
    })
    this.setState((prevState) => ({
      [methodName]: Object.assign({}, prevState.methodName, {
        description: this.state[methodName].description,
        parameters: clone.parameters,
        responses: this.state[methodName].responses
      })
    }), () => {
      console.log('method after adding parameter: ', this.state[methodName]);
    })
        
  }

  handleAddResponse(methodName, clone) {
    console.log(methodName)
    clone.responses[''] = { 
      description: ''
    }
    this.setState((prevState) => ({
      [methodName]: Object.assign({}, prevState.methodName, {
        description: this.state[methodName].description,
        parameters: this.state[methodName].parameters,
        responses: clone.responses
      })
    }), () => {
      console.log('method after adding parameter: ', this.state[methodName]);
    })
        
  }

  handlePropertyEdit(e, propertyName, clone, outerKey, innerKey, index) {
    // console.log(this.state[propertyName])
    if(outerKey ==='parameters') {
      clone.parameters[index][innerKey] = e.target.value;
      this.setState((prevState) => ({
        [propertyName]: Object.assign({}, prevState.propertyName, {
          description: this.state[propertyName].description,
          parameters: clone.parameters,
          responses: this.state[propertyName].responses
        })
      }), () => {
        // console.log(this.state[propertyName]);
      })
    } else if(outerKey ==='responses') {
      if (innerKey === 'description') {
        clone.responses[index].description = e.target.value;
      } else {
        clone.responses[e.target.value] = clone.responses[innerKey];
        delete clone.responses[innerKey];
      }
      this.setState((prevState) => ({
        [propertyName]: Object.assign({}, prevState.propertyName, {
          description: this.state[propertyName].description,
          parameters: this.state[propertyName].parameters,
          responses: clone.responses
        })
      }), () => {
        // console.log(this.state[propertyName]);
      })
    } else if(outerKey==='description') {
      clone.description = e.target.value;
      this.setState((prevState) => ({
        [propertyName]: Object.assign({}, prevState.propertyName, {
          description: clone.description,
          parameters: this.state[propertyName].parameters,
          responses: this.state[propertyName].responses
        })
      }), () => {
        // console.log(this.state[propertyName]);
      })
    }

  }

  render() {
    const formContainer = {
      position: 'absolute',
      top: Math.max(this.props.connection.handleY - 200, 0),
      left: this.props.connection.handleX + 3.5 - 100,
      background: 'rgba(255,255,255,0.8)',
      height: '400px',
      width: '400px',
      borderRadius: '5px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '20px',
      overflowX: 'scroll'
    }

    const formStyle = {
      display: 'flex',
      flexDirection: 'column',
    }

    const saveStyle = {
      marginTop: 'auto'
    }
    // console.log('pathName in state: ', this.state.pathName);
    // console.log('get in state: ', this.state.get);
    // console.log('props: ', this.props);
    // console.log('get in methods is equal to key get: ', this.state.methods[0] === Object.keys(this.state)[3])
    return (
      <div style={formContainer}>
        <form style={formStyle}>
          <input
            className='noStyle'
            type="text"
            placeholder="Enter path..."
            value={this.state.pathName}
            onChange={this.handlePathChange}
            style={{width: "100%"}}
          />

          {this.state.methods.map((m, i) => {
            if(this.state[m]) {
            // console.log('current m: ', this.state[m]);
            const method = this.cloneMethod(this.state[m]);
            // console.log('cloned object: ', method)
            return (
              <div key={i}>
                <div onClick={(e, method)=> {this.selectMethod(e, method)}}>
                  {m.toUpperCase()}
                </div>
                <input 
                  className='noStyle'
                  type="text" 
                  value={method.description}
                  placeholder={`Enter ${m} description`} 
                  onChange={(e)=> {this.handlePropertyEdit(e, m, method, 'description')}}
                />
                {this.state.selectedMethod === m.toUpperCase() && (
                  <div>
                    {method.parameters.length > 0 ? <div>Parameters:</div> : <button className='noStyle' type='button' onClick={()=>{this.handleAddParameter(m, method)}}>New Parameter</button>}
                    {method.parameters.map((p, i) => {
                    // console.log(method); 
                    return (
                      <div key={i}>
                        {/* <div> */}
                          
                        <div>
                          {/* {p.name} */}
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => {this.handlePropertyEdit(e, m, method, 'parameters', 'name', i)}}
                            placeholder="Enter parameter name..."
                            style={{width: "70%"}}
                          />
                        </div>                      
                        <div>
                          {/* {p.description} */}
                          <input
                            type="text"
                            value={p.description}
                            onChange={(e)=> {this.handlePropertyEdit(e, m, method, 'parameters', 'description', i)}}
                            placeholder="Enter parameter description..."
                            style={{width: "70%"}}
                          />
                        </div>
                        <select
                          value={p.in}
                          onChange={(e) => {this.handlePropertyEdit(e, m, method, 'parameters', 'in', i)}}
                          style={{width: "30%"}}
                        >
                          <option value="query">query</option>
                          <option value="body">body</option>
                          <option value="path">path</option>
                        </select>
                        <select
                          value={p.type}
                          onChange={(e) => {this.handlePropertyEdit(e, m, method, 'parameters', 'type', i)}}
                          style={{width: "30%"}}
                        >
                          <option value="string">string</option>
                          <option value="array">array</option>
                          <option value="integer">integer</option>
                        </select>
                        {p.in === 'path' ? 
                          <div>
                            Required
                          </div>
                          :
                          <select
                            value={p.required}
                            onChange={(e) => {this.handlePropertyEdit(e, m, method, 'parameters', 'required', i)}}
                            style={{width: "30%"}}
                          >
                            <option value="true">Required</option>
                            <option value="false">Not Required</option>
                          </select>
                        }
                      {/* </div> */}
                      </div>
                    )
                  })}
                  {method.parameters.length > 0 && (<button type='button' onClick={()=>{this.handleAddParameter(m, method)}}>New Parameter</button>)}
                  {Object.keys(method.responses).length > 0 ? <div>Responses:</div> : <button type='button' onClick={()=>{this.handleAddResponse(m, method)}}>New Response</button>}
                  {Object.keys(method.responses).map((r, i) => {
                    return (
                      <div key={i}>
                        <div><input type='text' placeholder='Enter response status code...' value={r} onChange={(e) => {this.handlePropertyEdit(e, m, method, 'responses', r, i)}}/></div>
                        <div><input type='text' placeholder='Enter response description...' value={method.responses[r].description} onChange={(e) => {this.handlePropertyEdit(e, m, method, 'responses', 'description', r)}}/></div>
                      </div>
                    )
                  })}
                  {Object.keys(method.responses).length && (<button type='button' onClick={()=>{this.handleAddResponse(m, method)}}>New Response</button>)}
                  </div>
                )}
              </div>
            )
          }})}

          {/* {this.state.path ? 
            <div
              style={{display: 'flex', flexWrap: 'wrap'}}
            >
              <select
                value={this.state.method}
                onChange={this.handleMethodChange}
                style={{width: "30%"}}
              >
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="POST">POST</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                value={this.state.methodDescription}
                onChange={this.handleMethodDescriptionChange}
                placeholder="Enter request description..."
                style={{width: "70%"}}
              />
              <button>+ Param</button>
            </div>
          :
            null
          } */}
          <input
            type="submit"
            value="SAVE"
            onClick={this.handleSave}
            style={saveStyle}
          />
        </form>
      </div>
    );
  }
}

export default RouteForm;