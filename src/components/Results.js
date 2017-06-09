import React, { Component } from 'react'

export class Dataset extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { dataset } = this.props

        console.log('in dataset', dataset);

        if (!dataset) return null

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
                    { dataset.availability.type }
                </div>
            </div>
        )
    }
}

export class Visualization extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { viz } = this.props

        if (!viz) return null

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


export class ResultPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const result = this.props.result[0]

        let { 
            q,
            datasets,
            viz,
        } = result

        if (!viz) viz = []
        if (!datasets) datasets = []

        return (
            <div className="result row">
            	<div className="columns small-12">
	                <div className="result-vraag">
	                    <h2>Vraag</h2>
                    	<h5 className="subheader">{ q }</h5>
	                </div>
	                <h2>Antwoord</h2>
	                <div className="row">
	                	<div className="columns medium-6 first-col">
			                <div className="result-datasets">
			                    <h5>De volgende datasets geven antwoord</h5>
			                    { datasets.map((d) => <Dataset dataset={d} />) }
			                </div>
			            </div>
	                	<div className="columns medium-6">
			                <div className="result-visualizations">
			                    <h5>De volgende visualisatie bronnen zijn beschikbaar</h5>
			                    { viz.map((d) => <Visualization dataset={d} />) }
			                </div>
			            </div>
			        </div>
                </div>
            </div>
        )
    }
}
