// @flow weak

import React, {
  PureComponent
}                     from 'react';
import PropTypes      from 'prop-types';
import classnames     from 'classnames/bind';
import { Link }       from 'react-router-dom';
import AnimatedView   from '../../components/animatedView/AnimatedView';
import { Row, Col }   from 'react-bootstrap';
import styles         from './home.scss';

// IMPORTANT: we need to bind classnames to CSSModule generated classes:
const cx = classnames.bind(styles);

class Home extends PureComponent {
  static propTypes= {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired
  };

  render() {
    return(
      <AnimatedView>
        <div className="m-t-10-percent">
          <h2 className="text-center white-text">Channel Selection</h2>
          <Row>
            <Col md={4} mdOffset={4} xs={12}>
              <div className={`${styles.ch} ${styles.chActive}`}>
                <div className={styles.chIcon}>
                  <i className="fa fa-users fa-2x"></i>
                </div>
                <div className={styles.chContent}>
                  <h4 className={styles.chTitle}>Exceptional Service</h4>
                  <h5 className={styles.chSub}>Personalized to your needs</h5>
                </div>
              </div>
              <div className={styles.ch}>
                <div className={styles.chIcon}>
                  <i className="fa fa-users fa-2x"></i>
                </div>
                <div className={styles.chContent}>
                  <h4 className={styles.chTitle}>Exceptional Service</h4>
                  <h5 className={styles.chSub}>Personalized to your needs</h5>
                </div>
              </div>
              <div className="m-t-4">
                <button className="btn btn-info btn-sm btn-block">JOIN</button>
              </div>
            </Col>
          </Row>
        </div>
      </AnimatedView>
    );
  }
}

export default Home;
