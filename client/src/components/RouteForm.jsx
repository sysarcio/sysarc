import React, { Component } from 'react';

class RouteForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathName: this.props.pathName,
      previousPathName: '',
      selectedMethod: '',
      methods: ['get', 'post', 'put', 'delete'],
      get: this.props.data[this.props.pathName]['get'] ? this.props.data[this.props.pathName]['get'] : {},
      post: this.props.data[this.props.pathName]['post'] ? this.props.data[this.props.pathName]['post'] : {},
      put: this.props.data[this.props.pathName]['put'] ? this.props.data[this.props.pathName]['put'] : {},
      delete: this.props.data[this.props.pathName]['delete'] ? this.props.data[this.props.pathName]['delete'] : {},
    };

    this.handleSave = this.handleSave.bind(this);
    this.handlePathChange = this.handlePathChange.bind(this);
    this.handleMethodDescriptionChange = this.handleMethodDescriptionChange.bind(this);
    this.selectMethod = this.selectMethod.bind(this);
    this.cloneMethod = this.cloneMethod.bind(this);
    this.handlePropertyEdit = this.handlePropertyEdit.bind(this);
    this.handleAddParameter = this.handleAddParameter.bind(this);
    this.handleAddResponse = this.handleAddResponse.bind(this);
  }

  handleSave(e) {
    // e.preventDefault();
    const connection = this.props.connection;
    // console.log(this.state.previousPathName)
    connection.data = {
      [this.state.pathName]: {
        'get': this.state.get,
        'post': this.state.post,
        'put': this.state.put,
        'delete': this.state.delete
      }
    };
    // console.log('connection: ', connection);
    // console.log('data object: ', connection.data);
    this.props.emitUpdateConnectionData(connection);
    this.props.toggleOpenConnection();
  }



  handlePathChange(e) {
    this.setState({
      // previousPathName: this.state.pathName,
      pathName: e.target.value,
    });
  }

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
      }
    }
    // console.log('new clone: ', clone)
    return clone;
  }

  handleAddParameter(methodName, clone) {
    // console.log(methodName)
    clone.parameters.push({
      name: '',
      type: 'string',
      in: 'query',
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
      // console.log('method after adding parameter: ', this.state[methodName]);
    })
        
  }

  handleAddResponse(methodName, clone) {
    // console.log(methodName)
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
      // console.log('method after adding response: ', this.state[methodName]);
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
      top: Math.max((this.props.connection.handleY * this.props.canvasHeight) + 25, 0),
      left: (this.props.connection.handleX * this.props.canvasWidth) + 3.5 - 100,
      background: 'rgba(255,255,255,0.8)',
      height: '210px',
      width: '300px',
      borderRadius: '5px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '10px',
      overflowX: 'scroll'
    }

    const formStyle = {
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      width: '90%'
    }

    const inputStyle = {
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      width: '100%'
    }

    const saveStyle = {
      marginTop: 'auto',
      // justifyContent: 'center',
      width: '100%'
    }
    // console.log('pathName in state: ', this.state.pathName);
    // console.log('get in state: ', this.state.get);
    // console.log('props: ', this.props);
    // console.log('get in methods is equal to key get: ', this.state.methods[0] === Object.keys(this.state)[3])
    return (
      <div style={formContainer}>
        <form style={formStyle}>
          <input 
            style={inputStyle}
            className='noStyle'
            type="text"
            placeholder="Enter path..."
            value={this.state.pathName}
            onChange={this.handlePathChange}
            style={inputStyle}
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
                  style={inputStyle}
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
                        <div>
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => {this.handlePropertyEdit(e, m, method, 'parameters', 'name', i)}}
                            placeholder="Enter parameter name..."
                            style={inputStyle}
                          />
                        </div>                      
                        <div>
                          <input
                            type="text"
                            value={p.description}
                            onChange={(e)=> {this.handlePropertyEdit(e, m, method, 'parameters', 'description', i)}}
                            placeholder="Enter parameter description..."
                            style={inputStyle}
                          />
                        </div>
                        <select
                          value={p.in}
                          onChange={(e) => {this.handlePropertyEdit(e, m, method, 'parameters', 'in', i)}}
                          style={{width: "33%"}}
                        >
                          <option value="query">query</option>
                          <option value="body">body</option>
                          <option value="path">path</option>
                        </select>
                        <select
                          value={p.type}
                          onChange={(e) => {this.handlePropertyEdit(e, m, method, 'parameters', 'type', i)}}
                          style={{width: "33%"}}
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
                            style={{width: "33%"}}
                          >
                            <option value="true">Required</option>
                            <option value="false">Not Required</option>
                          </select>
                        }
                      </div>
                    )
                  })}
                  {method.parameters.length > 0 && (<button type='button' onClick={()=>{this.handleAddParameter(m, method)}}>New Parameter</button>)}
                  {Object.keys(method.responses).length > 0 ? <div>Responses:</div> : <button type='button' onClick={()=>{this.handleAddResponse(m, method)}}>New Response</button>}
                  {Object.keys(method.responses).map((r, i) => {
                    return (
                      <div key={i}>
                        <div><input style={inputStyle} type='text' placeholder='Enter response status code...' value={r} onChange={(e) => {this.handlePropertyEdit(e, m, method, 'responses', r, i)}}/></div>
                        <div><input style={inputStyle} type='text' placeholder='Enter response description...' value={method.responses[r].description} onChange={(e) => {this.handlePropertyEdit(e, m, method, 'responses', 'description', r)}}/></div>
                      </div>
                    )
                  })}
                  {Object.keys(method.responses).length && (<button type='button' onClick={()=>{this.handleAddResponse(m, method)}}>New Response</button>)}
                  </div>
                )}
              </div>
            )
          }})}

          <button
            type="button"
            value="SAVE"
            onClick={this.handleSave}
            style={saveStyle}
          >Save</button>
        </form>
      </div>
    );
  }
}

export default RouteForm;