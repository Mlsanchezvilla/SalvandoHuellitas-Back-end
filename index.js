//              ,~-.
//             (  ' )-.          ,~'`-.
//          ,~' `  ' ) )       _(   _) )
//         ( ( .--.===.--.    (  `    ' )
//           .%%.:::|888.#`.   `-'`~~=~'
//          /%%/::::|8888\##\
//         |%%/:::::|88888\##|
//         |%%|:::::|88888|##|.,-.
//         \%%|:::::|88888|##/    )_
//          \%\:::::|88888/#/ ( `'  )
//           \%\::::|8888/#/(  ,  -'`-.
//       ,~-. `%\:::|888/#'(  (     ') )
//      (  ) )_ `\__|__/'   `~-~=--~~='
//     ( ` ')  ) [VVVVV]
//    (_(_.~~~'   \|_|/
//                [XXX]
//                '"""'

const axios = require("axios");
const server = require("./src/server"); //* requires server
const { conn } = require('./src/db.js'); //* imports connection to the DB
const PORT = 3001; //* previous port definition


// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  //* force: true borra db
  //* alter: true mantiene db
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`); //* confirmation
  // populateDb();
});
}).catch(error => console.error(error));