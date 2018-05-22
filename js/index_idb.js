const dbPromise = idb.open('keyval-store', 1, upgradeDB => {
    upgradeDB.createObjectStore('objs', {keyPath: 'id'});
  });

// const dbPromise = idb.open('keyval-store', 0, upgradeDB => {
//     // Note: we don't use 'break' in this switch statement,
//     // the fall-through behaviour is what we want.
//     switch (upgradeDB.oldVersion) {
//       case 0:
//       upgradeDB.createObjectStore('objs', {keyPath: 'id'});
//       case 1:
//         upgradeDB.createObjectStore('objs', {keyPath: 'id'});
//     }
//   });
