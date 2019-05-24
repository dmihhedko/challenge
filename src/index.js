import React, { Component } from "react";
import { render } from "react-dom";
import styled from "styled-components";

const Container = styled.div`
  width: 984px;
  height: 400px;
  background: grey;
  font-family: Helvetica, Arial, sans-serif;
  white-space: pre-line;
  font-size: 16px;
  //background:linear-gradient(90deg, rgba(47,139,142,0.6) 0%, rgba(47,139,142,0.6) 70%, rgba(54,114,65,0.6) 100%);
  //url('https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/07/11/11/harold-0.jpg');
  background-size: cover;
  padding: 40px 60px 10px 30px;
`;

const SearchBar = styled.div`
  display: flex;
`;

const Title = styled.div`
  color: white;
  font-size: 36px;
  margin-bottom: 30px;
`;

const JobInput = styled.input`
  padding: 0;
  width: 250px;
  //font-size: 16px;

  text-indent: 10px;
  height: 35px;
  border-radius: 3px 0 0 3px;
  border: solid 0;
`;

const LocationInput = styled.input`
  padding: 0;
  width: 250px;
  //font-size: 16px;

  text-indent: 10px;
  height: 35px;
  border-radius: 3px 0 0 3px;
  border: solid 0;
`;

const LocationInputWrapper = styled.div`
  position: relative;
`;

const LocationInputDropDown = styled.div`
  height: auto;
  width: 250px;
  position: absolute;
  z-index: 1;
  background-color: white;
  top: 35px;
  right: 0;
`;

const LocationInputDropDownItem = styled.div`
  padding: 10px;
  border-bottom: 1px grey solid;
  cursor: pointer;
`;

const Category = styled.div`
  width: 250px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px;
  height: 35px;
  border-radius: 0 3px 3px 0;
  border: solid 0;
  background-color: #ececec;
  user-select: none;
  position: relative;
  cursor: pointer;
  & > :not(:first-child) {
    cursor: default;
  }
`;

const CategoryText = styled.div`
  white-space: nowrap;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  ${props =>
    props.flip
      ? `border-bottom: 5px solid grey;`
      : `border-top: 5px solid grey;`}
`;

const DropDownWrapper = styled.div`
display: ${props => (props.dropDownOpen ? `block` : `none`)}
       position: absolute;
background: white;
top: 40px;
    right: 0;
width: 500px;
height: 300px; 
z-index: 1;
overflow: auto;
`;

const DropDown = styled.div`
  height: 500px;
`;

const DropDownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  height: 35px;
  border-top: grey 1px solid;
  border-bottom: grey 1px solid;
  font-weight: 700;
`;

const DropDownSection = styled.div`
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
`;

const CheckBox = styled.span`
  flex-basis: 50%;
  cursor: pointer;
  & * {
    cursor: pointer;
  }
 &  input{
 background: white;
 }
`;

const SearchAll = styled.span`
  cursor: pointer;
`;

const topCategories = [
  { name: "IT and telecommunication", id: 1 },
  { name: "Sales and commerce", id: 2 },
  { name: "Production, construction, trade", id: 3 },
  { name: "Management/executive and strategic management", id: 4 },
  { name: "Other", id: 5 },
  { name: "Engineering/technical", id: 6 },
  { name: "Health, medical and social", id: 7 },
  { name: "Finance and accounting", id: 8 }
];

const moreCategories = [
  { name: "Not categorized", id: 9 },
  { name: "Banking, insurance and financial services", id: 10 },
  { name: "Purchasing, transport, logistics", id: 11 },
  { name: "Administration", id: 12 },
  { name: "Marketing and advertising", id: 13 },
  { name: "Training/instruction", id: 14 },
  { name: "Hidden", id: 15 },
  { name: "Hidden", id: 16 },
  { name: "Hidden", id: 17 },
  { name: "Hidden", id: 18 }
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      jobInput:"",
      response: [],
      selectedCategory: "in all categories",
      dropDownOpen: false,
      checkedCheckboxes: [],
      locationInputInFocus: false
    };
  }
  categoryRef = null;

  jsonp = (url, callback) => {
    // Most examples I've found use either jQuery or other similar libraries to handle JSONP,
    // including the API's website
    // It would also be prudent to check the result for malicious content, but we would first need to
    // convert the result to a string, and I don't see how we can do that without XMLHttpRequest requests
    // which defeats the purpose of using JSONP
    // Apparently, there was a website - json-p.org, with more info on JSONP security,
    // but it's no longer available

    const callbackName = "JSONP";
    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      callback(data);
    };
    const script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.categoryRef && !this.categoryRef.contains(event.target)) {
      this.setState({ dropDownOpen: false });
    }
  };

  updateCategoryText = () => {
    const jointArray = [...topCategories, ...moreCategories];
    const namesToAdd = this.state.checkedCheckboxes.map(
      checkedId => jointArray.find(category => category.id === checkedId).name
    );
    const selectedCategory =
      jointArray.length === this.state.checkedCheckboxes.length
        ? "in all categories"
        : namesToAdd.join(", ");

    this.setState({ selectedCategory });
  };

  handleLocationSearch = () => {
    if (this.state.input && this.state.input.length > 2)
      this.jsonp(
        `http://gd.geobytes.com/AutoCompleteCity?callback=JSONP&filter=DE&q=${
          this.state.input
        }`,
        response => this.setState({ response })
      );
  };

  handleCheckBoxClick = id => {
    if (!this.state.checkedCheckboxes.includes(id)) {
      this.setState(
        {
          checkedCheckboxes: this.state.checkedCheckboxes.concat(id)
        },
        () => {
          this.updateCategoryText();
        }
      );
    } else {
      this.setState(
        {
          checkedCheckboxes: this.state.checkedCheckboxes.filter(
            it => it !== id
          )
        },
        () => {
          this.updateCategoryText();
        }
      );
    }
  };

  handleSearchAll = () => {
    const idsToAdd = [...topCategories, ...moreCategories].filter(
      category => !this.state.checkedCheckboxes.includes(category.id)
    );

    this.setState(
      {
        checkedCheckboxes: this.state.checkedCheckboxes.concat(
          idsToAdd.reduce((accum, curr) => [...accum, curr.id], [])
        )
      },
      () => {
        this.updateCategoryText();
      }
    );
  };

  handleLocationInputFocus = locationInputInFocus => {
    this.setState({ locationInputInFocus });
  };

  setInput = input => {
    this.setState({ input });
  };

  render() {
    return (
      <div>
        <Container>
          <div>
            <Title>
              {`asd a asdasd adsadsas adsa
          asd asd asdasd adaa`}
            </Title>
            <SearchBar>
              <JobInput
                type="text"
                value={this.state.jobInput}
                onChange={e => this.setState({ jobInput: e.target.value })}
              />
              <Category
                ref={el => (this.categoryRef = el)}
                onClick={() => {
                  this.setState({ dropDownOpen: !this.state.dropDownOpen });
                }}
              >
                <CategoryText>{this.state.selectedCategory}</CategoryText>
                <Arrow flip={this.state.dropDownOpen} />
                <DropDownWrapper
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  dropDownOpen={this.state.dropDownOpen}
                >
                  <DropDown>
                    <DropDownHeader>
                      <span> Top Categories</span>
                      <SearchAll onClick={() => this.handleSearchAll()}>
                        {" "}
                        Search in all categories
                      </SearchAll>
                    </DropDownHeader>
                    <DropDownSection>
                      {topCategories.map((category, idx) => (
                        <CheckBox key={idx}>
                          {" "}
                          <label>
                            <input
                              onChange={() => {
                                this.handleCheckBoxClick(category.id);
                              }}
                              type="checkbox"
                              value={category.name}
                              checked={this.state.checkedCheckboxes.includes(
                                category.id
                              )}
                            />{" "}
                            {category.name}
                          </label>
                        </CheckBox>
                      ))}
                    </DropDownSection>
                    <DropDownHeader>
                      <span> More Categories </span>
                    </DropDownHeader>
                    <DropDownSection>
                      {moreCategories.map((category, idx) => (
                        <CheckBox key={idx}>
                          {" "}
                          <label>
                            <input
                              onChange={() => {
                                this.handleCheckBoxClick(category.id);
                              }}
                              type="checkbox"
                              value={category.name}
                              checked={this.state.checkedCheckboxes.includes(
                                category.id
                              )}
                            />{" "}
                            {category.name}
                          </label>
                        </CheckBox>
                      ))}
                    </DropDownSection>
                  </DropDown>
                </DropDownWrapper>
              </Category>
              <LocationInputWrapper>
                <LocationInput
                  type="text"
                  value={this.state.input}
                  onChange={e =>
                    this.setState({ input: e.target.value }, () =>
                      this.handleLocationSearch()
                    )
                  }
                  onFocus={() => {
                    this.handleLocationInputFocus(true);
                  }}
                />
                {this.state.locationInputInFocus && (
                  <LocationInputDropDown>
                    {this.state.response.map((item, idx) => (
                      <LocationInputDropDownItem
                        key={idx}
                        onClick={() => {
                          this.setInput(item);
                          this.handleLocationInputFocus(false);
                        }}
                      >
                        {item}
                      </LocationInputDropDownItem>
                    ))}
                  </LocationInputDropDown>
                )}
              </LocationInputWrapper>
              <button> Search</button>
            </SearchBar>
          </div>
        </Container>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
