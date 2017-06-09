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

class Dataset extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { dataset } = this.props

        return (
            <div className="result-dataset">
                <div className="dataset-name">
                    <h2>{ dataset.name }</h2>
                </div>

                <div className="dataset-method">
                    <h3>Methodologie</h3>
                    { dataset.method.description }
                </div>
                <div className="dataset-type">
                    <h3>Type</h3>
                    { dataset.availability }
                </div>
            </div>
        )
    }
}
Dataset.propTypes = {
    
}

class Visualization extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { viz } = this.props

        return (
            <div className="result-viz">
                <div className="viz-name">
                    <h2>{ viz.name }</h2>
                </div>

                <div className="viz-link">
                    <h3>Methodologie</h3>
                    { viz.link }
                </div>
            </div>
        )
    }
}


class ResultPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { 
            q,
            varType,
            datasets,
            viz,
        } = this.props

        return (
            <div className="result">
                <div className="result-vraag">
                    Vraag: { q }
                </div>
                <div className="result-datasets">
                    <span>Deze vraag kan beantwoord worden met behulp van de volgende datasets</span>
                    { datasets.map((d) => <Dataset dataset={d} />) }
                </div>
                <div className="result-visualizations">
                    <span>De volgende visualisatie bronnen zijn beschikbaar</span>
                    { viz.map((d) => <Visualization dataset={d} />) }
                </div>
            </div>
        )
    }
}
