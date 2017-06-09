import React, { Component } from 'react'

class Results extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="results-wrap row">
        <Score />
      </div>
    );
  }
}

export default Results;


class Score extends Component {
  render() {
    return (
      <div className="detail-wrap columns small-12">
        <h2>Availability score</h2>
        <p>Bla</p>
      </div>
    )
  }
}