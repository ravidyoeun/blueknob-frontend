import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Autosuggest from "react-autosuggest";
const languages = [
  {
    name: "C",
    year: 1972,
  },
  {
    name: "C#",
    year: 2000,
  },
  {
    name: "C++",
    year: 1983,
  },
  {
    name: "Clojure",
    year: 2007,
  },
  {
    name: "Elm",
    year: 2012,
  },
  {
    name: "Go",
    year: 2009,
  },
  {
    name: "Haskell",
    year: 1990,
  },
  {
    name: "Java",
    year: 1995,
  },
  {
    name: "Javascript",
    year: 1995,
  },
  {
    name: "Perl",
    year: 1987,
  },
  {
    name: "PHP",
    year: 1995,
  },
  {
    name: "Python",
    year: 1991,
  },
  {
    name: "Ruby",
    year: 1995,
  },
  {
    name: "Scala",
    year: 2003,
  },
];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
const escapeRegexCharacters = (str) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSuggestions = (value) => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === "") {
    return [];
  }

  const regex = new RegExp("^" + escapedValue, "i");
  const suggestions = languages.filter((language) => regex.test(language.name));

  if (suggestions.length === 0) {
    return [{ isAddNew: true }];
  }

  return suggestions;
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: [],
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    });
  };

  getSuggestionValue = (suggestion) => {
    // if (suggestion.isAddNew) {
    //   return this.state.value;
    // }

    return suggestion.modelNum;
  };

  renderSuggestion = (suggestion) => {
    // if (suggestion.isAddNew) {
    //   return (
    //     <span>
    //       [+] Add new: <strong>{this.state.value}</strong>
    //     </span>
    //   );
    // }

    return suggestion.modelNum;
  };

  onSuggestionsFetchRequested = ({ value }) => {
    console.log("call api server", value);

    fetch("http://localhost:5000/api/knob/modelNumb/" + value)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("result", result);
          this.setState({
            suggestions: result,
          });
          // result.map((item) => {
          //   console.log("item.modelNum", item.modelNum);
          //   this.setState({
          //     suggestions: ,
          //   });
          // });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {}
      );
    // this.setState({
    //   suggestions: getSuggestions(value),
    // });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    if (suggestion.isAddNew) {
      console.log("Add new:", this.state.value);
    }
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Find your Model Number",
      value,
      onChange: this.onChange,
    };

    return (
      <div className='App'>
        <header>
          <figure className='thermador-subheader'>
            <a href='https://www.thermador.com/us/' target='_blank'>
              <img
                className='thermador-subheader__logo'
                alt='Thermador Logo Image'
                src='https://waterfilter.thermador.com/Public/img/thermador_logo_small.jpg'
              />
            </a>
          </figure>
        </header>
        <hr></hr>
        <main className='row'>
          <section className='search-form columns small-12'>
            <div className='body'>
              <form id='divWaterFilterForm' _lpchecked='1'>
                {" "}
                <div className='message'>
                  <strong>
                    <span className='thermador-mainheader'>Knobb Finder</span>
                  </strong>
                  <br />
                  <br />
                  <span className='thermador-secondheader-Avenir'>
                    For maximum performance, we recommend changing your filter
                    every 6 months, or when prompted by your refrigerator or
                    freezer. Enter your refrigerator model number below to see
                    which water filter is right for your refrigerator.​ Example:
                    T36IF900SP (do not enter any additional numbers / characters
                    after the model number)
                  </span>
                </div>
                <div className='search'>
                  <div className='row'>
                    <div className='columns medium-3'>
                      <Autosuggest
                        id='SKU'
                        className='ui-autocomplete-input'
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={
                          this.onSuggestionsFetchRequested
                        }
                        onSuggestionsClearRequested={
                          this.onSuggestionsClearRequested
                        }
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        onSuggestionSelected={this.onSuggestionSelected}
                        inputProps={inputProps}
                      />
                    </div>
                    <div
                      className='columns medium-3 end'
                      style={{ paddingLeft: "81px" }}
                    >
                      <input
                        style={{ backgroundColor: "#0073AE" }}
                        name='SaveButton'
                        value='Find my Knobb'
                        className='button button-submit'
                      />
                    </div>
                  </div>
                  <div id='divResultContainer'></div>
                </div>
                <div>
                  <img src='https://waterfilter.thermador.com/Public/img/19-THD-0893_LookForTHDSticker-Update2.jpg' />
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
