
import { describe, it, expect } from '@jest/globals';
import express from 'express';

import Extractor from '../src/lib/Extractor';


describe('Extractor', () => {

    describe('extractUris', () => {

        it('should extract all the express defined routes', async () => {
            const app = express();

            const mockFn = (req, res) => res.json('hello');

            app.get('/base', mockFn);
            app.get('/base/:baseParam', mockFn);

            const routerLevelOne = express.Router()
            routerLevelOne.get('/levelOne/path', mockFn);
            routerLevelOne.get('/levelOne/:levelOneId/path/:levelOneSecondId', mockFn);

            const routerLevelTwo = express.Router();
            routerLevelTwo.get('/levelTwo/path', mockFn);
            routerLevelTwo.get('/levelTwo/:levelTwoId/path/:levelTwoSecondId', mockFn);

            routerLevelOne.use('/nesting', routerLevelTwo);
            app.use('/', routerLevelOne);

            const sutResult = Extractor.extractUris(app);

            expect(sutResult).toEqual([
                '/base',
                '/base/:baseParam',
                '/levelOne/path',
                '/levelOne/:levelOneId/path/:levelOneSecondId',
                '/nesting/levelTwo/path',
                '/nesting/levelTwo/:levelTwoId/path/:levelTwoSecondId'
            ]);
        });
        
    });

});