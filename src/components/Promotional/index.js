import React, { Component } from 'react';
import styles from './index.css';


class Promotional extends Component {
  constructor(props) {
    super(props);

    this.state = {
      promos: [
        {"title": "Promo 1", "content": "Test Promotional"}
      ],
    };
  }

  render() {
    return (
      <div className={styles.componentContainer}>
        <div className={styles.searchInput}>
          <div className={styles.searchIcon}>search</div>
          <input></input>
        </div>
        <section className={styles.promoContainer}>
          {this.state.promos.map(promo => (
            <article>
              <div>{promo.title}</div>
              <div>{promo.content}</div>
            </article>
          ))}
        </section>
      </div>
    );
  }
}

export default Promotional;
