import React, { Component } from "react";
import "./Item.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ItemDetails from "./itemDetails.jsx";
import { IoMdSearch, IoIosThumbsDown } from "react-icons/io";
import { IconContext } from "react-icons";
class UnconnectedItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchItem: "",
      items: this.props.items,
      displayFilters: false,
      filterCost: 0,
      filterMaxCost: 10000,
      filterInStock: false,
      itemName: "",
      email: "",
      itemFound: "",
      quantity: 0,
      item: {},
      loveIt: 0,
      page: 0
    };
  }
  componentDidMount = () => {
    let updateItems = async () => {
      // get all items from the server
      let response = await fetch("/items");
      let responseBody = await response.text();
      //   console.log("responseBody", responseBody);
      let parsed = JSON.parse(responseBody);
      console.log("parsed", parsed);
      this.props.dispatch({ type: "set-items", items: parsed });
    };
    setInterval(updateItems, 500);
  };
  // componentDidMount = () => {
  //   this.reload();
  // };
  // componentDidUpdate = (prevProps, prevState) => {
  //   if (prevState.items !== this.state.items) {
  //     this.reload();
  //   }
  // };
  // reload = async () => {
  //   let response = await fetch("/items");
  //   let responseBody = await response.text();
  //   let parsed = JSON.parse(responseBody);
  //   this.props.dispatch({ type: "set-items", items: parsed });
  // };
  gotoCart = () => {
    this.props.history.push("/cart");
  };
  displayFilters = () => {
    this.setState({
      ...this.state,
      displayFilters: !this.state.displayFilters
    });
    console.log("this.state.displayFilters", this.state.displayFilters);
  };
  handleOnChangeSearch = event => {
    event.preventDefault();
    console.log("searched item", event.target.value);
    this.setState({ ...this.state, itemFound: event.target.value });
  };
  submitFilters = event => {
    // fetch this '/filter-items'
  };
  maxCostOnChange = event => {
    event.preventDefault();
    this.setState({ filterMaxCost: event.target.value });
  };
  minCostOnChange = event => {
    event.preventDefault();
    if (event.target.value === "") {
      this.setState({ filterCost: 0 });
    }
    let cost = parseInt(event.target.value);
    if (isNaN(cost)) return 0;
    this.setState({ filterCost: cost });
  };
  inStockOnChange = event => {
    // event.preventDefault();
    console.log("event.target.checked", event.target.checked);
    this.setState({ ...this.state, filterInStock: event.target.checked });
  };
  goBackToPreviousPage = () => {
    this.setState({ ...this.state, page: this.state.page - 1 });
  };
  goToNextPage = () => {
    this.setState({ ...this.state, page: this.state.page + 1 });
  };
  goToPage = i => {
    this.setState({ ...this.state, page: i });
  };
  render = () => {
    console.log("rendering items");
    let displayedItems = this.props.items;
    console.log("this.props.items", this.props.items);
    console.log("this.state.itemFound", this.state.itemFound);
    if (this.state.itemFound !== "") {
      console.log("I am filtering");
      displayedItems = displayedItems.filter(item => {
        return item.name.includes(this.state.itemFound);
      });
    }
    let maxCost = parseInt(this.state.filterMaxCost);
    displayedItems = displayedItems.filter(item => {
      return item.cost > this.state.filterCost && item.cost < maxCost;
    });
    if (this.state.filterInStock) {
      displayedItems = displayedItems
        .slice(this.state.page * 6, this.state.page * 6 + 6)
        .filter(item => {
          return (
            item.cost > this.state.filterCost &&
            item.cost < maxCost &&
            item.available_quantity > 0
          );
        });
    } else {
      displayedItems = displayedItems
        .slice(this.state.page * 6, this.state.page * 6 + 6)
        .filter(item => {
          return item.cost > this.state.filterCost && item.cost < maxCost;
        });
    }

    // displayedItems = displayedItems
    //   .slice(this.state.page * 6, this.state.page * 6 + 6)
    //   .filter(item => {
    //     return item.cost > this.state.filterCost && item.cost < maxCost;
    //   });
    let indexPage = [];
    for (let index = 1; index <= this.props.items.length / 6; index += 6) {
      console.log(index);
      indexPage.push(index);
    }
    console.log("displayedItems", displayedItems);
    return (
      <div className="mainDiv">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <video
          loop
          src="images/ast_days_of_summer.mp4"
          width="1400"
          height="690"
          controls="controls"
          autoPlay={false}
        />
        <div className="Wrapper">
          {/* NavBar includes : SearchBar, Logout/Login(if not connected)
         , cart and User Display */}
          <header className="HeaderNavBar">
            {/* SearchBar */}
            <div className="SearchBar">
              <IconContext.Provider
                value={{ size: "2em", className: "global-class-name" }}
              >
                <IoMdSearch />
              </IconContext.Provider>
              <input
                className="InputSearchBar"
                type="text"
                onChange={this.handleOnChangeSearch}
                placeholder="   search item"
              />
            </div>
          </header>
          {/* Filter goes here  */}
          <div className="FilterArea">
            <div className="secondWrapper">
              {" "}
              {/* <div className="UserDisplay">hi {" " + this.props.email}</div> */}
              <button className="FilterButton" onClick={this.displayFilters}>
                {this.state.displayFilters ? "less filters" : "more filters"}
              </button>
              <div
                className="FiltersArea"
                style={{
                  display: this.state.displayFilters ? "block" : "none"
                }}
              >
                min cost:
                <input
                  className="MinCostForm"
                  type="text"
                  onChange={this.minCostOnChange}
                  value={this.state.filterCost}
                />
                max cost:
                <input
                  className="MaxCostForm"
                  type="text"
                  onChange={this.maxCostOnChange}
                  value={this.state.filterMaxCost}
                />
                In stock{" "}
                <input
                  className="InStockCheckBox"
                  type="checkbox"
                  onChange={this.inStockOnChange}
                  checked={this.state.filterInStock}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="ItemsField">
          {displayedItems.map(item => {
            return (
              <div className="ItemsFields">
                <button className="ItemDescriptionLink">
                  <Link to={"/item/" + item._id}>
                    {" "}
                    <img
                      className="picture"
                      src={item.filePath}
                      height="300px"
                      width="200px"
                    />
                  </Link>
                </button>
                <div className="ItemName">{item.name}</div>
                <div className="ItemDescription">{item.description}</div>
                <div
                  className="ItemQuantities"
                  style={{
                    display: item.available_quantity <= 0 ? "block" : "none"
                  }}
                >
                  SOLD OUT
                </div>
                <div className="ItemPrice">{item.cost + "$ "} </div>
                <div
                  style={{
                    display: item.loveIt > 0 ? "block" : "none"
                  }}
                >
                  <div className="ItemDescription">
                    {item.loveIt}
                    {item.loveIt > 1 ? " love it! " : " loves it!"}
                  </div>
                </div>
                <div />
              </div>
            );
          })}
          {/* pagination */}

          <div className="PaginationDiv">
            <button
              className="Pagination"
              className="PagePrevious"
              onClick={this.goBackToPreviousPage}
              style={{ display: this.state.page > 0 ? "block" : "none" }}
            >
              previous
            </button>
            {indexPage.map(i => {
              return (
                <button
                  className="PageNumber"
                  onClick={() => this.goToPage(i)}
                  /*style={{ display: this.state.page > 0 ? "block" : "none" }}*/
                >
                  {i}
                </button>
              );
            })}
            {/* other numbers coming */}
            <button
              className="PageNext"
              onClick={this.goToNextPage}
              style={{
                display:
                  this.state.page < Math.floor(this.props.items.length / 6)
                    ? "block"
                    : "none"
              }}
            >
              next
            </button>
          </div>
        </div>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    email: state.email,
    items: state.items,
    itemFound: state.itemFound,
    minPrice: state.min
  };
};
let Items = connect(mapStateToProps)(UnconnectedItems);
export default Items;
