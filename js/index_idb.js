const dbPromise = idb.open('keyval-store', 1, upgradeDB => {
    upgradeDB.createObjectStore('objs', {keyPath: 'id'});
  });
