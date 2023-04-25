
import _ from 'lodash';


class Identifier {

    private decomposedUris: string[][];

    public identifyUri(uriToIdentify: string): string {

        const decomposedUriToIdentify = this.decompose(uriToIdentify);

        const filteredBySize = _.filter(this.decomposedUris, uriComponents => uriComponents.length === decomposedUriToIdentify.length);

        return this.filterUntilMatch(filteredBySize, decomposedUriToIdentify);
    }

    public load(baseUris: string[]) {
        this.decomposedUris = _.map(baseUris, uri => this.decompose(uri));
    }

    public clear() {
        this.decomposedUris = [];
    }

    private filterUntilMatch(uris: string[][], targetUri: string[], index = 0, haveAlreadyIncremented = false): string {

        const nextFitler = _.filter(uris, uri => uri[index] === targetUri[index]);

        if (!_.isEmpty(nextFitler)) {
            if (nextFitler.length === 1 && index === targetUri.length) {
                return this.compose(nextFitler.shift());
            } else {
                return this.filterUntilMatch(nextFitler, targetUri, ++index);
            }
        } else {
            if (haveAlreadyIncremented) {
                return null;
            } else {
                return this.filterUntilMatch(uris, targetUri, ++index, true);
            }
        }
    }

    private decompose(uri: string): string[] {
        const hasLeadingSlash = uri.startsWith('/');
        const decomposed = uri.split('/');

        hasLeadingSlash && decomposed.shift()
        return decomposed;
    }

    private compose(uriComponents: string[]): string {
        return '/' + uriComponents.join('/');
    }

}

export default new Identifier();