import React, { Component } from 'react'
import ReactCSSTransitionReplace from 'react-css-transition-replace';

import _ from 'lodash'

import { ResultPage } from './Results'

import Autosuggest from 'react-autosuggest';

import codelists from '../codelists.js'

// // Imagine you have a list of languages that you'd like to autosuggest.
// const questionList = [
//   {
//     q: 'Hoe lang is een Chinees?',
//   },
//   {
//     q: 'Wie had de meeste nevenfuncties in de Tweede Kamer?',
//   },
// ];

const YEAR = [ 2013, 2014, 2015, 2016, 2017 ]
const KAMERLID = codelists.personen
const FRACTIE = codelists.partijen
const LAND = codelists.landen
const SECTOR = codelists.sector
const MOTIE = codelists.moties
const VOORSTEL = codelists.wetsvoorstellen
const KAMER = [ 'eerste' ]

const questions = [
    {
        q: 'welke kamerleden hebben er afwijkend gestemd in het jaar x?',
        qf: (jaar) => `welke kamerleden hebben er afwijkend gestemd in het jaar ${jaar}`,
        dimensions: [ YEAR ],
        datasets: [
            {
                name: 'Tweedekamer gegevensmagazijn',
                beschikbaar: false,
                method: {
                    description: "Er is geen persoonlijk kiesgedrag beschikbaar in deze dataset"
                },
            }
        ],
        viz: [ // relevante visualisaties
            {
                name: "STEMGEDRAG TWEEDE KAMER 2013-2016 NADER BEKEKEN",
                link: "http://www.datagraver.com/case/stemgedrag-tweede-kamer-2013-2016-nader-bekeken"
            },
        ],
        toelichting: ""
    },
    {
        q: 'Welk kamerlid heeft motie x voorgesteld?',
        qf: (motie) => `Welk kamerlid heeft motie "${motie}" voorgesteld?`,
        dimensions: [ MOTIE ],
        datasets: [
            {
                name: 'Tweedekamer gegevensmagazijn',
                beschikbaar: true,
                method: {
                    description: "Deze data is verkrijgbaar via het \"ParlementairDocument\" endpoint: https://gegevensmagazijn.tweedekamer.nl/OData/v1/ParlementairDocument?$filter=Soort%20eq%20%27Motie%27"
                },
                availability: {
                    type: 'direct', // niet direct filterbaar (maar data is te verkrijgen)
                }
            }
        ],
        viz: [ // relevante visualisaties
            {
                name: "tweedekamer.nl",
                link: "https://www.tweedekamer.nl/kamerstukken/moties"
            },
        ],
        toelichting: "",
    },
    {
        q: 'Wat is het percentage afwezigheid voor fractie x?',
        qf: (fractie) => `Wat is het percentage afwezigheid voor fractie ${fractie}`,
        dimensions: [ FRACTIE ],
        datasets: [
            {
                name: 'Tweedekamer gegevensmagazijn',
                beschikbaar: false,
                method: {
                    description: "Geen afwezigheids data voor verschillende activiteiten aanwezig."
                },
            }
        ],
        viz: [ // relevante visualisaties
            {
                name: "nrc.nl nieuwsartikel",
                link: "https://www.nrc.nl/nieuws/2013/09/02/linkse-kamerleden-minder-aanwezig-dan-rechtse-a1431924"
            },
        ],
        toelichting: "",
    },
    {
        q: 'Hoe groot is fractiediscipline dit jaar voor fractie x?',
        qf: (fractie) => `Hoe groot is de fractiediscipline dit jaar voor ${fractie}?`,
        dimensions: [ FRACTIE ],
        datasets: [
            {
                name: 'Tweedekamer gegevensmagazijn',
                beschikbaar: false,
                method: {
                    description: "Stemmingen ophalen per fractielid is niet mogelijk."
                },
            }
        ],
        viz: [ // relevante visualisaties
            {
                name: "datagraver.com stemgedrag",
                link: "http://www.datagraver.com/case/stemgedrag-tweede-kamer-2013-2016-nader-bekeken"
            },
        ],
    },
    {
        q: 'Welke wetsvoorstellen zijn niet door de eerste kamer gekomen?',
        qf: (kamer) => `Welke wetsvoorstellen zijn niet door de ${kamer} kamer gekomen?`,
        dimensions: [ KAMER ],
        datasets: [
            {
                name: 'Tweedekamer gegevensmagazijn',
                beschikbaar: false,
                method: {
                    description: "Geen open data eerste kamer beschikbaar."
                },
            }
        ],
        viz: [ // relevante visualisaties
            {
                name: "eerstekamer.nl",
                link: "https://www.eerstekamer.nl/begrip/verworpen_door_de_eerste_kamer"
            },
        ],
    },
    {
        q: 'Hoeveel geeft nederland uit aan ontwikkelingsgeld in x',
        qf: (land) => `Hoeveel geeft nederland uit aan ontwikkelingsgeld in ${land}`,
        dimensions: [ LAND ],
    },
    {
        q: 'Hoeveel geeft nederland uit aan ontwikkelingsgeld sector x',
        qf: (sector) => `Hoeveel geeft nederland uit aan ontwikkelingsgeld in de sector "${sector}"`,
        dimensions: [ SECTOR ],
    },
]


let questionList = questions.map(q => {

    const subqs = q.dimensions[0].map(d1 => {
        const newq =  q.qf(d1)

        return Object.assign({},
            q,
            { q: newq }
        )
    })

    return subqs
})

questionList = _.flatMap(questionList)

// console.log(questionList);

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

    const regex = new RegExp('.*' + escapedValue + '.*', 'i');

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
      searchObject: {}
    }
    this.onChange = this.onChange.bind(this)
    this.search = this.search.bind(this)
    this.randomize = this.randomize.bind(this)
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

  randomize() {
    var random = questionList[Math.floor(Math.random() * questionList.length)].q
    this.setState({
      value:random
    })
  }

  render() {
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: "Vul je vraag in",
      value: value,
      onChange: this.onChange
    }
    return (
      <ReactCSSTransitionReplace
        transitionName="search"
        transitionEnterTimeout={2000}
        transitionLeaveTimeout={2000}>
        {this.state.search ?
          <div className="search-wrap top" key={1}>
            <SearchTopBar
              search={this.search}
              value={value}
              onChange={this.onChange} 
              search={this.search}
              suggestions={suggestions.slice(0, 6)}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              inputProps={inputProps}
              randomize={this.randomize}/>
              <div className="results-wrap">
                <ResultPage result={getSuggestions(value)} />
              </div>
          </div>
          :
          <SearchMain 
            key={2}
            value={value}
            onChange={this.onChange} 
            search={this.search}
            suggestions={suggestions.slice(0, 6)}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            inputProps={inputProps}
            randomize={this.randomize} />
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
            <button className="button large secondary" onClick={this.props.randomize}>Random vraag</button>
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
            <button className="button large secondary" onClick={this.props.randomize}>Random vraag</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Search;
