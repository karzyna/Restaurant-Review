/**
 * Common database helper functions.
 */
class DBHelper {

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get DATABASE_URL() {
      const port = 1337 // Change this to your server port
      return `http://localhost:${port}/restaurants`;
    }
  
    /**
     * Fetch all restaurants.
     */
    // static fetchRestaurants(callback) {
    //   console.log(callback);
    //   let xhr = new XMLHttpRequest();
    //   xhr.open('GET', DBHelper.DATABASE_URL);
    //   xhr.onload = () => {
    //     if (xhr.status === 200) { // Got a success response from server!
    //       const json = JSON.parse(xhr.responseText);
    //       const restaurants = json;
    //       console.log(json);
    //       callback(null, restaurants);
    //     } else { // Oops!. Got an error from server.
    //       const error = (`Request failed. Returned status of ${xhr.status}`);
    //       callback(error, null);
    //     }
    //   };
    //   console.log(xhr);
    //   xhr.send(); 
    // }
  
  // 
    static fetchRestaurants(callback) {
      fetch(DBHelper.DATABASE_URL)
      .then(function(response)
        {
          
          if (!response.ok) {
            const restaurants = dbPromise.then(db => {
              return db.transaction('objs')
                .objectStore('objs').get('restaurant_list');
            }).then(allObjs =>  callback(null, allObjs.data)
           );
          }
        return response.json();
        }
      ).then(function(myJson) {
          dbPromise.then(db => {
            const tx = db.transaction('objs', 'readwrite');
            tx.objectStore('objs').put({
              id: 'restaurant_list',
              data: myJson
            });
            return tx.complete;
        });
         callback(null, myJson);
      }).catch(e => {
  
        console.log(e);
        //callback(e, null);
        callback(null, {...restaurants.data[0]});
      }) 
    }
  
    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {
      // fetch all restaurants with proper error handling.
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          const restaurant = restaurants.find(r => r.id == id);
          if (restaurant) { // Got the restaurant
            callback(null, restaurant);
          } else { // Restaurant does not exist in the database
            callback('Restaurant does not exist', null);
          }
        }
      });
    }
  
  
    
  
    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
      // Fetch all restaurants  with proper error handling
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given cuisine type
          const results = restaurants.filter(r => r.cuisine_type == cuisine);
          callback(null, results);
        }
      });
    }
  
    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given neighborhood
          const results = restaurants.filter(r => r.neighborhood == neighborhood);
          callback(null, results);
        }
      });
    }
  
    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          let results = restaurants
          if (cuisine != 'all') { // filter by cuisine
            results = results.filter(r => r.cuisine_type == cuisine);
          }
          if (neighborhood != 'all') { // filter by neighborhood
            results = results.filter(r => r.neighborhood == neighborhood);
          }
          callback(null, results);
        }
      });
    }
  
    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          // Get all neighborhoods from all restaurants
          const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
          // Remove duplicates from neighborhoods
          const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
          callback(null, uniqueNeighborhoods);
        }
      });
    }
  
    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          // Get all cuisines from all restaurants
          const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
          // Remove duplicates from cuisines
          const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
          callback(null, uniqueCuisines);
        }
      });
    }
  

    //kopiowane
    static updateFavouriteStatus(restaurantId, isFavourite) {
      console.log('changing status to:', isFavourite);

      fetch(`http://localhost:1337/restaurants/${restaurantId}/?is_favorite=${isFavourite}`, {
        method: 'PUT'
      })
      .then(() => {
        console.log('changed');
        this.dbPromise()
        .then(db => {
            const tx = db.transaction('objs', 'readwrite');
            const restaurantsStore = tx.objectStore('objs');
            restaurantsStore.get(restaurantId)
              .then(restaurant => {
            restaurant.is_favorite = isFavourite;
            restaurantsStore.put(restaurant);
          });
        })
      })
    }

      // kopiowane
      static fetchReviews(id, callback) {
        if (!('indexedDB' in window)) {
          console.log('IndexedDB is not supported on this browser');
          fetch('http://localhost:1337/reviews/?restaurant_id='+ id).then(response => {
            const reviews = response.json();
            return reviews;
          }).then(reviews => {
            callback(null, reviews);
          }).catch(error => {
            callback(error, null);
          });
        } else {
          idb.open('reviews', 1, function(upgradeDb){
            upgradeDb.createObjectStore('reviews',{keyPath:'id'});
          }).then(function(db){
            var tx = db.transaction('reviews', 'readonly');
            var dbStore = tx.objectStore('reviews');
            dbStore.getAll().then(idbData => {
              if(idbData && idbData.length > 0) {
                // JSON data are already present in IDB

                callback(null, idbData);
              } else {
                // fetch(`${DBHelper.DATABASE_URL}/reviews`).then(response => {
              fetch('http://localhost:1337/reviews/?restaurant_id='+ id).then(response => {

                  return response.json();
                }).then(reviews => {
                  console.log(reviews);
                  var tx = db.transaction('reviews', 'readwrite');
                  var dbStore = tx.objectStore('reviews');
                  reviews.forEach(review =>{
                    dbStore.put(review);
                  });
                  dbStore.getAll().then(reviews => {
                    // Get the restaurants from the IDB now
                    callback(null, reviews);
                  });
                }).catch(error => {
                  callback(error, null);
                });
              }
            });
          });
        }
      }
    
      static sendDeferredReviews() {
        console.log('sending deferred reviews');
        if (('indexedDB' in window)) {
          idb.open('deferredReviews', 1, function(upgradeDb){
            upgradeDb.createObjectStore('deferredReviews',{keyPath:'id'});
          }).then(function(db){
            var tx = db.transaction('deferredReviews', 'readwrite');
            var dbStore = tx.objectStore('deferredReviews');
            dbStore.getAll().then(idbData => {
              if (idbData && idbData.length > 0) {
                idbData.forEach(deferredReview => {
                  let name = deferredReview.name;
                  let rating = deferredReview.rating;
                  let comments = deferredReview.comments;
                  let restaurant_id = deferredReview.restaurant_id;
                  let data = new FormData();
                  data.append('name', name);
                  data.append('rating', rating);
                  data.append('comments', comments);
                  data.append('restaurant_id', restaurant_id);
                  fetch(`${DBHelper.DATABASE_URL}/reviews`, {method: 'POST', body: data}).then(response => {
                    return response.json();
                  }).then(review => {
                    if (('indexedDB' in window)) {
                      idb.open('reviews', 1, function(upgradeDb_1){
                        upgradeDb_1.createObjectStore('reviews',{keyPath:'id'});
                      }).then(function(db_1){
                        var tx_1 = db_1.transaction('reviews', 'readwrite');
                        var dbStore_1 = tx_1.objectStore('reviews');
                        dbStore_1.put(review);
                      });
                    }
                  }).catch(error => {
                    console.log(error);
                    return;
                  });
                });
              }
            });
            dbStore.clear();
          });
        }
      }
    
      static saveReview(event, callback) {
        event.preventDefault();
        let name = document.getElementById('name').value;
        let rating = document.getElementById('rating').value;
        let comments = document.getElementById('comments').value;
        let restaurant_id = document.getElementById('restaurant_id').value;
        let data = new FormData();
        data.append('name', name);
        data.append('rating', rating);
        data.append('comments', comments);
        data.append('restaurant_id', restaurant_id);
        let updatedAt = new Date();
        fetch(`${DBHelper.DATABASE_URL}/reviews`, {method: 'POST', body: data}).then(response => {
          return response.json();
        }).then(review => {
          if (('indexedDB' in window)) {
            idb.open('reviews', 1, function(upgradeDb){
              upgradeDb.createObjectStore('reviews',{keyPath:'id'});
            }).then(function(db){
              var tx = db.transaction('reviews', 'readwrite');
              var dbStore = tx.objectStore('reviews');
              dbStore.put(review);
              callback(null, review);
            });
          }
        }).catch(() => {
          const deferredReview = {
            id: lastId + 1,
            restaurant_id: restaurant_id,
            name: name,
            rating: rating,
            comments: comments,
            updatedAt: updatedAt,
            createdAt: updatedAt
          }
          lastId = deferredReview.id;
          console.log('offline DB store');
          if (('indexedDB' in window)) {
            idb.open('deferredReviews', 1, function(upgradeDb){
              upgradeDb.createObjectStore('deferredReviews',{keyPath:'id'});
            }).then(function(db){
              var tx = db.transaction('deferredReviews', 'readwrite');
              var dbStore = tx.objectStore('deferredReviews');
              dbStore.put(deferredReview);
              callback(null, deferredReview);
            });
          } else {
            callback('Your browser does not support this cool feature :(', null)
          }
        });
      }

      static fetchReviewsByRestaurantId(id, callback) {
        // fetch all reviews with proper error handling.
        DBHelper.fetchReviews(id, (error, reviews) => {
          if (error) {
            callback(error, null);
          } else {
            const revs = reviews;//.filter(r => r.restaurant_id === id);
            if (revs) { // Got the reviews
              callback(null, revs);
            } else { // Restaurant does not have reviews yet
              callback('Restaurant does not have reviews yet', null);
            }
          }
        });
      }

    //kopiowane
    static getStoreObjectById(table,idx,id){
      return this.dbPromise() 
      .then(function(db) {
        if (!db) return;

        const store = db.transaction(table).objectStore(table);
        const indexId = store.index(idx);
        return indexId.getAll(id);
      });
    }
  
    //kopiowane
    static addReview(review) {
      console.log("inside", review)
      let offline_obj = {
        name: 'addReview',
        data: review,
        object_type: 'review'
      };

      if (!navigator.onLine && (offline_obj.name === 'addReview') ) {
        DBHelper.sendDataWhenOnline(offline_obj);
        return;
      }
      let reviewSend = {
        'name': review.name,
        'rating': parseInt(review.rating),
        'opinion': review.opinion,
        'restaurant_id': parseInt(review.restaurant_id)
      };
      console.log('Sending review: ', reviewSend);
      var fetch_options = {
        method: 'POST',
        body: JSON.stringify(reviewSend),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      };
      console.log(fetch_options);
      fetch('http://localhost:1337/reviews', fetch_options).then((response) => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application.json') !== -1) {
          return responses.json();
        } else { return 'API call successfull'}
      })
      .then((data) => {console.log(`Fetch  successful!`)})
      .catch(error => console.log('error: ', error));
    }
    //kopiowane
    static sendDataWhenOnline(offline_obj)  {
      console.log('Offline OBJ', offline_obj);
      localStorage.setItem('data', JSON.stringify('offline_obj.data'));
      console.log(`Local Storage: ${offline_obj.object_type} stored`);
      window.addEventListener('online', (event) => {
        console.log('Browser: Online again!');
        let data = JSON.parse(localStorage.getItem('data'));
        console.log('updating and cleaning ui');
        [...document.querySelectorAll('.reviews_offline')]
        .forEach(el => {
          el.classList.remove('reviews_offline')
          el.querySelector('.offline_label').remove()
        });
        if (data !== null) {
          console.log(data);
          if (offline_obj.name === 'addReview') {
            DBHelper.addReview(offline_obj.data);
          }
          console.log('LocalState: data sent to api');
          localStorage.removeItem('data');
          console.log(`Local Storage: ${offline_obj.object_type} removed`);
        }
      });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
      return (`./restaurant.html?id=${restaurant.id}`);
    }
  
    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
      return (`/img/${restaurant.photograph}.jpg`);
    }
      
    /**
    * Restaurant image alt.
    */
    static altTextForRestaurant(restaurant) {
      return (`${restaurant.name} Restaurant`);
    }
    
    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
      const marker = new google.maps.Marker({
        position: restaurant.latlng,
        title: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant),
        map: map,
        animation: google.maps.Animation.DROP}
      );
      return marker;
    }
    
  static removeMapsTabOrder() {
      document.querySelectorAll('#map div, #map iframe, #map area, #map a, #map button').forEach((item) => {
        item.setAttribute('tabindex', '-1');
      });
    }
  };
//   static getReviews(restaurantId) {

//       fetch('http://localhost:1337/reviews/?restaurant_id=' + restaurantId)
//       // ${restaurantId}`)
//         .then(function(response) {
//           return response.json();
//         })
//         .then(function(myJson) {
//           console.log(myJson);
//         });

//     }

//  };

       // fetch(fetch(`http://localhost:1337/reviews/?restaurant_id=${restaurantId}`))
      // .then((resp) => resp)
      // .then(function(data) {
      //   return data      
      // })
      // .catch(function(error) {
      //   console.log(error);
      // })