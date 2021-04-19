import React from "react";
import HomePage from "./pages/homepage/homepage.component";
import ShopPage from "./pages/shoppage/shop.component";
import Header from "./components/header/header.component";
import SignInAndSignUpPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import CheckoutPage from './pages/checkout/checkout.component';
import "./App.css";
import { Route, Switch, Redirect } from "react-router-dom";
import { createUserProfileDocument } from "./firebase/firebase.utils";
import { auth } from "./firebase/firebase.utils";
import { connect } from "react-redux";
import {createStructuredSelector} from 'reselect';
import {selectCurrentUser} from './redux/user/user.selectors';
import { setCurrentUser } from "./redux/user/user.actions";

/**
 * ! Directory is the component holding everything
 * ! menu-item is each option like hats jackets etc
 * ! content is button inside each menu-item
 */

/**
 * *we normally render the component in this sytnax before <HomePage/>
 * *but inside Route we are passing the component in this syntax component={HomePage}
 */

/*we changed from functional component to class component 
  to keep the current user from firebase authentication in our current state
   */
class App extends React.Component {
  // setting a class variable to unsubscribe from authstatechanged function
  unsubscribeFromAuth = null;

  /*we want to track user once our application is mounted 
    onAuthStateChanged returns a function to unsubscribe */
  componentDidMount() {
    const { setCurrentUser } = this.props;

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapshot) => {
          /*we get the setCurrentUser function as a prop from redux which is an action which fires and takes an user as a param and sets as payload for that action which in turn sets the reducer state accordingly which updates the redux store, finally making the necessary view(UI) changes 
          
          Basically setCurrentUser replaces this.setstate but behind the scene it works the same.
          */

          setCurrentUser({
            id: snapshot.id,
            ...snapshot.data(),
          });
        });
      }

      //if userAuth comes null then we are setting our state object currentuser to null.
      else {
        setCurrentUser(userAuth);
      }
    });

    
  }

  /*we want to unsubscribe before we unmount the application */
  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  //using render inside route component, basically to check if the user is signed in then we want to redirect the user to homepage and if the user is not signed in then we want the user to be on the sigin page. And to conditionally check this, we are using render instead of just using component
  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route exact path='/checkout' component={CheckoutPage}/>
          <Route
            exact
            path="/signin"
            render={() =>
              this.props.currentUser ? (
                <Redirect to="/" />
              ) : (
                <SignInAndSignUpPage />
              )
            }
          />
        </Switch>
      </div>
    );
  }
}

/*createStructuredSelector -> points the property directly to the selector provided and passes the top level state to it
 */
const mapStateToProps =  createStructuredSelector({
  currentUser: selectCurrentUser
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
