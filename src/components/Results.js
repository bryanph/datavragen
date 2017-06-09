import React, { Component } from 'react'
import cn from 'classnames'

export class Dataset extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { dataset } = this.props

        console.log('in dataset', dataset);

        if (!dataset) return null


        let dataClass = cn('icon', {green: dataset.beschikbaar})

        return (
            <div className="result result-dataset">
            	<div className={dataClass}>
            		<i className="material-icons">{dataset.beschikbaar ? 'check' : 'close'}</i>
            	</div>
            	<div className="set">
	                <div className="dataset-name">
	                    <h5>{ dataset.name }</h5>
	                </div>

	                <div className="dataset-method">
	                    <h6>Methodologie</h6>
	                    <p dangerouslySetInnerHTML={{__html:dataset.method.description}}/>
	                </div>
	                {dataset.beschikbaar &&
	                <div className="dataset-type">
	                    <h6>Type</h6>
	                    <p>{ dataset.availability.type }</p>
	                </div>
		            }
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
            <div className="result result-viz">
            	<div className="icon">
            		<i className="material-icons">show_chart</i>
            	</div>
            	<div className="set">
	                <div className="viz-name">
	                    <h5>{ viz.name }</h5>
	                </div>

	                <div className="viz-link">
	                    <h6>Methodologie</h6>
	                    <p>{ viz.link }</p>
	                </div>
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
    	if (typeof this.props.result[0] === 'undefined') {
    		return (
    			<div className="results row">
	            	<div className="columns small-12">
		                <div className="result-vraag">
		                    <h2>Daar weet ik geen antwoord op</h2>
	                    	<h4 className="subheader">Vraag me wat anders</h4>
		                </div>
		            </div>
		        </div>
    		)
		}

		else {
	        const result = this.props.result[0]

	        let { 
	            q,
	            datasets,
	            viz,
	        } = result

	        console.log(this.props.result)
	        console.log('viz is')


	        if (!viz) viz = []
	        if (!datasets) datasets = []

	        return (
	            <div className="results row">
	            	<div className="columns small-12">
		                <div className="result-vraag">
		                    <h2>Vraag</h2>
	                    	<h4 className="subheader">{ q }</h4>
		                </div>
		                <h2>Antwoord</h2>
		                <div className="row">
		                	<div className="columns medium-6 first-col">
				                <div className="result-datasets">
				                    <h4>De volgende datasets kunnen antwoord geven</h4>
				                    { datasets.map((d) => <Dataset dataset={d} />) }
				                </div>
				            </div>
		                	<div className="columns medium-6">
				                <div className="result-visualizations">
				                    <h4>De volgende visualisatie bronnen zijn beschikbaar</h4>
				                    { viz.map((d) => <Visualization viz={d} />) }
				                </div>
				            </div>
				        </div>
	                </div>
	            </div>
	        )
	    }
    }
}
