import { createSelector } from "reselect";

const selectShop = (state) => state.shop;

/*collections is no more an array, we converted it to object to access individual collection based on the key provided by the user
so the issue now is we need an array of collections to map over => we need this inside collection preview component
so we convert our object into array for that component
*/
export const selectCollections = createSelector(
  [selectShop],
  (shop) => shop.collections
);

export const selectCollectionsForPreview = createSelector(
  [selectCollections],
  collections => collections ? Object.keys(collections).map(key => collections[key]) : []
)
/*we are getting collectionUrlParam that is which collection did the user clicked on 
we pass that as a key to our collections object and it pulls out the right collection.
*/
export const selectCollection = (collectionUrlParam) =>
  createSelector([selectCollections], (collections) => collections ? collections[collectionUrlParam] : null
  );
