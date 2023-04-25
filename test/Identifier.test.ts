
import { describe, it, expect } from '@jest/globals';

import Identifier from '../src/lib/Identifier';


describe('Identifier', () => {

    describe('identifyUri', () => {
        it('should identify the passed in uris', async () => {
            const mockRoutes = [
                '/one/path/:paramOne/one',
                '/one/path/:paramTwo/two',
                '/one/path/:paramOne/one/:nestedOne/one',
                '/one/path/:paramTwo/one/:nestedTwo/two'
            ];

            Identifier.load(mockRoutes);

            const firstSutResult = Identifier.identifyUri('/one/path/101/one');
            expect(firstSutResult).toEqual('/one/path/:paramOne/one');

            const secondSutResult = Identifier.identifyUri('/one/path/USERIDHERE/two');
            expect(secondSutResult).toEqual('/one/path/:paramTwo/two');
            
            const thirdSutResult = Identifier.identifyUri('/one/path/101/one/102/one');
            expect(thirdSutResult).toEqual('/one/path/:paramOne/one/:nestedOne/one');

            const fourthSutResult = Identifier.identifyUri('/one/path/ABDCEFG/one/SUPERUSER/two');
            expect(fourthSutResult).toEqual('/one/path/:paramTwo/one/:nestedTwo/two');
        });
    });

    describe('load', () => {
        it('should load the passed in decomposed ids', async () => {
            Identifier.load([
                '/base',
                '/base/:baseParam',
                '/levelOne/path',
                '/levelOne/:levelOneId/path/:levelOneSecondId',
                '/nesting/levelTwo/path',
                '/nesting/levelTwo/:levelTwoId/path/:levelTwoSecondId'
            ]);

            expect(Identifier['decomposedUris']).toEqual([
                ['base'],
                ['base', ':baseParam'],
                ['levelOne', 'path'],
                ['levelOne', ':levelOneId', 'path', ':levelOneSecondId'],
                ['nesting', 'levelTwo', 'path'],
                ['nesting', 'levelTwo', ':levelTwoId', 'path', ':levelTwoSecondId']
            ]);
        });
    });

    describe('clear', () => {
        it('should clear its state', async () => {

            const fakeState = [['fakeState']];

            Identifier['decomposedUris'] = [['fakeState']];

            Identifier.clear();

            expect(Identifier['decomposedUris']).toEqual([]);
        });
    });

});