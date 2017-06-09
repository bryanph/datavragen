import React, { Component } from 'react'
import cn from 'classnames'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import ReactCSSTransitionReplace from 'react-css-transition-replace';

import _ from 'lodash'

import Results from './Results'

import Autosuggest from 'react-autosuggest';

import codelists from '../codelists.js'

// Imagine you have a list of languages that you'd like to autosuggest.
const questionList = [
  {
    q: 'Hoe lang is een Chinees?',
  },
  {
    q: 'Wie had de meeste nevenfuncties in de Tweede Kamer?',
  },
];

const YEAR = [ 2013, 2014, 2015, 2016, 2017 ]
const KAMERLID = codelists.personen
const FRACTIE = codelists.partijen
const LAND = codelists.landen
const SECTOR = codelists.sector
const MOTIE = codelists.moties
const VOORSTEL = codelists.wetsvoorstellen

const questions = [
    {
        q: 'welke kamerleden hebben er afwijkend gestemd in het jaar x?',
        qf: (jaar) => `welke kamerleden hebben er afwijkend gestemd in het jaar ${jaar}`,
        dimensions: [ YEAR ],
        datasets: [
            {
                name: 'Tweedekamer gegevensmagazijn',
                method: {
                    description: "Deze data kan opgehaald worden door alle XML te parsen uit de REST API met de volgende filters:"
                },
                availability: {
                    type: 'derived', // niet direct filterbaar (maar data is te verkrijgen)
                }
            }
        ],
        viz: [ // relevante visualisaties
            {
                name: "STEMGEDRAG TWEEDE KAMER 2013-2016 NADER BEKEKEN",
                link: "http://www.datagraver.com/case/stemgedrag-tweede-kamer-2013-2016-nader-bekeken"
            },
        ]
    },
    {
        q: 'Welk kamerlid heeft wetsvoorstel x voorgesteld?',
        dimensions: [ KAMERLID ],
        qf: (jaar) => `Welk kamerlid heeft wetsvoorstel ${jaar} voorgesteld?`
    },
    {
        q: 'Welk kamerlid heeft motie x voorgesteld?',
        qf: (motie) => `Welk kamerlid heeft motie ${motie} voorgesteld?`,
        dimensions: [ MOTIE ],
    },
    {
        q: 'Hoe groot is fractiediscipline dit jaar voor fractie x?',
        qf: (fractie) => `Hoe groot is fractiediscipline dit jaar voor fractie ${fractie}?`,
        dimensions: [ FRACTIE ],
    },
    {
        q: 'Hoeveel geeft nederland uit aan ontwikkelingsgeld in x',
        qf: (land) => `Hoeveel geeft nederland uit aan ontwikkelingsgeld in ${land}`,
        dimensions: [ LAND ],
    },
    {
        q: 'Hoeveel geeft nederland uit aan ontwikkelingsgeld in x in sector y',
        qf: (land) => `Hoeveel geeft nederland uit aan ontwikkelingsgeld in ${land} in sector`,
        dimensions: [ LAND, SECTOR ],
    },
]


let questionsList = questions.map(q => {

    const subqs = q.dimensions[0].map(d1 => {
        const newq =  q.qf(d1)

        return Object.assign({},
            q,
            q: newq
        )
    })
})

questionsList = _.flatMap(questionsList)

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return questionList.filter(question => regex.test(question.q));
}

function getSuggestionValue(suggestion) {
  return suggestion.q;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.q}</span>
  );
}




class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      search: false,
      suggestions: [],
    }
    this.onChange = this.onChange.bind(this)
    this.search = this.search.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
  }
  onChange(event, { newValue, method }) {
    this.setState({
      value: newValue
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
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: "Vul je vraag in",
      value,
      onChange: this.onChange
    }
    return (
      <ReactCSSTransitionReplace
        transitionName="search"
        transitionEnterTimeout={100000}
        transitionLeaveTimeout={100000}>
        {this.state.search ?
          <div className="search-wrap top" key={1}>
            <SearchTopBar
              search={this.search}
              value={value}
              onChange={this.onChange} 
              search={this.search}
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              inputProps={inputProps}/>
            <Results />
          </div>
          :
          <SearchMain 
            key={2}
            value={value}
            onChange={this.onChange} 
            search={this.search}
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            inputProps={inputProps}
          />
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
              suggestions={this.props.suggestions}
              onSuggestionsFetchRequested={this.props.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.props.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={this.props.inputProps}
            />
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
            <Autosuggest
              suggestions={this.props.suggestions}
              onSuggestionsFetchRequested={this.props.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.props.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={this.props.inputProps}
            />
            <input type="submit" className="button large" value="Zoek" onClick={this.props.search}/>
            <button className="button large secondary">Random vraag</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Search;
