import { planifyLab } from "../src/index";
import { MOCK_DATA } from "../src/mocks";

describe('Debug Check', () => {
    test('Affiche les logs des techniciens', () => {
        planifyLab(MOCK_DATA);
    });
});