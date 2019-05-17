import React, { Component } from 'react';
import { render } from 'react-dom';
import styled from "styled-components";

const Container = styled.div`
width:984px;
height:400px;
background:linear-gradient(90deg, rgba(47,139,142,0.6) 0%, rgba(47,139,142,0.6) 70%, rgba(54,114,65,0.6) 100%);
//url('https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/07/11/11/harold-0.jpg');
background-size: cover;
padding: 40px 60px 10px 30px;
`;

const SearchBar = styled.div`
    display: flex;
`;

const Header = styled.div`
color:white;
font-size: 36px;
font-family:Helvetica, Arial, sans-serif;white-space: pre-line;
margin-bottom: 30px;
`;

const JobInput = styled.input`
    height: 35px;
    border-radius: 3px 0 0 3px;
    border: solid 0;
`;


const LocationInput = styled.input`
    height: 35px;
    border-radius: 3px 0 0 3px;
    border: solid 0;
`;

const Category = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px;
    height: 35px;
    width: 170px;
    border-radius: 0 3px 3px 0;
    border: solid 0;
    background-color: #ECECEC;
    user-select: none;
`;

const Arrow = styled.div`
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  ${props => props.flip ? `border-bottom: 5px solid black;` : `border-top: 5px solid black;`}
`;

// use hooks
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      response: [],
      selectedCategory: "in all categories",
      categoriesOpen: false
    };
  }

  jsonp = (url, callback) => {
    // It would also to be nice to check if there's any malicious content
    var callbackName = 'JSONP';
    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      callback(data);
    };
    var script = document.createElement('script');
    script.src =
      url;
    document.body.appendChild(script);
  };


  componentDidMount() {
  }

  handleEnterPress = () => {
    if (this.state.input && this.state.input.length > 2)
      this.jsonp(
        `http://gd.geobytes.com/AutoCompleteCity?callback=JSONP&filter=DE&q=${this.state.input}`,
        response => this.setState({ response })
      );
  };

  render() {
    console.log(this.state.response);
    return (
      <div>
        <Container>
          <div>
            <Header>{`For a better working life
          The new HAROLD jobs`}
            </Header>
            <SearchBar>
              <JobInput type="text" value={this.state.input} />
              <Category onClick={() => {
                this.setState({ categoriesOpen: !this.state.categoriesOpen })
              }}>
                <div>{this.state.selectedCategory}</div>
                <Arrow flip={this.state.categoriesOpen} /> </Category>
              <LocationInput type="text" value={this.state.input}
                             onChange={e => this.setState({ input: e.target.value })}
                             onKeyPress={this.handleEnterPress} />
              <button> Search</button>
            </SearchBar>
          </div>
        </Container>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
