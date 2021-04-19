import React from "react";
import "./shop.styles.scss";
import CollectionOverview from "../../components/collection-overview/collection-overview.component";
import CollectionPage from '../collection/collection.component';
import withSpinner from '../../components/with-Spinner/withSpinner.component';
import { Route } from "react-router-dom";
import {connect} from 'react-redux';
import {updateCollections} from '../../redux/shop/shop.actions';
import {firestore, createCollectionsSnapshotToMap} from '../../firebase/firebase.utils';

const CollectionOverviewwithSpinner = withSpinner(CollectionOverview);
const CollectionPagewithSpinner = withSpinner(CollectionPage);

class ShopPage extends React.Component{

state={
  loading: true
}

  unsubscribeFromSnapshot =null;

  componentDidMount() {
    
    const {updateCollections} = this.props;
    const collectionRef = firestore.collection('collections');

    this.unsubscribeFromSnapshot = collectionRef.onSnapshot(async snapshot =>{

      const collectionMap = createCollectionsSnapshotToMap(snapshot);
      updateCollections(collectionMap);
      this.setState({loading:false});
      console.log(collectionMap);
    })
  }
  

  render(){

    const {loading} = this.state;
    const {match} = this.props;
    return (
      <div className="shop-page">
      <Route exact path={`${match.path}`} render={(props) => <CollectionOverviewwithSpinner isLoading={loading} {...props}/>}/>
       <Route path={`${match.path}/:collectionId`} render={(props)=> <CollectionPagewithSpinner isLoading={loading} {...props}/>}/>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>({

  updateCollections: collectionMap => dispatch(updateCollections(collectionMap))

})


export default connect(null,mapDispatchToProps)(ShopPage);
