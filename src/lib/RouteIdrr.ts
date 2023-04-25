
import express from 'express';

import Extractor from './Extractor';
import Identifier from './Identifier';


class RouteIdrr {

    private loadedUris: string[];

    public loadUris(expressApp: express.Application) {
        Identifier.clear();

        this.loadedUris = Extractor.extractUris(expressApp);

        Identifier.load(this.loadedUris);
    }

    public getUris() {
        if (this.loadedUris) {
            return this.loadedUris;
        } else {
            throw new Error(`No URIs were loaded`);
        }
    }

    public getNormalizedUri(inputUri: string): string {
        if (this.loadedUris) {
            return Identifier.identifyUri(inputUri);
        } else {
            throw new Error(`No URIs were loaded`);
        }
    }

}


export default new RouteIdrr();