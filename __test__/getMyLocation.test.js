import { getMyLocation } from "../src/client/js/getMyLocation";

describe("Testing the getMyLocation functionality", () => {
    test("Testing the getMyLocation function exists", () => {
        expect(getMyLocation).toBeDefined();
    })
});
