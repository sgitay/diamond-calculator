import React, { Component } from 'react';
import { ReactiveBase, SingleDropdownList } from '@appbaseio/reactivesearch';
import Appbase from 'appbase-js';
import filter from 'lodash/filter';
import round from 'lodash/round';
// import trim from 'lodash/trim';
// import currencyFormatter from 'currency-formatter';
import NumberFormat from 'react-number-format';
import isEmpty from 'lodash/isEmpty';
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
      userEnteredWeight: '',
      userVal: 0,
      checkBoxStatus: false,
      weightInclude: false
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
    this.handleWeightChange = this.handleWeightChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log('prevState', prevState);
    let {
      userEnteredWeight,
      originalHits,
      color,
      clarity,
      shape,
      weightInclude
    } = prevState;

    if (color && shape && clarity && userEnteredWeight) {

      let newHits = filter(originalHits, o => {
        return (
          Number.parseFloat(o._source.fromweight) <= userEnteredWeight &&
          userEnteredWeight <= Number.parseFloat(o._source.toweight)
        );
      });
      // If there is no any record found for given range,
      // then use records from range `5-6`
      if(userEnteredWeight >= 10){
        newHits.length=0;
      }
      if (!newHits.length) {

        if (weightInclude && userEnteredWeight >= 10) {
          console.log('userEnteredWeight', userEnteredWeight);
          newHits = filter(originalHits, o => {
            return (
              Number.parseFloat(o._source.fromweight) >= 10 &&
              Number.parseFloat(o._source.toweight) <= 10.99
            );
          });
          console.log('10s hit', newHits);
        }else if(userEnteredWeight >= 5){

            newHits = filter(originalHits, o => {
            return (
              Number.parseFloat(o._source.fromweight) >= 5 &&
              Number.parseFloat(o._source.toweight) <= 5.99
              );
            });

        }
      }

      // Return new state
      return {
        hits: newHits
      };
    }

    // Return null to indicate no change to state.
    return null;
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
  handleWeightChange(e) {
      this.setState({
      activeInputField: 'WEIGHT',
      weightInclude: e.target.checked
    });


  }

  changeRelToList(e) {
    let val = e.target.value;
    console.log('e.target.value;', e.target.value);
    if (isEmpty(val)) {
      console.log('isEmpty');
      val = 0;
    }
    this.setState({
      activeInputField: 'REL_TO_LIST',
      userEnteredRelToList: val,
      userVal: e.target.value
    });
  }

  totalPriceChange(values) {
    const { formattedValue, value } = values;
    this.setState({
      activeInputField: 'TOTAL_PRICE',
      userEnteredTotalPc: value
    });
  }

  sellPcChange(values) {
    const { formattedValue, value } = values;
    this.setState({
      activeInputField: 'SELL_PRICE',
      userEnteredSellPc: value
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
    // console.log('getSPWhenRelToListActive');
    let { userEnteredRelToList, hits } = this.state;
    let sellPrice = 0;
    if (!hits.length) {
      return sellPrice;
    }
    if (userEnteredRelToList === '') {
      return 0;
    }
    let listPrice = hits[0]._source.ppc;
    // console.log('listPrice', listPrice);
    sellPrice =
      toNumber(listPrice) + toNumber(listPrice * (userEnteredRelToList / 100));
    // console.log('SELL_PRICE', sellPrice);
    return round(sellPrice, 2);
  }

  getTPWhenRelToListActive() {
    // console.log('getTPWhenRelToListActive');
    let { hits, userEnteredWeight, userEnteredRelToList } = this.state;
    let totalPrice = 0;
    if (!hits.length) {
      return totalPrice;
    }
    if (userEnteredRelToList === '') {
      return 0;
    }
    let listPrice = hits[0]._source.ppc;
    // console.log('listPrice', listPrice);
    let sellPrice =
      toNumber(listPrice) + toNumber(listPrice * (userEnteredRelToList / 100));
    // console.log('sellPriceREl', sellPrice);
    if (userEnteredWeight > 0) {
      totalPrice = sellPrice * userEnteredWeight;
    }
    return round(totalPrice, 2);
  }

  getRelToListWhenSPActive() {
    console.log('getRelToListWhenSPActive');
    let { userEnteredSellPc = 0, hits } = this.state;
    console.log('userEnteredSellPc RelACtive',userEnteredSellPc)
    let relToList = '';
    if (!hits.length) {
      return relToList;
    }
    if (userEnteredSellPc === '') {
      return 0;
    }
    let listPrice = hits[0]._source.ppc;
    // console.log('listPrice', listPrice);
    relToList = ((userEnteredSellPc - listPrice) / listPrice) * 100;
    console.log('getRelToListWhenSPActive',relToList);
    return round(relToList, 2);
  }

  getTPWhenSPActive() {
    // console.log('getTPWhenSPActive');
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
    // console.log('getRelToListWhenTPActive');
    let {
      hits,
      userEnteredTotalPc,
      userEnteredWeight,
      userEnteredRelToList
    } = this.state;
    let relToList = '';
    if (!hits.length) {
      return relToList;
    }
    if (userEnteredTotalPc === '') {
      return 0;
    }
    if (userEnteredWeight === '') {
      return 0;
    }
    console.log('userEnteredWeight Tp',userEnteredWeight)
    let listPrice = hits[0]._source.ppc;
    // console.log('listPrice', listPrice);
    let sellPrice = userEnteredTotalPc / userEnteredWeight;
    // console.log('sellPriceaa', sellPrice);
    relToList = ((sellPrice - listPrice) / listPrice) * 100;
    console.log('relToList', relToList)
    return round(relToList, 2);
  }

  getSPWhenTPActive() {
    let { userEnteredTotalPc, userEnteredWeight, hits } = this.state;
    // console.log('getSPWhenTPActive', hits);
    let listPrice = hits[0] && hits[0]._source.ppc;
    let sellPrice = '';
    if (!hits.length) {
      return sellPrice;
    }
    sellPrice = userEnteredTotalPc / userEnteredWeight;
    // console.log('sellPricessA', sellPrice);
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
      weightInclude,
      shape,
      color,
      clarity,
      userVal
    } = this.state;
    // console.log('userEnteredRelToList', userEnteredRelToList);
    let listPrice = this.getListPrice();
    let relToList = '';
    let relToList1 = '';
    let sellPrice = listPrice; // initially SP is same as LP
    // console.log('render sellPrice', sellPrice);
    let totalPrice = listPrice * userEnteredWeight;
    let weight = userEnteredWeight;
    console.log('userVal',userVal)
    switch (activeInputField) {
      case 'REL_TO_LIST':
        // console.log('userVal',userVal)
        // console.log('REL_TO_LIST');
        relToList = userEnteredRelToList;
        relToList1 = isEmpty(relToList) ? userVal : userEnteredRelToList;
        sellPrice = this.getSPWhenRelToListActive();
        totalPrice = this.getTPWhenRelToListActive();
        break;

      case 'SELL_PRICE':
        console.log('SELL_PRICE');
        relToList = this.getRelToListWhenSPActive();
        relToList1 = isEmpty(relToList) ? this.getRelToListWhenSPActive():userVal ;
        sellPrice = userEnteredSellPc;
        totalPrice = this.getTPWhenSPActive();
        console.log('relToList in case', relToList,'userVal',userVal)

        break;

      case 'TOTAL_PRICE':
        console.log('TOTAL_PRICE',this.getRelToListWhenTPActive());

        relToList = this.getRelToListWhenTPActive();
        relToList1 = isEmpty(relToList) ?  this.getRelToListWhenTPActive():userVal ;
        sellPrice = this.getSPWhenTPActive();
        totalPrice = userEnteredTotalPc;
        break;

      default:
        break;
    }
    // console.log(userVal,'relToList1',relToList1)

    let resultHtml = '';
    if (!initialRendering && !hits.length && userEnteredWeight !== '') {
      resultHtml = <div className="No-records">No record(s) available.</div>;
    } else {
      resultHtml = (
        <fieldset className="form-fieldset">
          <legend className="form-legend">Result:</legend>
          {isLoading && <div className="App-Loader">Fetching results...</div>}

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
                <NumberFormat
                  disabled
                  value={listPrice}
                  className="form-control"
                  thousandSeparator={true}
                  prefix={'$'}
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
                <NumberFormat
                  value={sellPrice}
                  className="form-control"
                  thousandSeparator={true}
                  onValueChange={values => this.sellPcChange(values)}
                  prefix={'$'}
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
                <NumberFormat
                  value={totalPrice}
                  className="form-control"
                  thousandSeparator={true}
                  onValueChange={values => this.totalPriceChange(values)}
                  prefix={'$'}
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
                  <label className="include-weight checkbox-inline">
                    <input
                      type="checkbox"
                      value={weightInclude}
                      onChange={this.handleWeightChange}
                    />
                    Use 10ct price list
                  </label>
                </div>
                <div className="inputColumns xs-device-set-margin">
                  <h2 className="form-control-label">Rel to List</h2>
                  {userEnteredWeight && color && shape && clarity ? (
                    <input
                      type="number"
                      className="form-control"
                      onChange={this.changeRelToList}
                      value={relToList1}
                    />
                  ) : (
                    <input
                      type="number"
                      className="form-control"
                      onChange={this.changeRelToList}
                      value={relToList1}
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
