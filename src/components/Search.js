import React, { Component } from 'react'
import cn from 'classnames'
import Results from './Results'

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      question: '',
      search: false
    }
    this.enterQuestion = this.enterQuestion.bind(this)
    this.search = this.search.bind(this)
  }
  enterQuestion(e) {
    this.setState({
      question: e.target.value
    })
  }
  search() {
    this.setState({
      search: true
    })
  }
  render() {
    let searchClass = cn('search-wrap', {top: this.state.search})
    return (
      <div className={searchClass}>
        <div className="row">
          <div className="search-header columns small-12 text-center">
            <h1>Wat wil je weten?</h1>
            <h5 className="subheader">Stel een vraag over de Tweede Kamer</h5>
          </div>
        </div>
        <div className="row align-center">
          <div className="search-box columns small-12 medium-10 large-6 text-center">
            <input type="text" id="search" placeholder="Vul je vraag in" value={this.state.question} onChange={this.enterQuestion} />
            <input type="submit" className="button large" value="Zoek" onClick={this.search}/>
            <button className="button large secondary">Random vraag</button>
          </div>
        </div>
        {this.state.search && <Results />}
      </div>
    );
  }
}

export default Search;
