# eroute-idrr

Express Route Identifier

## Motivation

Ability to extract, identify and normalize express route (paremeterized) uris.    

### Installing

```
npm install --save eroute-idrr
```

#### Notes
- the URIs must be loaded after the express routes have been initialised for obvisous reasons
- this util does not make any type discriminations: uri `/base/101` and uri `/base/abcdUser` will both resolve to the same `/base/:baseParam` path

### Usage

```typescript
import { RouteIdrr } from 'eroute-idrr'

const app = express();

const mockFn = (req, res) => res.json('hello');

app.get('/base', mockFn);
app.get('/base/:baseParam', mockFn);

const routerLevelOne = express.Router()
routerLevelOne.get('/levelOne/path/:paramOne/one', mockFn);
routerLevelOne.get('/levelOne/path/:paramOne/two', mockFn);

const routerLevelTwo = express.Router();
routerLevelTwo.get('/levelTwo/path', mockFn);
routerLevelTwo.get('/levelTwo/:levelTwoId/path/:levelTwoSecondId/one', mockFn);
routerLevelTwo.get('/levelTwo/:levelTwoId/path/:levelTwoSecondId/two', mockFn);

routerLevelOne.use('/nesting', routerLevelTwo);
app.use('/', routerLevelOne);

RouteIdrr.loadUris(app); // read and load express app routes

console.error(RouteIdrr.getUris()); // get all parsed routes if needed
// [
//    '/base',
//    '/base/:baseParam',
//    '/levelOne/path/:paramOne/one',
//    '/levelOne/path/:paramOne/two',
//    '/nesting/levelTwo/path',
//    '/nesting/levelTwo/:levelTwoId/path/:levelTwoSecondId/one',
//    '/nesting/levelTwo/:levelTwoId/path/:levelTwoSecondId/two'
// ]

console.error(RouteIdrr.getNormalizedUri('/base/5423'));
// /base/:baseParam

console.error(RouteIdrr.getNormalizedUri('/one/path/101/one'));
// /levelOne/path/:paramOne/one

console.error(RouteIdrr.getNormalizedUri('/one/path/USERIDHERE/two'));
// /levelOne/path/:paramOne/two

console.error(RouteIdrr.getNormalizedUri('/nesting/levelTwo/101/path/abcdefg/one'));
// /nesting/levelTwo/:levelTwoId/path/:levelTwoSecondId/one

console.error(RouteIdrr.getNormalizedUri('/nesting/levelTwo/9000/path/102/two'));
// /nesting/levelTwo/:levelTwoId/path/:levelTwoSecondId/tw
```


## License
This library is licensed under the Apache 2.0 License