import React, { useState, useRef, useEffect } from "react";
import { render } from "react-dom";
import styled from "styled-components";

const Container = styled.div`
  width: 984px;
  height: 400px;
  background: grey;
  font-family: "Xing Sans", "Trebuchet MS", Verdana, sans-serif;
  white-space: pre-line;
  font-size: 14px;
  background: linear-gradient(
      90deg,
      rgba(47, 139, 142, 0.6) 0%,
      rgba(47, 139, 142, 0.6) 70%,
      rgba(54, 114, 65, 0.6) 100%
    ),
    url("https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/07/11/11/harold-0.jpg");
  background-size: cover;
  padding: 40px 60px 10px 30px;
  background-position-y: top, -60px;
`;

const SearchBar = styled.div`
  display: flex;
`;

const Button = styled.div`
  color: black;
  font-weight: 700;
  background-image: linear-gradient(to bottom, #bde300 0, #8fac00 100%);
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  user-select: none;
  cursor: pointer;
`;

const Title = styled.div`
  color: white;
  font-size: 36px;
  margin-bottom: 40px;
  font-weight: 200;
`;

const JobInput = styled.input`
  padding: 0;
  width: 250px;

  text-indent: 10px;
  height: 35px;
  border-radius: 3px 0 0 3px;
  border: solid 0;
`;

const LocationInput = styled.input`
  padding: 0;
  width: 250px;
  margin-right: 15px;

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
  width: 248px;
  position: absolute;
  z-index: 1;
  background-color: white;
  top: 36px;
  right: 16px;
`;

const LocationInputDropDownItem = styled.div`
  padding: 5px 10px;
  border-bottom: 1px grey solid;
  cursor: pointer;
`;

const Category = styled.div`
  width: 250px;
  margin-right: 15px;
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
height: 380px;
z-index: 1;
overflow: auto;

::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  border-radius: 5px;
}
`;

const DropDownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  height: 40px;
  border-top: lightgrey 1px solid;
  border-bottom: lightgrey 1px solid;
  font-weight: 700;

  & :nth-child(2) {
    color: #007575;
    font-weight: 400;
  }
`;

const DropDownSection = styled.div`
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
`;

const CheckBox = styled.span`
  flex-basis: 50%;
  cursor: pointer;
  margin-bottom: 15px;
  & * {
    cursor: pointer;
  }
  & > :first-child {
    display: block;
    position: relative;
    padding-left: 25px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  & input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  & span {
    position: absolute;
    top: 0;
    left: 0;
    height: 12px;
    width: 12px;
    background-color: white;
    border: 1px solid lightgrey;
    border-radius: 3px;
  }

  & span:after {
    content: "";
    position: absolute;
    display: none;
  }

  & > :first-child input:checked ~ span:after {
    display: block;
  }

  > :first-child span:after {
    color: #007575;
    left: 3px;
    top: 0px;
    width: 4px;
    height: 8px;
    border: solid;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
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

function App() {
  const [input, setInput] = useState("");
  const [jobInput, setJobInput] = useState("");
  const [response, setResponse] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("in all categories");
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [checkedCheckboxes, setCheckedCheckboxes] = useState([]);
  const [locationInputInFocus, setLocationInputInFocus] = useState(false);
  const categoryRef = useRef(null);

  const jsonp = (url, callback) => {
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

  const handleClickOutside = event => {
    if (categoryRef && !categoryRef.current.contains(event.target)) {
      setDropDownOpen(false);
    }
  };

  const updateCategoryText = () => {
    if (checkedCheckboxes.length > 0) {
      const jointArray = [...topCategories, ...moreCategories];
      const namesToAdd = checkedCheckboxes.map(
        checkedId => jointArray.find(category => category.id === checkedId).name
      );
      const selectedCategory =
        jointArray.length === checkedCheckboxes.length
          ? "in all categories"
          : namesToAdd.join(", ");

      setSelectedCategory(selectedCategory);
    }
  };

  const handleLocationSearch = () => {
    if (input && input.length > 2)
      jsonp(
        `http://gd.geobytes.com/AutoCompleteCity?callback=JSONP&filter=DE&q=${input}`,
        response => setResponse(response)
      );
  };

  const handleCheckBoxClick = id => {
    if (!checkedCheckboxes.includes(id)) {
      setCheckedCheckboxes(checkedCheckboxes.concat(id));
    } else {
      setCheckedCheckboxes(checkedCheckboxes.filter(it => it !== id));
    }
  };

  const handleSearchAll = () => {
    const idsToAdd = [...topCategories, ...moreCategories].filter(
      category => !checkedCheckboxes.includes(category.id)
    );

    setCheckedCheckboxes(
      checkedCheckboxes.concat(
        idsToAdd.reduce((accum, curr) => [...accum, curr.id], [])
      )
    );
  };

  useEffect(() => {
    updateCategoryText();
    handleLocationSearch();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const dropDownSection = array => (
    <DropDownSection>
      {array.map((category, idx) => (
        <CheckBox key={idx}>
          {" "}
          <label>
            <input
              onChange={() => {
                handleCheckBoxClick(category.id);
              }}
              type="checkbox"
              value={category.name}
              checked={checkedCheckboxes.includes(category.id)}
            />{" "}
            <span />
            {category.name}
          </label>
        </CheckBox>
      ))}
    </DropDownSection>
  );

  return (
    <div>
      <Container>
        <div>
          <Title>
            {`For a better working life
            The new XING jobs`}
          </Title>
          <SearchBar>
            <JobInput
              type="text"
              value={jobInput}
              onChange={e => setJobInput(e.target.value)}
              placeholder={"Enter keyword"}
            />
            <Category
              ref={categoryRef}
              onClick={() => setDropDownOpen(!dropDownOpen)}
            >
              <CategoryText>{selectedCategory}</CategoryText>
              <Arrow flip={dropDownOpen} />
              <DropDownWrapper
                onClick={e => {
                  e.stopPropagation();
                }}
                dropDownOpen={dropDownOpen}
              >
                <div>
                  <DropDownHeader>
                    <span> Top Categories</span>
                    <SearchAll onClick={() => handleSearchAll()}>
                      {" "}
                      Search in all categories
                    </SearchAll>
                  </DropDownHeader>
                  {dropDownSection(topCategories)}
                  <DropDownHeader>
                    <span> More Categories </span>
                  </DropDownHeader>
                  {dropDownSection(moreCategories)}
                </div>
              </DropDownWrapper>
            </Category>
            <LocationInputWrapper>
              <LocationInput
                type="text"
                placeholder={"Location"}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                }}
                onFocus={() => {
                  setLocationInputInFocus(true);
                }}
                onKeyPress={e => {
                  /* eslint-disable-next-line */
                  e.charCode === 13 ? alert("submitted") : undefined;
                }}
              />
              {locationInputInFocus && (
                <LocationInputDropDown>
                  {response.map((item, idx) => (
                    <LocationInputDropDownItem
                      key={idx}
                      onClick={() => {
                        setInput(item);
                        setLocationInputInFocus(false);
                      }}
                    >
                      {item}
                    </LocationInputDropDownItem>
                  ))}
                </LocationInputDropDown>
              )}
            </LocationInputWrapper>
            <Button
              onClick={() => {
                alert("submitted");
              }}
            >
              {" "}
              Search
            </Button>
          </SearchBar>
        </div>
      </Container>
    </div>
  );
}

render(<App />, document.getElementById("root"));
