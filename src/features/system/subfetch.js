import Fetch from 'utils/fetch'

export default class SubFetch{

    static subinstance;

    static getInstance() {
        if (!SubFetch.subinstance) {
            SubFetch.subinstance = new Fetch("system");
        }
        return SubFetch.subinstance;
    }
}
