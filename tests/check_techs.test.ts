import { planifyLab } from "../src/index";
import { MOCK_DATA } from "../src/mocks";

describe('Debug Check', () => {
    test('Affiche les logs des techniciens', () => {
        // Cela va lancer ta fonction et afficher tes console.log
        planifyLab(MOCK_DATA);
    });
});