import React, { Component } from 'react';
import { ReactiveBase, SingleDropdownList } from '@appbaseio/reactivesearch';
import Appbase from 'appbase-js';
import filter from 'lodash/filter';
import round from 'lodash/round';
// import trim from 'lodash/trim';
import currencyFormatter from 'currency-formatter';
import toNumber from 'lodash/toNumber';
import {
  AppbaseApp,
  AppbaseAppCredential,
  HOST_URL,
  AppbaseAppType
} from './constants';
import Header from './components/Header.js';

// Create app instance
const appbaseRef = Appbase({
  url: HOST_URL,
  app: AppbaseApp,
  credentials: AppbaseAppCredential
});
const item_order = [
  'FL',
  'IF',
  'VVS1',
  'VVS2',
  'VS1',
  'VS2',
  'SI1',
  'SI2',
  'SI3',
  'I1',
  'I2',
  'I3'
];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '',
      shape: '',
      clarity: '',
      hits: [],
      originalHits: [],
      userEnteredRelToList: 0,
      userEnteredSellPc: 0,
      userEnteredTotalPc: 0,
      isLoading: false,
      activeInputField: '',
      initialRendering: true,
      userEnteredWeight: 0,
      checkBoxStatus: false
    };

    this.handleColorDropdownChange = this.handleColorDropdownChange.bind(this);
    this.handleClarityDropdownChange = this.handleClarityDropdownChange.bind(
      this
    );
    this.handleShapeDropdownChange = this.handleShapeDropdownChange.bind(this);
    this.changeRelToList = this.changeRelToList.bind(this);

    // this.getPrice = this.getPrice.bind(this);
    // this.getSellPrice = this.getSellPrice.bind(this);
    // this.getRelToList = this.getRelToList.bind(this);

    this.totalPriceChange = this.totalPriceChange.bind(this);
    this.sellPcChange = this.sellPcChange.bind(this);
    this.handleWeightInputChange = this.handleWeightInputChange.bind(this);
    this.handleCheckBoxStatusChange = this.handleCheckBoxStatusChange.bind(
      this
    );
  }

  componentDidUpdate(prevProps, prevState) {
    let { userEnteredWeight: prevUserEnteredWeight } = prevState;
    let { userEnteredWeight, originalHits, color, clarity, shape } = this.state;
    if (color && shape && clarity && userEnteredWeight) {
      if (prevUserEnteredWeight !== userEnteredWeight) {
        // Always filter original list
        let newHits = filter(originalHits, o => {
          return (
            Number.parseFloat(o._source.fromweight) <= userEnteredWeight &&
            userEnteredWeight <= Number.parseFloat(o._source.toweight)
          );
        });
        this.setState({
          checkBoxStatus: false,
          hits: newHits
        });
        console.log('hits', this.state.hits);
      }
    }
  }

  handleColorDropdownChange(value) {
    this.setState(
      {
        color: value
      },
      () => {
        this.getPrice();
      }
    );
  }

  handleClarityDropdownChange(value) {
    this.setState(
      {
        clarity: value
      },
      () => {
        this.getPrice();
      }
    );
  }

  handleShapeDropdownChange(value) {
    this.setState(
      {
        shape: value
      },
      () => {
        this.getPrice();
      }
    );
  }

  handleWeightInputChange(e) {
    this.setState({
      userEnteredWeight: e.target.value,
      activeInputField: 'WEIGHT'
    });
  }
    mapOrder(array, order, key) {
    array.sort(function(a, b) {
      var A = a[key],
        B = b[key];
      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      } else {
        return -1;
      }
    });
    return array;
  }
  getPrice() {
    let { color, shape, clarity } = this.state;

    if (color === '' || shape === '' || clarity === '') {
      return;
    }

    this.setState({
      isLoading: true
    });

    appbaseRef
      .search({
        type: AppbaseAppType,
        body: {
          query: {
            bool: {
              must: [
                {
                  bool: {
                    must: [
                      {
                        term: {
                          'shape.keyword': shape
                        }
                      },
                      {
                        term: {
                          'color.keyword': color
                        }
                      },
                      {
                        term: {
                          'clarity.keyword': clarity
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          // size: 1,
          _source: {
            includes: ['*'],
            excludes: []
          },
          from: 0
        }
      })
      .then(response => {
        this.setState({
          hits: response.hits.hits,
          originalHits: response.hits.hits,
          isLoading: false,
          initialRendering: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          initialRendering: false
        });
        console.log('Error: ', error);
      });
  }

  handleCheckBoxStatusChange(e) {
    this.setState({
      checkBoxStatus: e.target.checked
    });
  }
  changeRelToList(e) {
    this.setState({
      activeInputField: 'REL_TO_LIST',
      userEnteredRelToList: e.target.value
    });
  }

  totalPriceChange(e) {
    let total_pc = currencyFormatter.unformat(e.target.value, { code: 'USD' });
    this.setState({
      activeInputField: 'TOTAL_PRICE',
      userEnteredTotalPc: total_pc
    });
  }

  sellPcChange(e) {
    let sell_pc = currencyFormatter.unformat(e.target.value, { code: 'USD' });

    this.setState({
      activeInputField: 'SELL_PRICE',
      userEnteredSellPc: sell_pc
    });
  }

  getListPrice() {
    let { hits, userEnteredWeight } = this.state;
    if (!hits.length) {
      return 0;
    }
    if (!userEnteredWeight) {
      return 0;
    }
    let per_carat = round(hits[0]._source.ppc, 2);
    return per_carat;
  }

  getSPWhenRelToListActive() {
    let { userEnteredRelToList, hits } = this.state;
    let sellPrice = 0;
    if (!hits.length) {
      return sellPrice;
    }
    if (userEnteredRelToList === '') {
      return 0;
    }
    let listPrice = hits[0]._source.ppc;

    sellPrice =
      toNumber(listPrice) + toNumber(listPrice * (userEnteredRelToList / 100));
    return round(sellPrice, 2);
  }

  getTPWhenRelToListActive() {
    let { hits, userEnteredWeight, userEnteredRelToList } = this.state;
    let totalPrice = 0;
    if (!hits.length) {
      return totalPrice;
    }
    if (userEnteredRelToList === '') {
      return 0;
    }
    let listPrice = hits[0]._source.ppc;
    let sellPrice =
      toNumber(listPrice) + toNumber(listPrice * (userEnteredRelToList / 100));
    if (userEnteredWeight > 0) {
      totalPrice = sellPrice * userEnteredWeight;
    }
    return round(totalPrice, 2);
  }

  getRelToListWhenSPActive() {
    let { userEnteredSellPc = 0, hits } = this.state;
    let relToList = '';
    if (!hits.length) {
      return relToList;
    }
    if (userEnteredSellPc === '') {
      return 0;
    }
    let listPrice = hits[0]._source.ppc;
    relToList = ((userEnteredSellPc - listPrice) / listPrice) * 100;
    return round(relToList, 2);
  }

  getTPWhenSPActive() {
    let { userEnteredSellPc = 0, userEnteredWeight, hits } = this.state;
    let totalPrice = '';
    if (!hits.length) {
      return totalPrice;
    }
    if (userEnteredSellPc === '') {
      return 0;
    }
    //calculate total price
    totalPrice = userEnteredSellPc * userEnteredWeight;
    return round(totalPrice, 2);
  }

  getRelToListWhenTPActive() {
    let { hits, userEnteredTotalPc, userEnteredWeight } = this.state;
    let relToList = 0;
    if (!hits.length) {
      return relToList;
    }
    if (userEnteredTotalPc === '') {
      return 0;
    }
    let listPrice = hits[0]._source.ppc;
    let sellPrice = userEnteredTotalPc / userEnteredWeight;
    relToList = ((sellPrice - listPrice) / listPrice) * 100;
    return round(relToList, 2);
  }

  getSPWhenTPActive() {
    let { userEnteredTotalPc, userEnteredWeight, hits } = this.state;
    let sellPrice = '';
    if (!hits.length) {
      return sellPrice;
    }
    sellPrice = userEnteredTotalPc / userEnteredWeight;
    return round(sellPrice, 2);
  }

  convertPriceToCode(wsprice) {
    if (isNaN(wsprice) || wsprice === null || wsprice === '' || wsprice === 0)
      return '';

    wsprice = Number(wsprice);

    var price = wsprice.toFixed(2).toString();

    var cprice = '';
    var priceO = '';

    for (var i = 0; i < price.length; i++) {
      var p = price.charAt(i);
      if (p === '.') {
        break;
      }

      var lastChar;

      if (p === '1') {
        if (priceO !== '') {
          lastChar = priceO.slice(-1);
          if (lastChar === p) {
            cprice += 'X';
            priceO += p;
          } else {
            cprice += 'B';
            priceO += p;
          }
        } else {
          cprice += 'B';
          priceO += p;
        }
      } else if (p === '2') {
        if (priceO !== '') {
          lastChar = priceO.slice(-1);

          if (lastChar === p) {
            cprice += 'X';
            priceO += p;
          } else {
            cprice += 'I';
            priceO += p;
          }
        } else {
          cprice += 'I';
          priceO += p;
        }
      } else if (p === '3') {
        if (priceO !== '') {
          lastChar = priceO.slice(-1);

          if (lastChar === p) {
            cprice += 'X';
            priceO += p;
          } else {
            cprice += 'G';
            priceO += p;
          }
        } else {
          cprice += 'G';
          priceO += p;
        }
      } else if (p === '4') {
        if (priceO !== '') {
          lastChar = priceO.slice(-1);

          if (lastChar === p) {
            cprice += 'X';
            priceO += p;
          } else {
            cprice += 'E';
            priceO += p;
          }
        } else {
          cprice += 'E';
          priceO += p;
        }
      } else if (p === '5') {
        if (priceO !== '') {
          lastChar = priceO.slice(-1);

          if (lastChar === p) {
            cprice += 'X';
            priceO += p;
          } else {
            cprice += 'S';
            priceO += p;
          }
        } else {
          cprice += 'S';
          priceO += p;
        }
      } else if (p === '6') {
        if (priceO !== '') {
          lastChar = priceO.slice(-1);

          if (lastChar === p) {
            cprice += 'X';
            priceO += p;
          } else {
            cprice += 'T';
            priceO += p;
          }
        } else {
          cprice += 'T';
          priceO += p;
        }
      } else if (p === '7') {
        if (priceO !== '') {
          lastChar = priceO.slice(-1);

          if (lastChar === p) {
            cprice += 'X';
            priceO += p;
          } else {
            cprice += 'H';
            priceO += p;
          }
        } else {
          cprice += 'H';
          priceO += p;
        }
      } else if (p === '8') {
        if (priceO !== '') {
          lastChar = priceO.slice(-1);

          if (lastChar === p) {
            cprice += 'X';
            priceO += p;
          } else {
            cprice += 'A';
            priceO += p;
          }
        } else {
          cprice += 'A';
          priceO += p;
        }
      } else if (p === '9') {
        if (priceO !== '') {
          lastChar = priceO.slice(-1);

          if (lastChar === p) {
            cprice += 'X';
            priceO += p;
          } else {
            cprice += 'L';
            priceO += p;
          }
        } else {
          cprice += 'L';
          priceO += p;
        }
      } else if (p === '0') {
        if (priceO !== '') {
          lastChar = priceO.slice(-1);

          if (lastChar === p) {
            cprice += 'X';
            priceO += p;
          } else {
            cprice += 'F';
            priceO += p;
          }
        } else {
          cprice += 'F';
          priceO += p;
        }
      }
    }
    return cprice;
  }

  render() {
    let {
      isLoading,
      activeInputField,
      userEnteredRelToList,
      userEnteredTotalPc,
      userEnteredSellPc,
      userEnteredWeight,
      hits,
      initialRendering,
      checkBoxStatus,
      shape,
      color,
      clarity
    } = this.state;

    const listPrice = this.getListPrice();
    let list_price = currencyFormatter.format(listPrice, { code: 'USD' });

    let relToList = 0;
    let sellPrice = listPrice; // initially SP is same as LP
    let sell_price = currencyFormatter.format(sellPrice, { code: 'USD' });
    let totalPrice = listPrice * userEnteredWeight;
    let total_price = currencyFormatter.format(totalPrice, { code: 'USD' });
    let weight = userEnteredWeight;
    switch (activeInputField) {
      case 'REL_TO_LIST':
        relToList = userEnteredRelToList;
        sellPrice = this.getSPWhenRelToListActive();
        sell_price = currencyFormatter.format(sellPrice, { code: 'USD' });
        totalPrice = this.getTPWhenRelToListActive();
        total_price = currencyFormatter.format(totalPrice, { code: 'USD' });
        break;

      case 'SELL_PRICE':
        relToList = this.getRelToListWhenSPActive();
        sellPrice = userEnteredSellPc;
        sell_price = currencyFormatter.format(sellPrice, { code: 'USD' });
        totalPrice = this.getTPWhenSPActive();
        total_price = currencyFormatter.format(totalPrice, { code: 'USD' });

        break;

      case 'TOTAL_PRICE':
        relToList = this.getRelToListWhenTPActive();
        sellPrice = this.getSPWhenTPActive();
        sell_price = currencyFormatter.format(sellPrice, { code: 'USD' });
        totalPrice = userEnteredTotalPc;
        total_price = currencyFormatter.format(totalPrice, { code: 'USD' });
        break;

      default:
        break;
    }

    let resultHtml = '';
    if (!initialRendering && !hits.length && userEnteredWeight !== '') {
      resultHtml = <div className="No-records">No record(s) available.</div>;
    } else {
      resultHtml = (
        <fieldset className="form-fieldset">
          <legend className="form-legend">Result:</legend>
          {isLoading && (
            <div className="App-Loader">Hang on, fetching results...</div>
          )}

          <div className="outputSectionRow">
            <div className="outputColumns xs-device-set-margin">
              <div className="show-code-field">
                <label
                  htmlFor="ValueToCodeConvert"
                  className="conversion-label"
                >
                  <input
                    type="checkbox"
                    className="show-code-input"
                    id="ValueToCodeConvert"
                    onChange={this.handleCheckBoxStatusChange}
                  />
                  <span>Show Code</span>
                </label>
              </div>
            </div>
            <div className="outputColumns xs-device-set-margin">
              <h2 className="form-control-label">List Price</h2>
              {!checkBoxStatus ? (
                <input
                  className="form-control"
                  type="text"
                  value={list_price}
                  disabled
                />
              ) : (
                ''
              )}
              {checkBoxStatus && listPrice ? (
                <div className="showCode">
                  {this.convertPriceToCode(listPrice)}
                </div>
              ) : null}
            </div>
            <div className="outputColumns xs-device-set-margin">
              <h2 className="form-control-label">Sell Price</h2>
              {!checkBoxStatus ? (
                <input
                  className="form-control"
                  value={sell_price}
                  type="text"
                  onChange={this.sellPcChange}
                />
              ) : (
                ''
              )}
              {checkBoxStatus && sellPrice ? (
                <div className="showCode">
                  {this.convertPriceToCode(sellPrice)}
                </div>
              ) : null}
            </div>
            <div className="outputColumns xs-device-set-margin">
              <h2 className="form-control-label">Total Price</h2>
              {!checkBoxStatus ? (
                <input
                  className="form-control"
                  value={total_price}
                  type="text"
                  onChange={this.totalPriceChange}
                />
              ) : (
                ''
              )}
              {checkBoxStatus && totalPrice ? (
                <div className="showCode">
                  {this.convertPriceToCode(totalPrice)}
                </div>
              ) : null}
            </div>
          </div>
        </fieldset>
      );
    }

    return (
      <div className="container">
        <Header />
        <ReactiveBase
          app={AppbaseApp}
          credentials={AppbaseAppCredential}
          type={AppbaseAppType}
        >
          <div id="input-area">
            <fieldset className="form-fieldset">
              <legend className="form-legend">FillUp Details:</legend>

              <div className="inputSectionRow">
                <div className="inputColumns xs-device-set-margin">
                  <SingleDropdownList
                    componentId="shape"
                    className="reactive-form-control"
                    dataField="shape.keyword"
                    title="Shape"
                    showCount={false}
                    onValueChange={this.handleShapeDropdownChange}
                  />
                </div>
                <div className="inputColumns xs-device-set-margin">
                  <SingleDropdownList
                    componentId="color"
                    className="reactive-form-control"
                    dataField="color.keyword"
                    title="Color"
                    showCount={false}
                    onValueChange={this.handleColorDropdownChange}
                  />
                </div>
                <div className="inputColumns xs-device-set-margin">
                  <SingleDropdownList
                    componentId="clarity"
                    className="reactive-form-control"
                    dataField="clarity.keyword"
                    title="Clarity"
                    showCount={false}
                    transformData={list => {
                      var ordered_array;
                      ordered_array = this.mapOrder(list, item_order, 'key');
                      return ordered_array;
                    }}
                    onValueChange={this.handleClarityDropdownChange}
                  />
                </div>
                <div className="inputColumns">
                  <h2 className="form-control-label">Weight</h2>
                  <input
                    type="number"
                    className="form-control"
                    onChange={this.handleWeightInputChange}
                    value={weight}
                  />
                </div>
                <div className="inputColumns xs-device-set-margin">
                  <h2 className="form-control-label">Mark(%)</h2>
                  {userEnteredWeight && color && shape && clarity ? (
                    <input
                      type="number"
                      className="form-control"
                      onChange={this.changeRelToList}
                      value={relToList}
                    />
                  ) : (
                    <input
                      type="number"
                      className="form-control"
                      onChange={this.changeRelToList}
                      value={relToList}
                      disabled
                    />
                  )}
                </div>
              </div>
            </fieldset>
          </div>

          <div id="result-area">{resultHtml}</div>
        </ReactiveBase>
      </div>
    );
  }
}

export default App;
