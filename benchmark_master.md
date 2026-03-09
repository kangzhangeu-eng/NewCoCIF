C'est bien noté. En intégrant les spécificités des dernières captures de Meilleurtaux Placement (notamment la Gestion Libre, le Quiz de Connaissance avec feedback immédiat, et le niveau de détail du KYC), nous arrivons à la version "Ultimate" de la spécification.

Voici le Document de Spécification Technique Master (V3.0). Il fusionne l'UX émotionnelle de Goodvest avec la puissance fonctionnelle de Meilleurtaux.

C'est ce document exact que tu dois fournir à ton agent de codage (Windsurf/Cursor) pour générer le projet complet.

MASTER SPECIFICATION: NEWCO (Hybrid Fintech Platform)
Version: 3.0 (Finale & Complète) Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, Recharts, React Hook Form + Zod.

1. Analyse Différentielle & Synthèse Hybride
Ce que Meilleurtaux apporte (vs Goodvest)
La Caution "Expert" : La présence constante d'un visage humain (Marc Fiorentino) et de citations ("Le conseil de...") rassure sur chaque écran.

Gestion Libre (DIY) : La possibilité de construire son portefeuille soi-même (choix des ETF/Fonds) vs l'approche "Boîte noire" de Goodvest.

Feedback Pédagogique Immédiat : Le quiz de connaissance ne se contente pas de passer à la suite, il valide la réponse instantanément ("Bravo, en effet !") ou corrige ("Faux, en réalité...") avant le clic suivant.

Rigueur Budgétaire : Calcul précis du "Reste à vivre" (Revenus - Charges), là où Goodvest ne demande que des tranches de revenus.

Sécurité Liquidité : La question bloquante "Avez-vous besoin de disposer de l'épargne avant la fin ?" est un filet de sécurité réglementaire majeur.

Le "Meilleur des Deux Mondes" (L'Expérience Cible)
Design System : Goodvest. (Épuré, Vert Forêt, Cartes arrondies, Typographie moderne). Meilleurtaux est visuellement trop dense et daté.

Intelligence Métier : Meilleurtaux. (Algorithmes de solvabilité, Gestion Libre, Profondeur du questionnaire).

Architecture UI : Hybride (Split Screen). Une zone d'action propre (Goodvest) + une zone de conseil latérale persistante (Meilleurtaux).

2. Master User Flow (Le Tunnel Complet)
Le tunnel est structuré en Expert Split Layout : À gauche l'action utilisateur (Formulaire style Goodvest), à droite le Context Expert (Conseil pédagogique style Meilleurtaux).

Phase 1 : Cadrage & Solvabilité (Lead Gen)
Projet & Montants :

Objectif (Retraite, Immo...) -> UI Goodvest.

Montants (Initial / Mensuel).

Horizon & Liquidité (Le Gatekeeper Meilleurtaux) :

Input: Durée (ex: 8 ans).

Question Critique: "Besoin de disposer de l'épargne avant ?" (Oui/Non/Partiel).

Logique: Si Horizon < 2 ans ET Besoin Liquidité = Total -> Modale Bloquante (Produit inadapté, redirection vers Livret).

Santé Financière (Le "Budget Scan") :

Revenus annuels (Input précis).

Charges mensuelles (Crédit, Loyer) -> Ajout clé Meilleurtaux.

Logique: Calcul du "Reste à vivre" en temps réel. Warning si taux d'effort > 35%.

Phase 2 : Profilage Expert (MIF II)
Expérience Financière : Matrice de choix "J'ai déjà investi dans..." (Actions, Crypto, Produits Structurés...).

Quiz de Connaissance (L'Interaction "Bravo") :

Série de questions Vrai/Faux (ex: "Une obligation est garantie ?").

Interaction Clé : Au clic sur une réponse, une Box Feedback (Verte ou Rouge) apparaît immédiatement sous la question pour expliquer la bonne réponse. Le bouton "Suivant" ne s'active qu'après l'affichage du feedback.

Psychologie du Risque : Scénario de perte (-10% / -30%) -> UI Goodvest (plus visuelle).

Préférences ESG : "L'impact est-il essentiel ?" (Oui/Non).

Phase 3 : Stratégie & Allocation (Le "Fork")
Choix du Mode de Gestion :

Option A : Gestion Pilotée (Algorithme standard Goodvest).

Option B : Gestion Libre (Feature Power-User Meilleurtaux).

Page Recommandation :

Si Pilotée : Graphique de projection + Thèmes.

Si Libre : Allocation Builder (Tableau dynamique pour ajouter/supprimer des fonds et définir les % manuellement).

Validation : Transparence des frais et Gatekeeper Email.

Phase 4 : Conformité & Signature (KYC Deep Dive)
État Civil : Nom, Prénom, Naissance.

Profession & PPE :

Recherche de profession (Searchable Select).

Logique PPE : Si la case "Personne Politiquement Exposée" est cochée -> Déplier dynamiquement les champs "Fonction" et "Pays".

Fiscalité : Résidence fiscale + Check FATCA (US Person).

Bénéficiaires : Clause Standard vs Clause Libre.

Signature : Scroll obligatoire des documents PDF (DICI/CGV) pour activer la checkbox.

3. Dictionnaire de Données (Zustand Store)
TypeScript

interface NewcoState {
  // --- LEAD & PROJET ---
  project: {
    goal: string;
    initialAmount: number;
    monthlyAmount: number;
    horizon: number;
    liquidityNeed: 'total' | 'partial' | 'none'; // Critical Suitability Check
  };

  // --- BUDGET & SOLVABILITÉ ---
  finance: {
    annualIncome: number;
    monthlyCharges: number; // New: Meilleurtaux logic
    financialAssets: number;
    realEstateAssets: number;
  };

  // --- PROFIL & QUIZ ---
  riskProfile: {
    knowledgeQuiz: Record<string, { answer: boolean; isCorrect: boolean }>;
    riskTolerance: 'defensive' | 'balanced' | 'dynamic' | 'audacious';
    esgEssential: boolean;
  };

  // --- PORTEFEUILLE (Le Fork) ---
  portfolio: {
    mode: 'managed' | 'free'; // Pilotée vs Libre
    // Si Managed
    managedTheme?: string;
    // Si Free
    freeAllocation: Array<{
      isin: string;
      name: string;
      type: 'etf' | 'opcvm' | 'scpi';
      allocationPercentage: number; // Must sum to 100%
    }>;
  };

  // --- KYC COMPLEXE ---
  kyc: {
    civil: { firstName: string; lastName: string; birthDate: string; };
    profession: {
      status: string;
      isPEP: boolean; // Personne Politiquement Exposée
      pepDetails?: { function: string; country: string; };
    };
    fiscality: {
      isUSPerson: boolean; // FATCA Block
      taxResidence: string;
    };
    beneficiaries: {
      clauseType: 'standard' | 'children' | 'free';
      freeText?: string;
    };
  };
}
4. Composants UI & Règles Métier (Guide d'Implémentation)
A. Le Layout "Expert Split"
Desktop : Écran divisé 2/3 (Gauche : Formulaire Goodvest) - 1/3 (Droite : Panneau Expert Meilleurtaux).

Composant ExpertPanel : Reçoit le stepId courant et affiche un contenu contextuel (ex: "Pourquoi calculer vos charges ?" à l'étape Budget) + Avatar Expert.

B. Le Quiz Interactif (QuizStep)
Comportement :

User clique sur "Vrai".

QuizFeedbackCard (Composant vert/rouge) s'anime (framer-motion slideUp).

Le bouton "Suivant" passe de disabled à enabled.

C. Le Constructeur d'Allocation (AllocationBuilder)
Usage : Uniquement si portfolio.mode === 'free'.

UI : Tableau avec colonnes "Support", "Risque", "Poids %".

Validation : Un compteur "Reste à investir" en bas. Le bouton "Valider" est bloqué tant que la somme != 100%.

D. Règles de Blocage (Gatekeepers)
Liquidité : Si horizon < 2 et liquidityNeed === 'total', déclencher IncompatibleProductModal.

Solvabilité : Si monthlyAmount > (income/12 - charges) * 0.35, afficher un Toast Warning "Effort d'épargne élevé".

US Person : Si isUSPerson === true, bloquer le parcours (Compliance).