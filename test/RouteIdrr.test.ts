
import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { Application } from 'express';

import { RouteIdrr } from '../src';
import Extractor from '../src/lib/Extractor';
import Identifier from '../src/lib/Identifier';

const identifierClear = jest.spyOn(Identifier, 'clear');
const identifierLoad = jest.spyOn(Identifier, 'load');
const identifierIdentifyUri = jest.spyOn(Identifier, 'identifyUri');

const extractorExtractUris = jest.spyOn(Extractor, 'extractUris');

describe('RouteIdrr', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('loadUris', () => {
        it('should clear identifier cache, call to extract and reload identifiers cache', async () => {

            const mockApp = <Application>{};
            const mockExtractedUris = ['/some/path'];

            extractorExtractUris.mockReturnValue(mockExtractedUris);

            RouteIdrr.loadUris(mockApp);

            expect(identifierClear).toHaveBeenCalled();

            expect(extractorExtractUris).toHaveBeenCalled();
            expect(extractorExtractUris).toHaveBeenCalledWith(mockApp);

            expect(identifierLoad).toHaveBeenCalled();
            expect(identifierLoad).toHaveBeenCalledWith(mockExtractedUris);
        });
    });

    describe('getUris', () => {
        it('should return loaded URIs', async () => {
            const mockExtractedUris = ['/some/path'];

            RouteIdrr['loadedUris'] = mockExtractedUris;

            const sutResult = RouteIdrr.getUris();

            expect(sutResult).toEqual(mockExtractedUris);

            RouteIdrr['loadedUris'] = <any>null;
        });

        it('should throw an error if URIs havent been loaded', async () => {
            expect(() => RouteIdrr.getUris()).toThrow(`No URIs were loaded`);
        });
    });

    describe('getNormalizedUri', () => {
        it('should call to identify the URI', async () => {
            const mockExtractedUris = ['/some/path'];

            RouteIdrr['loadedUris'] = mockExtractedUris;
            identifierIdentifyUri.mockReturnValue(mockExtractedUris[0]);

            const sutResult = RouteIdrr.getNormalizedUri(mockExtractedUris[0]);

            expect(identifierIdentifyUri).toHaveBeenCalled();
            expect(identifierIdentifyUri).toHaveBeenCalledWith(mockExtractedUris[0]);

            expect(sutResult).toEqual(mockExtractedUris[0]);

            RouteIdrr['loadedUris'] = <any>null;
        });

        it('should throw an error if URIs havent been loaded', async () => {
            expect(() => RouteIdrr.getNormalizedUri('fake input uri')).toThrow(`No URIs were loaded`);
        });
    });

});