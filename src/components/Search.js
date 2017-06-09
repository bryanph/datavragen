import React, { Component } from 'react'
import cn from 'classnames'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import ReactCSSTransitionReplace from 'react-css-transition-replace';

import Results from './Results'

import Autosuggest from 'react-autosuggest';

// Imagine you have a list of languages that you'd like to autosuggest.
const questionList = [
  {
    q: 'Hoe lang is een Chinees?',
  },
  {
    q: 'Wie had de meeste nevenfuncties in de Tweede Kamer?',
  },
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : questionList.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input element
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);




class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      question: '',
      search: false,
      suggestions: [],
    }
    this.enterQuestion = this.enterQuestion.bind(this)
    this.search = this.search.bind(this)
  }
  enterQuestion(e) {
    this.setState({
      question: e.target.value
    })
  }

  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(value)
    })
  }
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    })
  }

  search() {
    this.setState({
      search: true
    })
  }
  render() {
    return (
      <ReactCSSTransitionReplace
        transitionName="search"
        transitionEnterTimeout={100000}
        transitionLeaveTimeout={100000}>
        {this.state.search ?
          <div className="search-wrap top" key={1}>
            <SearchTopBar question={this.state.question} enterQuestion={this.enterQuestion} search={this.search}/>
            <Results />
          </div>
          :
          <SearchMain 
            key={2} 
            question={this.state.question}
            enterQuestion={this.enterQuestion} 
            search={this.search}
            suggestions={suggestions}/>
        }
      </ReactCSSTransitionReplace>
    )   
  }
}


class SearchMain extends Component {
  render() {
    return (
      <div id="search-full" className='search-wrap'>
        <div className="row">
          <div className="search-header columns small-12 text-center">
            <h1>Wat wil je weten?</h1>
            <h5 className="subheader">Stel een vraag over de Tweede Kamer</h5>
          </div>
        </div>
        <div className="row align-center">
          <div className="search-box columns small-12 text-center">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
            />

            <input type="text" id="search" placeholder="Vul je vraag in" value={this.props.question} onChange={this.props.enterQuestion} />
            <input type="submit" className="button large" value="Zoek" onClick={this.props.search}/>
            <button className="button large secondary">Random vraag</button>
          </div>
        </div>
      </div>
    )
  }
}

class SearchTopBar extends Component {
  render() {
    return (
      <div className="search-topbar">
        <div className="row">
          <div className="search-box columns small-12">
            <input type="text" id="search" placeholder="Vul je vraag in" value={this.props.question} onChange={this.props.enterQuestion}/>
            <input type="submit" className="button large" value="Zoek" onClick={this.props.search}/>
            <button className="button large secondary">Random vraag</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Search;
