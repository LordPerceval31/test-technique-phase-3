import { planifyLab } from './index';
import { TEST_CASE_2, TEST_CASE_3 } from './mocks';

console.log("🔍 --- TEST DU CAS 2 (Priorités) ---");

// On lance la fonction
const resultat1 = planifyLab(TEST_CASE_2);

console.log("Liste des tâches planifiées (Dans l'ordre) :");

// On affiche le JSON proprement
console.log(JSON.stringify(resultat1.schedule, null, 2));


console.log(" --- MÉTRIQUE ET PARALLÉLISME --- ")
console.log("Objectif : Temps Total = 105, Efficacité = 129\n");

const result3 = planifyLab(TEST_CASE_3)

console.log("PLANNING GÉNÉRÉ :");
console.log(JSON.stringify(result3.schedule, null, 2));

console.log("MÉTRIQUES :");
console.log(`Temps Total : ${result3.metrics.totalTime} min`);
console.log(`Efficacité  : ${result3.metrics.efficiency} %`);
console.log(`Conflits    : ${result3.metrics.conflicts}`);
console.log("--------------------");