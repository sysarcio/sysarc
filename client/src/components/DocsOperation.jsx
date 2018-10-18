import React from 'react';
import Response from './DocsResponse.jsx';
import Parameter from './DocsParameter.jsx';

class DocsOperation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false
    }

    this.expand = this.expand.bind(this);
  }

  expand(e) {
    this.setState({
      show: !this.state.show
    })
    // console.log(this.state.show);
  }

  render() {
    // console.log(`Object passed from DocsOperation to DocsResponse: \n`);
    // console.log(this.props.operation.responses);
    // console.log(`Object passed from DocsOperation to DocsParameter: \n`);
    // console.log(this.props.operation.parameters);
    const pathCeptionThePathRises = (responses) => {
      return Object.values(responses).map((response, index) => {
        return (
          <Response
            key={index}
            statusCode={Object.keys(responses)[index]}
            response={response}
          />  
        )
      })
    }
    const groupExamples = (parameters) => {
      const examples = {
        query: [],
        body: [],
        path: [],
        formData: [],
        header: []
      }
      parameters.map((param) => {
        if (param.in === 'query') {
          examples.query.push(param)
        } else if (param.in === 'body') {
          examples.body.push(param)
        } else if (param.in === 'path') {
          examples.path.push(param)
        } else if (param.in === 'formData') {
          examples.formData.push(param)
        } else if (param.in === 'header') {
          examples.header.push(param)
        }
      })
      // console.log('returning examples: ', examples);
      return examples;
    }



    const formatExample = (paramsArray) => {
      if (paramsArray[0].in === 'query') {
        let output = `Example query: ${this.props.pathName}?`;
        paramsArray.forEach((element, idx) => {
          output += `${element.name}=YOUR_INPUT_HERE`
          if (idx !== paramsArray.length-1) {
            output += '&'
          }
          return output;
        })
        return (
          <code>
            {output}
          </code>
        )
      } else if (paramsArray[0].in === 'body') {
        // console.log(paramsArray);
        let output = 'Example body object: { ';
        paramsArray.forEach((element, idx) => {
          output += `"${element.name}": YOUR_INPUT_HERE`
          if (idx !== paramsArray.length-1) {
            output += ', '
          } else {
            output += ' }'
          }
          return output;
        })
        return (
          <code>
            {output}
          </code>
        )
      } else if (paramsArray[0].in === 'path') {
        // console.log(paramsArray);
        let output = `Example path: ${this.props.pathName}/`;
        paramsArray.forEach((element, idx) => {
          output += `YOUR_INPUT_HERE`
          if (idx !== paramsArray.length-1) {
            output += '/'
          }
          return output;
        })
        return (
          <code>
            {output}
          </code>
        )
      } else if (paramsArray[0].in === 'formData') {
        // console.log(paramsArray);
        let output = `Example with curl: curl -X ${this.props.method.toUpperCase()} "${this.props.pathName}" -H "Content-Type: application/x-www-form-urlencoded" -d `;
        paramsArray.forEach((element, idx) => {
          if (idx === 0) {
            output += '"'
          }
          output += `${element.name}=YOUR_INPUT_HERE`
          if (idx !== paramsArray.length-1) {
            output += '&'
          } else {
            output += '"'
          }
          return output;
        })
        return (
          <code>
            {output}
          </code>
        )
      } else if (paramsArray[0].in === 'header') {
        // console.log(paramsArray);
        let output = `Example with curl: curl -X ${this.props.method.toUpperCase()} "${this.props.pathName}" -H `;
        paramsArray.forEach((element, idx) => {
          if (idx === 0) {
            output += '"'
          }
          output += `${element.name}:YOUR_INPUT_HERE`
          if (idx !== paramsArray.length-1) {
            output += ', '
          } else {
            output += '"'
          }
          return output;
        })
        return (
          <code>
            {output}
          </code>
        )
      }
    }

    const generateExamples = (parameters) => {
      return (
        <div>
          {Object.values(groupExamples(parameters)).map((example, i) => {
            {if(example.length>0){return <div key={i}>{formatExample(example)}</div>}}
          })}
        </div>
      )
    }


    const pathCeptionThePathBegins = (parameters) => {
      // console.log(parameters);
      return (
        <div>
        {Object.values(parameters).map((param, index) => {
            return (
                  <Parameter
                    key={index}
                    param={param}
                  />
            )
          })}
        {generateExamples(parameters)}

        </div>
      )
    }

    return (
      <div className="docs-operation">
        <div onClick={this.expand}>
          <pre>  Method/Operation: {this.props.method}</pre>
        </div>
        {this.state.show && (
          <div>
            <div>
              <pre>    Description: {this.props.operation.description}</pre>
            </div>
            <div className="docs-parameter">
              Parameters:<br/>
              {pathCeptionThePathBegins(this.props.operation.parameters)}
            </div>
            <div>
              <pre>    Responses: </pre>
              {pathCeptionThePathRises(this.props.operation.responses)}
            </div>
          </div>)
        }
      </div>
    )
  }
}

export default DocsOperation;