import React,{Component} from 'react';


export default class Stats extends Component {
    state = {
        startDate: null,
        endDate: null,
        obj: null,
        err: null,
        result: []
    }
    componentDidMount() {
        
        fetch(`/recording/${this.props.id}/tracker`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    obj: res,
                    startDate: res.dateStart,
                    endDate: res.dateEnd
                });
            })
            .catch(err => this.setState({ err }));
        let startTime = new Date(this.state.startDate).getTime();
        let endTime = new Date(this.state.endDate).getTime();
        let timeDiff = endTime - startTime;
        let unitTime = Math.round(timeDiff / 12);
        let timeIntervals = [];
        for (let i = 1; i <= 12; i++){
            timeIntervals.push(startTime + (i * unitTime));
        }
        let { obj } = this.state;
        let result = new Array(12).fill([]);
        const { counterHistory } = obj;
        for (let i = 0; i < counterHistory.length; i++){
            let { timestamp } = counterHistory[i];
            let milliTimestamp = new Date(timestamp).getTime();
            for (let j = 1; j < timeIntervals.length; j++){
                
                if (milliTimestamp < timeIntervals[j] && milliTimestamp > timeIntervals[j - 1]) {
                    result[j - 1].push(counterHistory[i]);
                }

                if (j === (timeIntervals.length - 1)) {
                    if (milliTimestamp < endTime && milliTimestamp > timeIntervals[j]) {
                        result[j].push(counterHistory[i]);
                    }
                }
            }
        }
        this.setState({ result });
    }
    render() {
        const { result } = this.state;
        return <div>
            <p>{JSON.stringify(result)}</p>
        </div>;
    }
} 