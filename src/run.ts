import { planifyLab } from './index';
import { TEST_CASE_2, TEST_CASE_3 } from './mocks';

console.log("🔍 --- TEST DU CAS 2 (Priorités) ---");

// On lance la fonction
const resultat1 = planifyLab(TEST_CASE_2);

console.log("Liste des tâches planifiées (Dans l'ordre) :");
console.log("------------------------------------------");

// On affiche le JSON proprement
console.log(JSON.stringify(resultat1.schedule, null, 2));


console.log("🔍 --- DONNÉES EN ENTRÉE (Mocks) ---");
console.log(`Nombre d'échantillons à traiter : ${TEST_CASE_3.samples.length}`);
console.log("-------------------------------------------\n");

// On lance la machine
const resultat2 = planifyLab(TEST_CASE_3);

console.log("🚀 --- RÉSULTAT DU PLANNING (Ce qui a été pushé) ---");
// Le 'null, 2' permet d'aérer l'affichage
console.log(JSON.stringify(resultat2.schedule, null, 2));

console.log("\n-------------------------------------------");