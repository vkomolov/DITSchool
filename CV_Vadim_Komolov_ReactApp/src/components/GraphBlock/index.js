///node_modules
import React, {Component} from "react";
///styles
import styles from './GraphBlock.scss';

export default class GraphBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initiated: false
        };
    }

    componentDidMount() {
        setTimeout(()=> this.setState({initiated: true}), 500);
    }

    render() {
        let scoreWidth = {
            width: `${this.props.score}%`
        };

        let indicator = this.state.initiated
         ? <div className={styles.score} style={scoreWidth} />
         : <div className={styles.score} />;

        return (
            <div className={styles.graphBlock}>
                {indicator}
            </div>
        );
    }
}